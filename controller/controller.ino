

#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>

#ifndef STASSID
#define STASSID "Can't stop the signal, Mal"
#define STAPSK  "youcanttaketheskyfromme"
#endif

const char *ssid = STASSID;
const char *password = STAPSK;

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

void postTest() {
  if (server.method() != HTTP_POST) {
    server.send(405, "text/json", "Method Not Allowed");
  } else {
    server.send(200, "text/json", "{ POST body was:\n" + server.arg("plain") + "}" );
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
  server.on("/posttest", postTest);
  server.onNotFound(handleNotFound);

  server.begin();
  Serial.println("HTTP server started");
}

void loop(void) {
  server.handleClient();
  MDNS.update();
}

