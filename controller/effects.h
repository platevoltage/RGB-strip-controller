void walk(uint32_t(*readPixel)(uint8_t), void(*setPixel)(uint8_t, uint32_t, boolean), uint8_t start, uint8_t end) {
      int firstPixel = (*readPixel)(start-1);
      for (int i=start; i < end; i++) {
        (*setPixel)(i-1, (*readPixel)(i), false);
      }
      (*setPixel)(end-1, firstPixel, true);
}