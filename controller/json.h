#include <ArduinoJson.h>

String jsonStringify(int multiplier, int length, uint8_t currentData[][4]) {
    StaticJsonDocument<20000> jsonBuffer;
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