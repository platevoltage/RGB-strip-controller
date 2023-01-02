#include <ArduinoJson.h>

String jsonStringify(int length, uint8_t currentData[][4]) {
    DynamicJsonDocument jsonBuffer(21000);
    JsonArray array = jsonBuffer.to<JsonArray>();
    
    for (int i = 0; i < length; i++) {

      DynamicJsonDocument colorBuffer(256);
      JsonArray colors = colorBuffer.to<JsonArray>();
      for (int j = 0; j < 4; j++) {
        colors.add(currentData[i][j]);
      }
      array.add(colors);
    }

    String message;
    serializeJson(jsonBuffer, message); 
    
    return message;
}