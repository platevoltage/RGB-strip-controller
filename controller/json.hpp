#include <ArduinoJson.h>

static uint16_t stripLength = 0;
static uint16_t effectSpeed = 0;



String jsonStringify(uint32_t epoch, uint32_t currentData[], size_t dividersSize, uint16_t dividers[], uint8_t profile, size_t scheduleSize, float schedule[]) {
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

    DynamicJsonDocument scheduleBuffer(200);
    JsonArray scheduleArray = scheduleBuffer.to<JsonArray>();

    for (int i = 0; i < scheduleSize; i++) {
      scheduleArray.add(schedule[i]);
    }

    String message = "{\"pixels\": ";
    serializeJson(pixelBuffer, message); 
    message += ", \"dividers\": ";
    serializeJson(dividerBuffer, message);
    message += ", \"time\": ";
    message += String(epoch);
    message += ", \"effectSpeed\": ";
    message += String(effectSpeed);
    message += ", \"profile\": ";
    message += String(profile);
    message += ", \"schedule\": ";
    serializeJson(scheduleBuffer, message);
    message += "}";

    Serial.println(message);
    
    
    pixelBuffer.clear();
  
    return message;
}