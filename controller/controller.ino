

#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
#include <ArduinoJson.h>
#include <Adafruit_NeoPixel.h>
#include <EEPROM.h>

#ifndef STASSID
#define STASSID "Can't stop the signal, Mal"
#define STAPSK  "youcanttaketheskyfromme"
#endif

const int dataPin = 15;       //ws2801 data pin
const char* bonjourName = "RGB-Strip";  //bonjour name - http://xxxx.local 
const char *ssid = STASSID;
const char *password = STAPSK;
uint stripLength = 32;
int currentData[100][4] = {};

Adafruit_NeoPixel pixels(stripLength, dataPin, NEO_GRB + NEO_KHZ800);
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


void turnOn() {
  server.send(200, "text/json", "{ \"led\":\"on\" }");
  digitalWrite(LED_BUILTIN, 0);
  Serial.println("led on");
}

void turnOff() {
  server.send(200, "text/json", "{ \"led\":\"off\" }");
  digitalWrite(LED_BUILTIN, 1);
  Serial.println("led off");
}

String jsonStringify(int multiplier, int length) {
    StaticJsonDocument<10000> jsonBuffer;
    JsonArray array = jsonBuffer.to<JsonArray>();
    String message;
    //0,32
    //1,32
    for (int i = 32*multiplier; i < 32*multiplier+length; i++) {
      StaticJsonDocument<256> colorBuffer;
      JsonArray colors = colorBuffer.to<JsonArray>();
      for (int j = 0; j < 4; j++) {
        colors.add(currentData[i][j]);
      }
      array.add(colors);
    }
    
    serializeJson(jsonBuffer, message);
    message.remove(0, 1);
    message.remove(message.length()-1, 1);
    return message;
}

void getCurrentConfig() {

  server.sendHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  server.setContentLength(CONTENT_LENGTH_UNKNOWN);
  server.send(200, "text/json", "[" );

  int chunks = stripLength/32; //1
  int remainder = stripLength%32; //0

  for (int i = 0; i < chunks; i++) {
    if (i>0) server.sendContent(",");
    server.sendContent(jsonStringify(i, 32));
    
  }
  // if (chunks>1) server.sendContent(",");
  if (remainder>0) {
    if (chunks>0) server.sendContent(",");
    server.sendContent(jsonStringify(chunks, remainder));
  }
  server.sendContent("]");
    
}

void updateConfig() {  
  StaticJsonDocument<10000> jsonBuffer;
  DeserializationError error = deserializeJson(jsonBuffer, server.arg("plain"));
  if (error) {
    server.sendHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
    server.sendHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    server.send ( 200, "text/json", "{success:false}" );

  } 
  else {
    const char* status = jsonBuffer["status"];
    int length = jsonBuffer["length"];
    stripLength = jsonBuffer["stripLength"];
    pixels.updateLength(stripLength);
    
    
    server.sendHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
    server.sendHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    server.send ( 200, "text/json", status);
    Serial.println();

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
    }

    updateStrip();

    writeEEPROM();
 
  }
  
}


void updateStrip() {

  for (int i = 0; i < stripLength; i++) {
    byte red = currentData[i][0];
    byte green = currentData[i][1];
    byte blue = currentData[i][2];
    pixels.setPixelColor(i, Color(red, green, blue)); 
       
  }
  pixels.show();
}

void writeEEPROM() {
  for (int i = 0; i < 100; i++) {
      int x = i*3;
      EEPROM.write(x, currentData[i][0]);
      EEPROM.write(x+1, currentData[i][1]);
      EEPROM.write(x+2, currentData[i][2]);
      EEPROM.write(x+3, currentData[i][3]);
  }
  EEPROM.write(500, stripLength);
  EEPROM.commit();
}

void readEEPROM() {
  stripLength = EEPROM.read(500);
  for (int i = 0; i < 100; i++) {
    int x = i*3;
    currentData[i][0] = EEPROM.read(x);
    currentData[i][1] = EEPROM.read(x+1);             
    currentData[i][2] = EEPROM.read(x+2); 
    currentData[i][3] = EEPROM.read(x+3); 
      // Serial.print(currentData[i][0]);
      // Serial.print("/");
      // Serial.print(currentData[i][1]);
      // Serial.print("/");
      // Serial.print(currentData[i][2]);
      // Serial.print("/");
      // Serial.println(currentData[i][3]);
  }
}

void setup(void) {
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, 0);
  Serial.begin(9600);
  Serial.println("");
  pixels.begin();
  EEPROM.begin(512);
  readEEPROM();
  updateStrip();
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);



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

  if (MDNS.begin(bonjourName)) {
    Serial.println("MDNS responder started");
  }

  server.on("/on", turnOn);
  server.on("/off", turnOff);
  server.on("/current", getCurrentConfig);
  server.on("/update", updateConfig);
  server.onNotFound(handleNotFound);
  server.enableCORS(true);
  server.begin();

  Serial.println("HTTP server started");
  
}
uint32_t Color(byte r, byte g, byte b) {
  uint32_t c;
  c = r;
  c <<= 8;
  c |= g;
  c <<= 8;
  c |= b;
  return c;
}

void loop(void) {
  server.handleClient();
  MDNS.update();        
}

