
#ifdef ESP32

#include <WiFi.h>
#include <WiFiClient.h>
#include <WebServer.h>
#include <ESPmDNS.h>
#include <WiFiUdp.h>
#include <ArduinoOTA.h>
WebServer server(80);

#else

#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
ESP8266WebServer server(80);


#endif

#include <Adafruit_NeoPixel.h>
#include <ArduinoJson.h>
#include "json.h"
#include "color.h"
#include "eeprom.h"


//----begin generated includes and wifi definitions


#include "payload/manifest.json.h"
#include "payload/static/css/main.f8f8c452.css.h"
#include "payload/static/js/main.606bb971.js.h"
#include "payload/static/js/787.05b7a068.chunk.js.h"
#include "payload/index.html.h"

#ifndef STASSID
#define STASSID "Can't stop the signal, Mal"
#define STAPSK "youcanttaketheskyfromme"
#endif

//----end generated includes and wifi definitions


const char *ssid = STASSID;
const char *password = STAPSK;
const int dataPin = 5;  //ws2801 data pin
uint stripLength = 32;

Adafruit_NeoPixel pixels(stripLength, dataPin, NEO_GRBW + NEO_KHZ800);


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

  server.send(200, "text/json", jsonStringify(stripLength, currentData));

}

void updateConfig() {
  DynamicJsonDocument jsonBuffer(20000);
  DeserializationError error = deserializeJson(jsonBuffer, server.arg("plain"));
  sendHeaders();

  if (error) {
    server.send(200, "text/json", "{success:false}");
    Serial.println(error.c_str());
  }

  else {
    const char *status = jsonBuffer["status"];
    int length = jsonBuffer["length"];
    stripLength = jsonBuffer["stripLength"];
    pixels.updateLength(stripLength);
    server.send(200, "text/json", "{success:true}");

    uint8_t currentData[stripLength][4] = {};

    for (int i = 0; i < stripLength; i++) {
      currentData[i][0] = readEEPROMAndReturnSubPixel(i, 0);
      currentData[i][1] = readEEPROMAndReturnSubPixel(i, 1);
      currentData[i][2] = readEEPROMAndReturnSubPixel(i, 2);
      currentData[i][3] = readEEPROMAndReturnSubPixel(i, 3);
    }


    for (int i = 0; i < length; i++) {
      int red = jsonBuffer["red"][i];
      int green = jsonBuffer["green"][i];
      int blue = jsonBuffer["blue"][i];
      int white = jsonBuffer["white"][i];
      int position = jsonBuffer["positions"][i];

      currentData[position][0] = red;
      currentData[position][1] = green;
      currentData[position][2] = blue;
      currentData[position][3] = white;

      writePixelToEEPROM(position, red, green, blue, white);
    }
    writeStripLengthToEEPROM(stripLength);
    for (int i = 0; i < stripLength; i++) {
      int red = currentData[i][0];
      int green = currentData[i][1];
      int blue = currentData[i][2];
      int white = currentData[i][3];
      pixels.setPixelColor(i, Color(red, green, blue, white));
      pixels.show();
    }
  }
}

void setStripLength(int newStripLength) {
  stripLength = newStripLength;
  pixels.updateLength(stripLength);
}

void setPixel(int position, int red, int green, int blue, int white) {

  pixels.setPixelColor(position, Color(red, green, blue, white));
  pixels.show();
}



void setup(void) {
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, 0);
  Serial.begin(115200);

  WiFi.setAutoReconnect(true);
  WiFi.persistent(true);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.println("");
  pixels.begin();
  EEPROM.begin(1024);

  readEEPROMAndSetPixels(setStripLength, setPixel);
  setStripLength(stripLength);

  // Wait for connection
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  while (WiFi.waitForConnectResult() != WL_CONNECTED) {
    Serial.println("Connection Failed! Rebooting...");
    delay(5000);
    ESP.restart();
  }

  Serial.println("");
  Serial.print("Connected to ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  if (MDNS.begin("beep")) {
    Serial.println("MDNS responder started");
  }

  server.on(F("/"), []() {
    server.send(200, "text/html", _index_html);
  });

  //-----begin generated paths


  server.on(F("/RGB-strip-controller/manifest.json"), []() {
    server.send_P(200, "text/json", _manifest_json);
  });
  server.on(F("/RGB-strip-controller/static/css/main.f8f8c452.css"), []() {
    server.send_P(200, "text/css", _main_css);
  });
  server.on(F("/RGB-strip-controller/static/js/main.606bb971.js"), []() {
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
  Serial.println("HTTP server started");

  ArduinoOTA
    .onStart([]() {
      String type;
      if (ArduinoOTA.getCommand() == U_FLASH)
        type = "sketch";
      else // U_SPIFFS
        type = "filesystem";

      // NOTE: if updating SPIFFS this would be the place to unmount SPIFFS using SPIFFS.end()
      Serial.println("Start updating " + type);
    })
    .onEnd([]() {
      Serial.println("\nEnd");
    })
    .onProgress([](unsigned int progress, unsigned int total) {
      Serial.printf("Progress: %u%%\r", (progress / (total / 100)));
    })
    .onError([](ota_error_t error) {
      Serial.printf("Error[%u]: ", error);
      if (error == OTA_AUTH_ERROR) Serial.println("Auth Failed");
      else if (error == OTA_BEGIN_ERROR) Serial.println("Begin Failed");
      else if (error == OTA_CONNECT_ERROR) Serial.println("Connect Failed");
      else if (error == OTA_RECEIVE_ERROR) Serial.println("Receive Failed");
      else if (error == OTA_END_ERROR) Serial.println("End Failed");
    });

  ArduinoOTA.begin();

}



void loop(void) {
  server.handleClient();
  ArduinoOTA.handle();
  //MDNS.update();
  //Serial.println(ESP.getFreeHeap());
  //Serial.print("----");
  //Serial.println(ESP.getHeapFragmentation());
}
