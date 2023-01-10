#include "payload/manifest.json.h"
#include "payload/static/css/main.c83abc47.css.h"
#include "payload/static/js/main.a5f251b2.js.h"
#include "payload/static/js/787.05b7a068.chunk.js.h"
#include "payload/index.html.h"
#include <WiFiClient.h>
#include <WiFiUdp.h>

#ifdef ESP32
#include <WiFi.h>
#include <WebServer.h>
#include <ESPmDNS.h>
WebServer server(80);

#else
//31000 max for esp8266. 150 pixels.
#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
ESP8266WebServer server(80);

#endif

static const char *ssid = STASSID;
static const char *password = STAPSK;
static String bonjourName = "";
// const char *ssid = APSSID;
// const char *password = APPSK;


void handleNotFound() {
  // digitalWrite(LED_BUILTIN, 1);
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
  // digitalWrite(LED_BUILTIN, 0);
}


void serverStart(void(*updateConfig)(), void(*getCurrentConfig)()) {
    WiFi.setAutoReconnect(true);
    WiFi.persistent(true);
    WiFi.mode(WIFI_STA);
    String hostname = "LED-controller-";
    hostname.concat(BONJOURNAME);
    WiFi.hostname(hostname);
    WiFi.begin(ssid, password);
      
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

    if (MDNS.begin(bonjourName)) {
      Serial.println(F("MDNS responder started"));
      Serial.println(bonjourName);
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
    server.on(F("/RGB-strip-controller/static/js/main.a5f251b2.js"), []() {
      server.send_P(200, "text/javascript", _main_js);
    });
    server.on(F("/RGB-strip-controller/static/js/787.05b7a068.chunk.js"), []() {
      server.send_P(200, "text/javascript", _chunk_js);
    });
    server.on(F("/RGB-strip-controller/index.html"), []() {
      server.send_P(200, "text/html", _index_html);
    });


    //-----end generated paths

    server.on(F("/current"), *getCurrentConfig);
    server.on(F("/update"), *updateConfig);

    server.onNotFound(handleNotFound);
    server.enableCORS(true);
    server.begin();
    Serial.println(F("HTTP server started"));
}


void sendHeaders() {
  server.sendHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  server.setContentLength(CONTENT_LENGTH_UNKNOWN);
}


unsigned long webClientPreviousMillis = 0;
void webClientTimer(uint16_t speed) {
    unsigned long currentMillis = millis();
    if (currentMillis - webClientPreviousMillis >= speed) {
      webClientPreviousMillis = currentMillis;
      server.handleClient();
      ArduinoOTA.handle();
      yield();

      #ifdef WS2801
        Serial.print("-");  //solves bug with ws2801, investigating.
      #endif
    }
}

