
// #define WS2801 // uncomment for ws2801
#define STASSID "Can't stop the signal, Mal"
#define STAPSK "youcanttaketheskyfromme"
#define BONJOURNAME "test"
#define DATA_PIN 5
#define WS2801_DATA_PIN 15
#define WS2801_CLK_PIN 13

#ifdef ESP32

#include <WiFi.h>
#include <WebServer.h>
#include <ESPmDNS.h>
WebServer server(80);

#else

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
#include "payload/static/js/main.3c3cdc75.js.h"
#include "payload/static/js/787.05b7a068.chunk.js.h"
#include "payload/index.html.h"



//----end generated includes and wifi definitions


const char *ssid = STASSID;
const char *password = STAPSK;
uint8_t stripLength = 32;


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





void getCurrentConfig() {
  sendHeaders();

  uint8_t currentData[stripLength][4] = {};

  for (int i = 0; i < stripLength; i++) {
    currentData[i][0] = readEEPROMAndReturnSubPixel(i, 0);
    currentData[i][1] = readEEPROMAndReturnSubPixel(i, 1);
    currentData[i][2] = readEEPROMAndReturnSubPixel(i, 2);
    currentData[i][3] = readEEPROMAndReturnSubPixel(i, 3);
  }
  uint8_t temp[4] = {readDividerFromEEPROM(0), readDividerFromEEPROM(1), readDividerFromEEPROM(2), readDividerFromEEPROM(3)};
  server.send(200, "text/json", jsonStringify(stripLength, currentData, sizeof(temp), temp));

}

void updateConfig() {
  DynamicJsonDocument jsonBuffer(21000);
  DeserializationError error = deserializeJson(jsonBuffer, server.arg("plain"));
  sendHeaders();

  if (error) {
    server.send(200, "text/json", F("{success:false}"));
    Serial.println(error.c_str());
  }

  else {
    const char *status = jsonBuffer["status"];
    uint8_t length = jsonBuffer["length"];
    stripLength = jsonBuffer["stripLength"];
    
    pixels.updateLength(stripLength);
    server.send(200, "text/json", F("{success:true}"));

    uint8_t dividersLength = jsonBuffer["dividers"].size();
    // uint8_t dividers[dividersLength] = {};
    for (int i=0; i<dividersLength; i++) {
      // dividers[i] = jsonBuffer["dividers"][i];
      writeDividerToEEPROM(i, jsonBuffer["dividers"][i]);
    }
    
    uint8_t currentData[stripLength][4] = {};

    for (int i = 0; i < stripLength; i++) {
      currentData[i][0] = readEEPROMAndReturnSubPixel(i, 0);
      currentData[i][1] = readEEPROMAndReturnSubPixel(i, 1);
      currentData[i][2] = readEEPROMAndReturnSubPixel(i, 2);
      currentData[i][3] = readEEPROMAndReturnSubPixel(i, 3);
    }


    for (int i = 0; i < length; i++) {
      uint8_t red = jsonBuffer["red"][i];
      uint8_t green = jsonBuffer["green"][i];
      uint8_t blue = jsonBuffer["blue"][i];
      uint8_t white = jsonBuffer["white"][i];
      uint8_t position = jsonBuffer["positions"][i];

      currentData[position][0] = red;
      currentData[position][1] = green;
      currentData[position][2] = blue;
      currentData[position][3] = white;

      writePixelToEEPROM(position, red, green, blue, white);
      // commitEEPROM();
    }
    writeStripLengthToEEPROM(stripLength);
    for (int i = 0; i < stripLength; i++) {
      uint8_t red = currentData[i][0];
      uint8_t green = currentData[i][1];
      uint8_t blue = currentData[i][2];
      uint8_t white = currentData[i][3];
      pixels.setPixelColor(i, Color(red, green, blue, white));
    }
    pixels.show();
  }
  jsonBuffer.clear();
}

void setStripLength(uint8_t newStripLength) {
  stripLength = newStripLength;
  pixels.updateLength(stripLength);
}

void setPixel(uint8_t position, uint32_t color, boolean show) {
  pixels.setPixelColor(position, color);
  if (show) pixels.show();
}

uint32_t readPixel(uint8_t position) {
  return pixels.getPixelColor(position);
}




unsigned long previousMillis = 0;
const long interval = 100;
int count = 0;
void timer() {
    unsigned long currentMillis = millis();
    if (currentMillis - previousMillis >= interval) {
      previousMillis = currentMillis;

      walk(readPixel, setPixel, stripLength);

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
  Serial.println();
  pixels.begin();
  EEPROM.begin(1280);

  setStripLength(stripLength);
  readEEPROMAndSetPixels(setStripLength, setPixel);

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
  server.on(F("/RGB-strip-controller/static/js/main.3c3cdc75.js"), []() {
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
  server.handleClient();
  ArduinoOTA.handle();
  // MDNS.update(); //don't need maybe
  //timer();

  // Serial.println(ESP.getFreeHeap());
  // Serial.println(ESP.getHeapFragmentation());

  #ifdef WS2801
  Serial.print("-");  //solves bug with ws2801, investigating.
  #endif
}
