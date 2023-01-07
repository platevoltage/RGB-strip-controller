//set IwIP to higher bandwidth!!!


//user prefs------

// #define WS2801 // uncomment for ws2801
#define STASSID "Can't stop the signal, Mal"
#define STAPSK "youcanttaketheskyfromme"
// #define APSSID "ESPap"
// #define APPSK  "thereisnospoon"
#define BONJOURNAME "lamp"
#define DATA_PIN 5
#define WS2801_DATA_PIN 15
#define WS2801_CLK_PIN 13

//--------

#ifdef ESP32
#define JSON_BUFFER_SIZE 91000
#define EEPROM_SIZE 3000
#define MAX_PIXELS 700
#include <WiFi.h>
#include <WebServer.h>
#include <ESPmDNS.h>
WebServer server(80);

#else
//31000 max for esp8266. 150 pixels.
#define JSON_BUFFER_SIZE 31000
#define EEPROM_SIZE 2048
#define MAX_PIXELS 180
#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
ESP8266WebServer server(80);

#endif

#include <WiFiClient.h>
#include <WiFiUdp.h>
#include <ArduinoJson.h>
#include "ota.h"
#include "json.h"
#include "color.h"
#include "eeprom.h"
#include "effects.h"


//----begin generated includes and wifi definitions


#include "payload/manifest.json.h"
#include "payload/static/css/main.c83abc47.css.h"
#include "payload/static/js/main.ad3e66b4.js.h"
#include "payload/static/js/787.05b7a068.chunk.js.h"
#include "payload/index.html.h"



//----end generated includes and wifi definitions

static const char *ssid = STASSID;
static const char *password = STAPSK;
// const char *ssid = APSSID;
// const char *password = APPSK;
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

void handleNotFound() {
  digitalWrite(LED_BUILTIN, 1);
  String message = "File Not Found\n\n";
  message += "URI: ";
  message += server.uri();
  message += "\nMethod: ";
  message += (server.method() == HTTP_GET) ? "GET" : "POST";
  message += "\nArguments: ";
  message += server.args();
  message += "\n";

  for (uint8_t i = 0; i < server.args(); i++) {
    message += " " + server.argName(i) + ": " + server.arg(i) + "\n";
  }

  server.send(404, "text/plain", message);
  digitalWrite(LED_BUILTIN, 0);
}

void sendHeaders() {
  server.sendHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  server.setContentLength(CONTENT_LENGTH_UNKNOWN);
}

String getValue(String data, char separator, int index) {
    int found = 0;
    int strIndex[] = { 0, -1 };
    int maxIndex = data.length() - 1;

    for (int i = 0; i <= maxIndex && found <= index; i++) {
        if (data.charAt(i) == separator || i == maxIndex) {
            found++;
            strIndex[0] = strIndex[1] + 1;
            strIndex[1] = (i == maxIndex) ? i+1 : i;
        }
    }
    return found > index ? data.substring(strIndex[0], strIndex[1]) : "";
}

//turns 32 bit unsigned int from string to number. Built in method doesn't work.
uint32_t toInt32(String numberString) {
  if (numberString.length() == 9) {
    uint8_t straggler = (numberString[0] - '0');
    return numberString.substring(1, numberString.length()).toInt() + straggler*100000000;
  }
  if (numberString.length() == 10) {
    uint8_t straggler = ((numberString[0] - '0')*10 + (numberString[1] - '0'));
    return numberString.substring(2, numberString.length()).toInt() + straggler*100000000;
  }
  else return numberString.toInt();
}


