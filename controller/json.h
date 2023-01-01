#include <ArduinoJson.h>

String jsonStringify(int length, uint8_t currentData[][4]) {
    DynamicJsonDocument jsonBuffer(20000);
    JsonArray array = jsonBuffer.to<JsonArray>();
    // static const char message[] PROGMEM = "[255, 255]";
    String message;

    for (int i = 0; i < length; i++) {

      DynamicJsonDocument colorBuffer(256);
      JsonArray colors = colorBuffer.to<JsonArray>();
      for (int j = 0; j < 4; j++) {
        colors.add(currentData[i][j]);
      }
      array.add(colors);
    }
    
    serializeJson(jsonBuffer, message); //this is where the crash happens
    

    return message;
}