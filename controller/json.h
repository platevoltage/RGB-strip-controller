#include <ArduinoJson.h>

String jsonStringify(int multiplier, int length, uint8_t currentData[][4]) {
    DynamicJsonDocument jsonBuffer(20000);
    JsonArray array = jsonBuffer.to<JsonArray>();
    String message;
    //Serial.println("message");
    // Serial.println(message);

    for (int i = 32*multiplier; i < 32*multiplier+length; i++) {
      //StaticJsonDocument<1024> colorBuffer;
      DynamicJsonDocument colorBuffer(256);
      JsonArray colors = colorBuffer.to<JsonArray>();
      for (int j = 0; j < 4; j++) {
        colors.add(currentData[i][j]);
      }
      array.add(colors);
    }
    
    serializeJson(jsonBuffer, message);
    message.remove(0, 1);
    message.remove(message.length()-1, 1);
    // Serial.println("message");
    // Serial.println(message);
    return message;
}