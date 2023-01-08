#include <ArduinoJson.h>

static uint16_t stripLength = 32;
static uint16_t effectSpeed = 0;



String jsonStringify(uint32_t currentData[], size_t dividersSize, uint16_t dividers[]) {
    Serial.println(ESP.getFreeHeap());
    DynamicJsonDocument pixelBuffer(JSON_BUFFER_SIZE);
    Serial.println(ESP.getFreeHeap());
    JsonArray pixelArray = pixelBuffer.to<JsonArray>();
    
    for (int i = 0; i < stripLength; i++) {
      pixelArray.add(currentData[i]);
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

    // Serial.println(message);
    
    
    pixelBuffer.clear();
  
    return message;
}