//set IwIP to higher bandwidth!!!


//user prefs------

// #define WS2801 // uncomment for ws2801
#define STASSID "Can't stop the signal, Mal"
#define STAPSK "youcanttaketheskyfromme"
// #define APSSID "ESPap"
// #define APPSK  "thereisnospoon"
#define BONJOURNAME "test"
#define DATA_PIN 5
#define WS2801_DATA_PIN 15
#define WS2801_CLK_PIN 13

//--------

#ifdef ESP32
#define JSON_BUFFER_SIZE 91000
#define EEPROM_SIZE 3000
#define MAX_PIXELS 700

#else
//31000 max for esp8266. 150 pixels.
#define JSON_BUFFER_SIZE 31000
#define EEPROM_SIZE 2048
#define MAX_PIXELS 180

#endif

#include "ota.h"
#include "json.h"
#include "color.h"
#include "eeprom.h"
#include "effects.h"
#include "string.h"
#include "server.h"


//----begin generated includes and wifi definitions

//// in server.h

//----end generated includes and wifi definitions

static uint16_t stripLength = 32;
static uint16_t groups[5][2] = {};
static uint8_t activeGroups = 0;
static uint16_t effectSpeed = 0;

#ifdef WS2801
#include <Adafruit_WS2801.h>
Adafruit_WS2801 pixels = Adafruit_WS2801(stripLength, WS2801_DATA_PIN, WS2801_CLK_PIN);
#else
#include <Adafruit_NeoPixel.h>
Adafruit_NeoPixel pixels(stripLength, DATA_PIN, NEO_GRBW + NEO_KHZ800);
#endif


void getCurrentConfig() {

  sendHeaders();
  uint32_t currentData[stripLength] = {};

  String pixelData = readPixelsFromEEPROM();
  for (uint16_t i = 0; i < stripLength; i++) {
    uint32_t singlePixel = toInt32(getValue(pixelData, '\n', i));
    currentData[i] = singlePixel;
    pixels.setPixelColor(i, colorMod(singlePixel));
    delay(10);
    pixels.show();
  }

  //dividers and groups
  effectSpeed = readEffectSpeedFromEEPROM();

  uint16_t dividers[4];
  String dividerString = readDividersFromEEPROM();
  for (int i=0; i < 4; i++) {
    dividers[i] = getValue(dividerString, '\n', i).toInt();
  }

  uint8_t numDividers = 0;
  for (uint8_t i=0; i < sizeof(dividers)/2; i++) {
    if (dividers[i] != 0) numDividers++;
  }

  activeGroups = numDividers+1;
  for (uint8_t i=0; i<activeGroups; i++) {
    if (i == 0) groups[i][0] = 1;
    else groups[i][0] = dividers[i-1]+1;
    if (i < numDividers) groups[i][1] = dividers[i];
    else groups[i][1] = stripLength;
  }

  String message = jsonStringify(stripLength, currentData, sizeof(dividers)/2, dividers, effectSpeed);

  server.send(200, "text/json", message);

}


void updateConfig() {
  DynamicJsonDocument jsonBuffer(JSON_BUFFER_SIZE);
  
  DeserializationError error = deserializeJson(jsonBuffer, server.arg("plain"));
  sendHeaders();
  Serial.println(server.arg("plain"));
  if (error) {
    server.send(200, "text/json", F("{success:false}"));
    Serial.println(error.c_str());
    jsonBuffer.clear();
    Serial.println(ESP.getFreeHeap());
    
  }

  else {
    const char *status = jsonBuffer["status"];
    uint16_t length = jsonBuffer["length"];
    stripLength = jsonBuffer["stripLength"];
    effectSpeed = jsonBuffer["effectSpeed"];
    
    if (stripLength > MAX_PIXELS) stripLength = MAX_PIXELS;
    pixels.updateLength(stripLength);
    server.send(200, "text/json", F("{success:true}"));

    uint16_t dividersLength = jsonBuffer["dividers"].size();
    uint16_t dividers[dividersLength];
    for (uint16_t i=0; i<dividersLength; i++) {
      dividers[i] = jsonBuffer["dividers"][i];
    }
    
    uint32_t currentData[stripLength];

    String pixelData = readPixelsFromEEPROM();
    for (uint16_t i = 0; i < stripLength; i++) {
      uint32_t singlePixel = toInt32(getValue(pixelData, '\n', i));
      currentData[i] = singlePixel;
    }

    for (uint16_t i = 0; i < stripLength; i++) {
      currentData[i] = jsonBuffer["color"][i];
      pixels.setPixelColor(i, colorMod(currentData[i]));
    }
    pixels.show();

    writeDividersToEEPROM(dividers, dividersLength);
    writePixelsToEEPROM(currentData, stripLength);
    writeEffectSpeedToEEPROM(effectSpeed);
    writeStripLengthToEEPROM(stripLength);

    jsonBuffer.clear();

  }
  jsonBuffer.clear();
}

void setStripLength(uint16_t newStripLength) {
  stripLength = newStripLength;
  if (stripLength > MAX_PIXELS) stripLength = MAX_PIXELS;
  pixels.updateLength(stripLength);
}

void setPixel(uint16_t position, uint32_t color, boolean show) {
  pixels.setPixelColor(position, color);
  if (show) pixels.show();
}

uint32_t readPixel(uint16_t position) {
  return pixels.getPixelColor(position);
}





void setup(void) {
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, 0);
  Serial.begin(115200);

  serverStart(updateConfig, getCurrentConfig);
  startOTA();
  // WiFi.softAP(ssid, password);
  // IPAddress myIP = WiFi.softAPIP();


  Serial.println();
  pixels.begin();

  // LittleFS.format();
  Serial.println("Mount LittleFS");
  if (!LittleFS.begin()) {
    Serial.println("LittleFS mount failed");
    return;
  }

  setStripLength(readStripLengthFromEEPROM());
  // readEEPROMAndSetPixels(setStripLength, setPixel);
  getCurrentConfig();

  
}



void loop(void) {
  webClientTimer(10);
  // server.handleClient();

  if (effectSpeed > 0 && millis() > 10000 && !server.client()) effectTimer(effectSpeed, activeGroups, groups, readPixel, setPixel);

}