void getCurrentConfig() {
  // readFile("/pixel.txt");
  sendHeaders();

  uint32_t currentData[stripLength] = {};
  String pixelData = readPixelsFromEEPROM();
  for (uint16_t i = 0; i < stripLength; i++) {
    uint32_t singlePixel = toInt32(getValue(pixelData, '\n', i));
    // currentData[i][0] = (uint8_t)(singlePixel >> 24);
    // currentData[i][1] = (uint8_t)(singlePixel >> 16);
    // currentData[i][2] = (uint8_t)(singlePixel >> 8);
    // currentData[i][3] = (uint8_t)(singlePixel);
    currentData[i] = singlePixel;

    pixels.setPixelColor(i, singlePixel);
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
  for (uint8_t i=0; i<numDividers+1; i++) {
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
      // writeDividerToEEPROM(i, jsonBuffer["dividers"][i]);
      dividers[i] = jsonBuffer["dividers"][i];
    }
    
    
    // uint8_t currentData[stripLength][4] = {};
    uint32_t currentData[stripLength];

    String pixelData = readPixelsFromEEPROM();

    for (uint16_t i = 0; i < stripLength; i++) {
      uint32_t singlePixel = toInt32(getValue(pixelData, '\n', i));
      currentData[i] = singlePixel;
      // currentData[i][0] = (uint8_t)(singlePixel >> 24);
      // currentData[i][1] = (uint8_t)(singlePixel >> 16);
      // currentData[i][2] = (uint8_t)(singlePixel >> 8);
      // currentData[i][3] = (uint8_t)(singlePixel >> 0);
      // pixels.setPixelColor(i, singlePixel);
      // delay(10);
      // pixels.show();
    }
    for (uint16_t i = 0; i < length; i++) {
      // uint8_t red = jsonBuffer["red"][i];
      // uint8_t green = jsonBuffer["green"][i];
      // uint8_t blue = jsonBuffer["blue"][i];
      // uint8_t white = jsonBuffer["white"][i];
      uint16_t position = jsonBuffer["positions"][i];
      uint32_t color = jsonBuffer["color"][position];

      // currentData[position][0] = red;
      // currentData[position][1] = green;
      // currentData[position][2] = blue;
      // currentData[position][3] = white;
      currentData[i] = color;
    }


    for (uint16_t i = 0; i < stripLength; i++) {
      // uint8_t red = currentData[i][0];
      // uint8_t green = currentData[i][1];
      // uint8_t blue = currentData[i][2];
      // uint8_t white = currentData[i][3];
      // pixels.setPixelColor(i, Color(red, green, blue, white));
      pixels.setPixelColor(i, currentData[i]);
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



unsigned long effectPreviousMillis = 0;
void effectTimer(uint16_t speed) {
    unsigned long currentMillis = millis();

    if (speed < 10) speed = 10;
    if (currentMillis - effectPreviousMillis >= speed) {
      Serial.print(server.client());
      Serial.print(" - ");
      Serial.print(millis());
      Serial.print(" - ");
      Serial.print(ESP.getFreeHeap());
      Serial.print(" - ");
      Serial.println(ESP.getHeapFragmentation());
      effectPreviousMillis = currentMillis;
      for(int i=0; i < activeGroups; i++) {
        walk(readPixel, setPixel, groups[i][0], groups[i][1]);
      }
     

    }
}

unsigned long webClientPreviousMillis = 0;
void webClientTimer(uint16_t speed) {
    unsigned long currentMillis = millis();
    if (currentMillis - webClientPreviousMillis >= speed) {
      webClientPreviousMillis = currentMillis;
      server.handleClient();
      ArduinoOTA.handle();
      yield();
      // Serial.print(server.client());
      // Serial.print(" - ");
      // Serial.print(millis());
      // Serial.print(" - ");
      // Serial.print(ESP.getFreeHeap());
      // Serial.print(" - ");
      // Serial.println(ESP.getHeapFragmentation());
      #ifdef WS2801
        Serial.print("-");  //solves bug with ws2801, investigating.
      #endif
    }
}



void setup(void) {
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, 0);
  Serial.begin(115200);

  WiFi.setAutoReconnect(true);
  WiFi.persistent(true);
  WiFi.mode(WIFI_STA);
  String hostname = "LED-controller-";
  hostname.concat(BONJOURNAME);
  WiFi.hostname(hostname.c_str());
  WiFi.begin(ssid, password);
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

  // Wait for connection
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(F("."));
  }
  while (WiFi.waitForConnectResult() != WL_CONNECTED) {
    Serial.println(F("Connection Failed! Rebooting..."));
    delay(5000);
    ESP.restart();
  }

  Serial.println();
  Serial.print(F("Connected to "));
  Serial.println(ssid);
  Serial.print(F("IP address: "));
  Serial.println(WiFi.localIP());

  if (MDNS.begin(BONJOURNAME)) {
    Serial.println(F("MDNS responder started"));
    Serial.println(BONJOURNAME);
  }

  server.on(F("/"), []() {
    server.send(200, "text/html", _index_html);
  });

  //-----begin generated paths


  server.on(F("/RGB-strip-controller/manifest.json"), []() {
    server.send_P(200, "text/json", _manifest_json);
  });
  server.on(F("/RGB-strip-controller/static/css/main.c83abc47.css"), []() {
    server.send_P(200, "text/css", _main_css);
  });
  server.on(F("/RGB-strip-controller/static/js/main.ad3e66b4.js"), []() {
    server.send_P(200, "text/javascript", _main_js);
  });
  server.on(F("/RGB-strip-controller/static/js/787.05b7a068.chunk.js"), []() {
    server.send_P(200, "text/javascript", _chunk_js);
  });
  server.on(F("/RGB-strip-controller/index.html"), []() {
    server.send_P(200, "text/html", _index_html);
  });


  //-----end generated paths

  server.on(F("/current"), getCurrentConfig);
  server.on(F("/update"), updateConfig);

  server.onNotFound(handleNotFound);
  server.enableCORS(true);
  server.begin();
  Serial.println(F("HTTP server started"));
  startOTA();
  
}



void loop(void) {
  webClientTimer(10);
  // server.handleClient();

  if (effectSpeed > 0 && millis() > 10000 && !server.client()) effectTimer(effectSpeed);

}
