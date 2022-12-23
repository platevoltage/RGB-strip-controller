#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
#include <Adafruit_NeoPixel.h>
#include <EEPROM.h>
#include "color.h"
#include "eeprom.h"
#include "json.h"

//----begin generated includes and wifi definitions


#include "payload/manifest.json.h"
#include "payload/static/css/main.f8f8c452.css.h"
#include "payload/static/js/main.606bb971.js.h"
#include "payload/static/js/787.05b7a068.chunk.js.h"
#include "payload/index.html.h"

#ifndef STASSID
#define STASSID "Can't stop the signal, Mal"
#define STAPSK  "youcanttaketheskyfromme"
#endif

//----end generated includes and wifi definitions


const char *ssid = STASSID;
const char *password = STAPSK;
const int dataPin = 5;       //ws2801 data pin
uint stripLength = 32;

Adafruit_NeoPixel pixels(stripLength, dataPin, NEO_GRBW + NEO_KHZ800);
ESP8266WebServer server(80);


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


void getCurrentConfig() {

  server.sendHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  server.setContentLength(CONTENT_LENGTH_UNKNOWN);
  server.send(200, "text/json", "[" );

  int chunks = stripLength/32; //1
  int remainder = stripLength%32; //0

  uint8_t currentData[stripLength][4] = {};

  for (int i = 0; i < stripLength; i++) {
    currentData[i][0] = readEEPROMAndReturnSubPixel(i, 0);
    currentData[i][1] = readEEPROMAndReturnSubPixel(i, 1);
    currentData[i][2] = readEEPROMAndReturnSubPixel(i, 2);
    currentData[i][3] = readEEPROMAndReturnSubPixel(i, 3);
  }


  for (int i = 0; i < chunks; i++) {
    if (i>0) server.sendContent(",");
    server.sendContent(jsonStringify(i, 32, currentData));
    
  }
  // if (chunks>1) server.sendContent(",");
  if (remainder>0) {
    if (chunks>0) server.sendContent(",");
    server.sendContent(jsonStringify(chunks, remainder, currentData));
  }
  server.sendContent("]");
    
}

void updateConfig() {  
  DynamicJsonDocument jsonBuffer(20000);
  
  DeserializationError error = deserializeJson(jsonBuffer, server.arg("plain"));


  Serial.println(jsonBuffer.memoryUsage());
  
  if (error) {
    server.sendHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
    server.sendHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    server.send ( 200, "text/json", "{success:false}" );
    Serial.println(error.c_str());

  } 
  else {
    const char* status = jsonBuffer["status"];
    int length = jsonBuffer["length"];
    stripLength = jsonBuffer["stripLength"];
    pixels.updateLength(stripLength);
    
    
    server.sendHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
    server.sendHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    Serial.println(status);
    server.send ( 200, "text/json", "{success:true}");

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
}

void setPixel(int position, int red, int green, int blue, int white) {

  pixels.setPixelColor(position, Color(red, green, blue, white));    
  pixels.show();
}



void setup(void) {
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, 0);
  Serial.begin(9600);

  WiFi.setAutoReconnect(true);
  WiFi.persistent(true);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.println("");
  pixels.begin();
  EEPROM.begin(1024);

  readEEPROMAndSetPixels(setStripLength, setPixel);
  pixels.updateLength(stripLength);

  // Wait for connection
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.print("Connected to ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  if (MDNS.begin("test")) {
    Serial.println("MDNS responder started");
  }

  server.on(F("/"), [](){ server.send(200, "text/html", _index_html); });

  //-----begin generated paths

  
	server.on(F("/RGB-strip-controller/manifest.json"), [](){ server.send(200, "text/json", _manifest_json); });
	server.on(F("/RGB-strip-controller/static/css/main.f8f8c452.css"), [](){ server.send(200, "text/css", _main_css); });
	server.on(F("/RGB-strip-controller/static/js/main.606bb971.js"), [](){ server.send(200, "text/javascript", _main_js); });
	server.on(F("/RGB-strip-controller/static/js/787.05b7a068.chunk.js"), [](){ server.send(200, "text/javascript", _chunk_js); });
	server.on(F("/RGB-strip-controller/index.html"), [](){ server.send(200, "text/html", _index_html); });


  //-----end generated paths

  server.on(F("/current"), getCurrentConfig);
  server.on(F("/update"), updateConfig);
  
  server.onNotFound(handleNotFound);
  server.enableCORS(true);
  server.begin();
  Serial.println("HTTP server started");
}



void loop(void) {
  server.handleClient();
  MDNS.update();
  //Serial.print(ESP.getFreeHeap());
  //Serial.print("----");
  //Serial.println(ESP.getHeapFragmentation());
}

