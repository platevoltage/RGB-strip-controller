//set IwIP to higher bandwidth!!!


//user prefs------

// #define WS2801 // uncomment for ws2801
// #define INSTALL_PREFS // uncomment to preload wifi and system prefs.
#define STASSID "Can't stop the signal, Mal"
#define STAPSK "youcanttaketheskyfromme"
#define BONJOURNAME "test"
#define DATA_PIN 5
#define WS2801_DATA_PIN 15
#define WS2801_CLK_PIN 13

//--------

#ifdef ESP32
#define JSON_BUFFER_SIZE 91000
#define MAX_PIXELS 700

#else
//31000 max for esp8266. 250 pixels.
#define JSON_BUFFER_SIZE 31000
#define MAX_PIXELS 250

#endif


#include "json.hpp"
#include "color.hpp"
#include "eeprom.hpp"
#include "effects.hpp"
#include "string.hpp"
#include "server.hpp"



#ifdef WS2801
  #include <Adafruit_WS2801.h>
  Adafruit_WS2801* pixels = NULL;
#else
  #include <Adafruit_NeoPixel.h>
  Adafruit_NeoPixel* pixels = NULL;
#endif

static uint16_t groups[5][2] = {};
static uint8_t activeGroups = 0;
static bool pauseEffects = false;

static uint8_t dataPin;
static uint8_t pixelType;


void setStripLength(uint16_t newStripLength) {
  stripLength = newStripLength;
  if (stripLength > MAX_PIXELS) stripLength = MAX_PIXELS;
  pixels->updateLength(stripLength);
}

void setPixel(uint16_t position, uint32_t color, bool show = false) {
  pixels->setPixelColor(position, color);
  if (show) pixels->show();
}

uint32_t readPixel(uint16_t position) {
  return pixels->getPixelColor(position);
}

void getPreferences() {

  sendHeaders();
  String preferenceString = readSystemPrefsFromEEPROM();
  Serial.println(preferenceString);
  ssid = getValue(preferenceString, '\n', 0);
  password = getValue(preferenceString, '\n', 1);
  bonjourName = getValue(preferenceString, '\n', 2);
  dataPin = getValue(preferenceString, '\n', 3).toInt();
  pixelType = getValue(preferenceString, '\n', 4).toInt();
  brightness = getValue(preferenceString, '\n', 5).toInt();
  
  String message = "{\"pin\":\"";
  message += dataPin;
  message += "\", \"bitOrder\":\"";
  message += pixelType;
  message += "\", \"ssid\":\"";
  message += ssid;
  message += "\", \"password\":\"";
  message += password;
  message += "\", \"bonjour\":\"";
  message += bonjourName;
  message += "\", \"brightness\":\"";
  message += brightness;
  message += "\"}";

  server.send(200, "text/json", message);

}

void savePreferences() {
  sendHeaders();
  DynamicJsonDocument jsonBuffer(5000);
  DeserializationError error = deserializeJson(jsonBuffer, server.arg("plain"));
  Serial.println(server.arg("plain"));
  if (error) {
    server.send(200, "text/json", F("{success:false}"));
    jsonBuffer.clear();
  }
  else {
    dataPin = jsonBuffer["pin"];
    pixelType = jsonBuffer["bitOrder"];
    const char* _ssid = jsonBuffer["ssid"];
    ssid = _ssid;
    const char* _password = jsonBuffer["wifiPassword"];
    password = _password;
    const char* _bonjourName = jsonBuffer["bonjourName"];
    bonjourName = _bonjourName;
    brightness = jsonBuffer["brightness"];

    writeSystemPrefsToEEPROM(ssid, password, bonjourName, dataPin, pixelType, brightness);

    server.send(200, "text/json", F("{success:true}"));
    Serial.println(server.arg("plain"));

    delay(1000);
    ESP.restart();
  }
}

uint16_t * getDividersAndGroups(uint16_t dividers[4]) {
  String dividerString = readDividersFromEEPROM();
  for (int i=0; i < 4; i++) {
    dividers[i] = getValue(dividerString, '\n', i).toInt();
  }

  uint8_t numDividers = 0;  
  for (uint8_t i=0; i < 4; i++) {
    if (dividers[i] != 0) numDividers++;  
  }

  activeGroups = numDividers+1;
  for (uint8_t i=0; i<activeGroups; i++) {
    if (i == 0) groups[i][0] = 1;
    else groups[i][0] = dividers[i-1]+1;
    if (i < numDividers) groups[i][1] = dividers[i];
    else groups[i][1] = stripLength;
  }
  return dividers;
}

void getSchedule() {
  String scheduleString = readScheduleFromEEPROM();
  Serial.println(scheduleString);
  for (int i=0; i < scheduleLength; i++) {
    schedule[i] = getValue(scheduleString, '\n', i).toFloat();
  }
}

uint32_t * getPixelData(uint32_t pixelData[], uint8_t profile) {
  String pixelString = readPixelsFromEEPROM(profile);
  for (uint16_t i = 0; i < stripLength; i++) {
    uint32_t singlePixel = toInt32(getValue(pixelString, '\n', i));
    pixelData[i] = singlePixel;
  }
  return pixelData;
}

