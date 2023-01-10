void walk(uint32_t(*readPixel)(uint16_t), void(*setPixel)(uint16_t, uint32_t, boolean), uint16_t start, uint16_t end) {

      uint32_t firstPixel = (*readPixel)(start-1);

      for (int i=start; i < end; i++) {
        (*setPixel)(i-1, (*readPixel)(i), false);
      }
      (*setPixel)(end-1, firstPixel, true);
}

unsigned long effectPreviousMillis = 0;
void effectTimer(uint16_t speed, uint8_t activeGroups, uint16_t groups[][2], uint32_t(*readPixel)(uint16_t), void(*setPixel)(uint16_t, uint32_t, boolean)) {
    unsigned long currentMillis = millis();

    if (speed < 10) speed = 10;
    if (currentMillis - effectPreviousMillis >= speed) {

      Serial.print(millis());
      Serial.print(" - ");
      Serial.print(ESP.getFreeHeap());
      Serial.print(" - ");
      // Serial.println(ESP.getHeapFragmentation());
      effectPreviousMillis = currentMillis;
      for(int i=0; i < activeGroups; i++) {
        walk(readPixel, setPixel, groups[i][0], groups[i][1]);
      }
     

    }
}