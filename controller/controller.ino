

#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
#include <ArduinoJson.h>



#ifndef STASSID
#define STASSID "Can't stop the signal, Mal"
#define STAPSK  "youcanttaketheskyfromme"
#endif

const char *ssid = STASSID;
const char *password = STAPSK;
uint stripLength = 2;
uint currentData[2][4] = {{100, 100, 255, 0}, {255, 0, 100, 0}};
// uint currentData[2] = {255, 233};


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

void getCurrentConfig() {
  StaticJsonDocument<500> jsonBuffer;
  JsonArray array = jsonBuffer.to<JsonArray>();


  
  for (int i = 0; i < stripLength; i++) {
    StaticJsonDocument<100> colorBuffer;
    JsonArray colors = colorBuffer.to<JsonArray>();
    for (int j = 0; j < 4; j++) {
      colors.add(currentData[i][j]);
    }
    array.add(colors);
  }


  String message;
  serializeJson(jsonBuffer, message);
  server.sendHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  server.send(200, "text/json", message );
}

void postTest() {  
  StaticJsonDocument<500> jsonBuffer;
  DeserializationError error = deserializeJson(jsonBuffer, server.arg("plain"));
  if (error) {
    server.send ( 200, "text/json", "{success:false}" );

  } else {
    const char* status = jsonBuffer["status"];
    int length = jsonBuffer["length"];

    int temp[10] = {1,2,3,4,5,6,7,8,9,10};

    server.send ( 200, "text/json", status);
    Serial.println();

    for (int i = 0; i < length; i++) {
      int red = jsonBuffer["red"][i];
      int green = jsonBuffer["green"][i];
      int blue = jsonBuffer["blue"][i];
      int white = jsonBuffer["white"][i];
      int position = jsonBuffer["positions"][i];
      
      Serial.print(position);
      Serial.print(" - (");
      Serial.print(red);
      Serial.print(",");
      Serial.print(green);
      Serial.print(",");
      Serial.print(blue);
      Serial.print(",");
      Serial.print(white);
      Serial.print(")");

      Serial.println();
    }
    
  }
  
}



void setup(void) {
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, 0);
  Serial.begin(9600);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.println("");



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

  if (MDNS.begin("RGB-controller")) {
    Serial.println("MDNS responder started");
  }


  server.on("/on", turnOn);
  server.on("/off", turnOff);
  server.on("/current", getCurrentConfig);
  server.on("/posttest", postTest);
  server.onNotFound(handleNotFound);
  server.enableCORS(true);
  server.begin();

  Serial.println("HTTP server started");
}

void loop(void) {
  server.handleClient();
  MDNS.update();
}

