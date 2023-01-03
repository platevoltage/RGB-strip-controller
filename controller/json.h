#include "ArduinoJson/Array/JsonArray.hpp"
#include "ArduinoJson/Document/DynamicJsonDocument.hpp"
#include <ArduinoJson.h>

String jsonStringify(int length, uint8_t currentData[][4], size_t dividersSize, uint8_t dividers[], uint16_t effectSpeed) {

    DynamicJsonDocument pixelBuffer(21000);
    JsonArray pixelArray = pixelBuffer.to<JsonArray>();
    
    for (int i = 0; i < length; i++) {

      DynamicJsonDocument colorBuffer(256);
      JsonArray colors = colorBuffer.to<JsonArray>();
      for (int j = 0; j < 4; j++) {
        colors.add(currentData[i][j]);
      }
      pixelArray.add(colors);
      colorBuffer.clear();
    }

    DynamicJsonDocument dividerBuffer(1000);
    JsonArray dividerArray = dividerBuffer.to<JsonArray>();

    for (int i = 0; i < dividersSize; i++) {
      dividerArray.add(dividers[i]);
    }

    

    String message = "{\"pixels\": ";
    serializeJson(pixelBuffer, message); 
    message += ", \"dividers\": ";
    serializeJson(dividerBuffer, message);
    message += ", \"effectSpeed\": ";
    message += String(effectSpeed);
    message += "}";

    Serial.println(message);
    
    
    pixelBuffer.clear();
  
    return message;
}