void getCurrentConfig() {
  sendHeaders();

  uint8_t profileArg = server.arg(0).toInt();
  bool colorsOnly = server.arg(1).toInt();
  uint16_t _effectSpeed = 0;

  if (!colorsOnly) {
    stripLength = readStripLengthFromEEPROM();
    getSchedule();
    _effectSpeed = readEffectSpeedFromEEPROM(profileArg);
  }

  uint32_t pixelArray[stripLength];
  uint32_t * pixelData = getPixelData(pixelArray, profileArg);
  
  uint16_t dividersArray[4] = {};
  uint16_t * dividers = getDividersAndGroups(dividersArray);

  String message = jsonStringify(epoch, pixelData, 4, dividers, profileArg, scheduleLength, schedule, _effectSpeed);
  if (millis() > 30000) epoch = getTime();
  server.send(200, "text/json", message);

}

void activateProfile(uint8_t oldProfile, uint8_t newProfile) {

    pauseEffects = true;

    // if(millis() > 5000) fadeOut(readPixel, setPixel);

    effectSpeed = readEffectSpeedFromEEPROM(newProfile);

    uint32_t oldPixelArray[stripLength];
    uint32_t * oldPixelData = getPixelData(oldPixelArray, oldProfile);
    uint32_t newPixelArray[stripLength];
    uint32_t * newPixelData = getPixelData(newPixelArray, newProfile);
    if(millis() < 5000) fadeIn(newPixelData, readPixel, setPixel);
    else crossFade(oldPixelData, newPixelData, setPixel);

    pauseEffects = false;
}


void updateConfig() {
  sendHeaders();

  DynamicJsonDocument jsonBuffer(JSON_BUFFER_SIZE);
  DeserializationError error = deserializeJson(jsonBuffer, server.arg("plain"));
  Serial.println(server.arg("plain"));
  if (error) {
    server.send(200, "text/json", F("{success:false}"));
    jsonBuffer.clear();
  }
  else {
    // const char *status = jsonBuffer["status"];
    // uint16_t length = jsonBuffer["length"];
    uint16_t _stripLength = jsonBuffer["stripLength"];
    uint16_t _effectSpeed = jsonBuffer["effectSpeed"];
    const uint8_t _profile = jsonBuffer["profile"];
    
    scheduleLength = jsonBuffer["schedule"].size();

    for (uint16_t i=0; i<scheduleLength; i++) {
      schedule[i] = jsonBuffer["schedule"][i];
    }
    
    if (_stripLength > MAX_PIXELS) _stripLength = MAX_PIXELS;
    if (stripLength != _stripLength) {
      pixels->updateLength(stripLength);
      stripLength = _stripLength;
    }
    server.send(200, "text/json", F("{success:true}"));

    uint16_t dividersLength = jsonBuffer["dividers"].size();
    uint16_t dividers[dividersLength];
    for (uint16_t i=0; i<dividersLength; i++) {
      dividers[i] = jsonBuffer["dividers"][i];
    }
    
    uint32_t pixelData[stripLength];

    for (uint16_t i = 0; i < stripLength; i++) {
      pixelData[i] = jsonBuffer["color"][i];
      pixels->setPixelColor(i, pixelData[i]);
    }
    pixels->show();

    writeDividersToEEPROM(dividers, dividersLength);
    writeScheduleToEEPROM(schedule, scheduleLength);
    writePixelsToEEPROM(pixelData, stripLength, _profile);
    writeEffectSpeedToEEPROM(_effectSpeed, _profile);
    writeStripLengthToEEPROM(stripLength);
    writeCurrentProfileToEEPROM(profile);


  }

}






void setup() {

  // pinMode(LED_BUILTIN, OUTPUT);
  // digitalWrite(LED_BUILTIN, 0);
  Serial.begin(115200);


  Serial.println("Mount LittleFS");
  #ifdef ESP32
  if(!LittleFS.begin(true)) {
        Serial.println("LittleFS Mount Failed");
        return;
  }
  #else
  if(!LittleFS.begin()) {
        Serial.println("LittleFS Mount Failed");
        return;
  }
  #endif

  
  #ifdef INSTALL_PREFS
  writeSystemPrefsToEEPROM(STASSID, STAPSK, BONJOURNAME, DATA_PIN, 201, 100);
  #endif

  getPreferences();

  #ifdef WS2801
    pixels = new Adafruit_WS2801(stripLength, WS2801_DATA_PIN, WS2801_CLK_PIN);
  #else
    pixels = new Adafruit_NeoPixel(stripLength, dataPin, pixelType + NEO_KHZ800);
  #endif

  pixels->begin();


  setStripLength(readStripLengthFromEEPROM());

  getSchedule();
  uint16_t dividersArray[4] = {};
  getDividersAndGroups(dividersArray);

  getCurrentConfig(); 
  activateProfile(profile, profile);

  serverStart(updateConfig, getCurrentConfig, getPreferences, savePreferences);

  createDir("/0");
  createDir("/1");
  createDir("/2");
  createDir("/3");
  // listDir("/");

  epoch = getTime(); 
  
}



void loop() {
  webClientTimer(10);
  NTPTimer();
  if (effectSpeed > 0 && millis() > 10000 && !pauseEffects) effectTimer(effectSpeed, activeGroups, groups, readPixel, setPixel);
  clockTick(activateProfile);


  // NTP often fails on first try. Will repeat getTime for 30 seconds.
  if (epoch < 100000 && millis() < 30000) {
    Serial.println("NTP FAIL");
    epoch = getTime();
  }
  yield() ;
  // Serial.println(activeGroups);
}
