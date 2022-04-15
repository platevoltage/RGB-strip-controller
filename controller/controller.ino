

#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266WebServerSecure.h>
#include <ESP8266mDNS.h>
#include <ArduinoJson.h>
#include <Adafruit_NeoPixel.h>
#include <EEPROM.h>

#ifndef STASSID
#define STASSID "Can't stop the signal, Mal"
#define STAPSK  "youcanttaketheskyfromme"
#endif

const int dataPin = 15;       //ws2801 data pin
const char* bonjourName = "rgb-Strip";  //bonjour name - http://xxxx.local 
const char *ssid = STASSID;
const char *password = STAPSK;
uint stripLength = 32;
int currentData[100][4] = {};

Adafruit_NeoPixel pixels(stripLength, dataPin, NEO_GRBW + NEO_KHZ800);
BearSSL::ESP8266WebServerSecure server(443);
ESP8266WebServer serverHTTP(80);

static const char serverCert[] PROGMEM = R"EOF(
-----BEGIN CERTIFICATE-----
MIICZDCCAc0CFC8twtj7DPCftTMs/ZDNSpnYR/F4MA0GCSqGSIb3DQEBCwUAMHEx
CzAJBgNVBAYTAlVTMQswCQYDVQQIDAJDQTEQMA4GA1UEBwwHT2FrbGFuZDEWMBQG
A1UECgwNamdjb3JiaW4gW1VTXTERMA8GA1UECwwIamdjb3JiaW4xGDAWBgNVBAMM
D3JnYi1zdHJpcC5sb2NhbDAeFw0yMjA0MTUwODAwMDdaFw0yMzA0MTUwODAwMDda
MHExCzAJBgNVBAYTAlVTMQswCQYDVQQIDAJDQTEQMA4GA1UEBwwHT2FrbGFuZDEW
MBQGA1UECgwNamdjb3JiaW4gW1VTXTERMA8GA1UECwwIamdjb3JiaW4xGDAWBgNV
BAMMD3JnYi1zdHJpcC5sb2NhbDCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEA
1jy3HkgXf4mMVvVw1VrcMZ8WfgbanLdvgzXwC+VzzJoxmLtkaA9+VzhgymztR4sL
HeKYETt9/JjQOTlISHsz+qH20GcGZrPEBh/TySuDmveBAlerCiK7H75HeNtt+Kx3
Zc2ttHds0E9+8ibH6u0Fl7pBe/tnyg8wgswJTFTCT38CAwEAATANBgkqhkiG9w0B
AQsFAAOBgQAOifY2kaXc2JxAqWDXixRE+REX5ykKO7dFVRlkf/MPnLPPVGAKwckv
cZtETYJJUJ1fPk51HuXpoP1XoQnJmaVGgsrVU05UY5ofN+yB6//u6NU42h9oyicw
PKKUUaUbtHtRz/XO6viIPYeXUQ7rWuLMhZ48dbKG3sUKW/rH+yaXyg==
-----END CERTIFICATE-----

)EOF";

static const char serverKey[] PROGMEM =  R"EOF(
-----BEGIN PRIVATE KEY-----
MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBANY8tx5IF3+JjFb1
cNVa3DGfFn4G2py3b4M18Avlc8yaMZi7ZGgPflc4YMps7UeLCx3imBE7ffyY0Dk5
SEh7M/qh9tBnBmazxAYf08krg5r3gQJXqwoiux++R3jbbfisd2XNrbR3bNBPfvIm
x+rtBZe6QXv7Z8oPMILMCUxUwk9/AgMBAAECgYBsEky9tdhEufpVk5LLzf3t+ja6
dHKrQ824/uiM177Go7IJPd60r7wn+4S4GKLJyFZfSQM1DjHLzrqbY04XYi8hfuFN
h5SZw1u/Pb7NtjzPvpvDm5vypc8Zfr6MwVBo+YlohS7Ap+eEhYTucqrxCFGv4EGC
fEiYwm3v6K+YOqnyYQJBAPsSV3uljbSsqJe7AMvFHFL8249Ocy9OIor+zNZhVKoR
a0yjzE3Rim9RQuE884q1qaasuazOyH1k8P622lykVr0CQQDacUbjvgHKHTMGFUlv
PheYv/ngD2p9VuEH26W7qbkWa4m1LG27lelBZQEjlaeZy+rXFAKIfsNZrjAm1zk9
BHDrAkAX+2SH1wR2IZfpBl/JFwbhlm2SfrfZ6Oi7xiLix2FC7W8GXw8Az+cdQvHU
efH5aejOlukVbJsR/zZV3jl1Z+0xAkEAvc+ejLiHL4vt0URf+hTXRjjStLpQizcZ
9M0MlyPkm7G4CEDh3RVniRZuRfB9oStLFbbieJ7FusCcQLPVncqlHwJBALLej9kz
pz6E0bnIVkWKOYGy3nN8SvKj7tyzCukdppKn5yNZ5sc6EE0TltFdCPBijOBgIBlh
H2yce9afVtTo6G0=
-----END PRIVATE KEY-----
)EOF";

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
    byte white = currentData[i][3];
    pixels.setPixelColor(i, Color(red, green, blue, white)); 
       
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

void secureRedirect() {
  serverHTTP.sendHeader("Location", String("https://rgb-strip.local"), true);
  serverHTTP.send(301, "text/plain", "");
}

void setup(void) {
  pinMode(LED_BUILTIN, OUTPUT);
  // digitalWrite(LED_BUILTIN, 0);
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

  WiFi.setAutoReconnect(true);
  WiFi.persistent(true);

  configTime(3 * 3600, 0, "pool.ntp.org", "time.nist.gov");

  serverHTTP.on("/", secureRedirect);
  serverHTTP.begin();
  server.getServer().setRSACert(new BearSSL::X509List(serverCert), new BearSSL::PrivateKey(serverKey));
  server.on("/on", turnOn);
  server.on("/off", turnOff);
  server.on("/current", getCurrentConfig);
  server.on("/update", updateConfig);
  server.onNotFound(handleNotFound);
  server.enableCORS(true);
  server.begin();

  Serial.println("HTTP server started");
  
}
uint32_t Color(byte r, byte g, byte b, byte w) {
  uint32_t c;
  
  c = w;
  c <<= 8;
  c |= r;
  c <<= 8;
  c |= g;
  c <<= 8;
  c |= b;
  return c;
}

unsigned long previousMillis = 0;
unsigned long interval = 30000;
void loop(void) {
  serverHTTP.handleClient();
  server.handleClient();
  MDNS.update();   

  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >=interval){
    switch (WiFi.status()){
      case WL_NO_SSID_AVAIL:
        Serial.println("Configured SSID cannot be reached");
        break;
      case WL_CONNECTED:
        Serial.println("Connection successfully established");
        break;
      case WL_CONNECT_FAILED:
        Serial.println("Connection failed");
        break;
    }
    Serial.printf("Connection status: %d\n", WiFi.status());
    Serial.print("RRSI: ");
    Serial.println(WiFi.RSSI());
    previousMillis = currentMillis;
  }


       
}

