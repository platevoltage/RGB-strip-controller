void walk(uint32_t(*readPixel)(uint16_t), void(*setPixel)(uint16_t, uint32_t, bool), uint16_t start, uint16_t end) {
      // Serial.println();

      uint32_t firstPixel = (*readPixel)(start-1);
      // Serial.print(firstPixel);
      // Serial.print(". ");

      for (int i=start; i < end; i++) {
        uint32_t pixel = (*readPixel)(i);
        // Serial.print(pixel);
        // Serial.print(". ");
        (*setPixel)(i-1, pixel, false);
      }
      // Serial.println();
      (*setPixel)(end-1, firstPixel, true);
}

unsigned long effectPreviousMillis = 0;
void effectTimer(uint16_t speed, uint8_t activeGroups, uint16_t groups[][2], uint32_t(*readPixel)(uint16_t), void(*setPixel)(uint16_t, uint32_t, bool)) {
    unsigned long currentMillis = millis();

    if (speed < 10) speed = 10;
    if (currentMillis - effectPreviousMillis >= speed) {

      // Serial.print(millis());
      // Serial.print(" - ");
      // Serial.print(ESP.getFreeHeap());
      // Serial.print(" - ");
      // Serial.println(ESP.getHeapFragmentation());
      effectPreviousMillis = currentMillis;
      for(int i=0; i < activeGroups; i++) {
        walk(readPixel, setPixel, groups[i][0], groups[i][1]);
      }
     

    }
}

void fadeOut(uint32_t(*readPixel)(uint16_t), void(*setPixel)(uint16_t, uint32_t, bool)) {
  for(int j = 100; j >= 0; j--) {
    for (int i = 0; i < stripLength; i++) {
      uint32_t currentPixelColor = (*readPixel)(i);
      Serial.println(currentPixelColor);
      (*setPixel)(i, adjustBrightness(currentPixelColor, j), i==stripLength-1 );
    }
    delay(10);
  }
}

void fadeIn(uint32_t pixelData[], uint32_t(*readPixel)(uint16_t), void(*setPixel)(uint16_t, uint32_t, bool)) {
  for (int j = 0; j <= 100; j++) {
    for (int i = 0; i < stripLength; i++) {
      (*setPixel)(i, adjustBrightness(colorMod(pixelData[i]), j), i==stripLength-1 );
    }
    delay(10);
  }
}

void crossFade(uint32_t oldPixelData[], uint32_t newPixelData[], void(*setPixel)(uint16_t, uint32_t, bool)) {
  for (int j = 0; j <= 100; j++) {
    for (int i = 0; i < stripLength; i++) {
      (*setPixel)(i, crossFadePixel( adjustBrightness(oldPixelData[i], brightness), adjustBrightness(newPixelData[i], brightness), j ), i==stripLength-1 );
    }
    delay(10);
  }
}