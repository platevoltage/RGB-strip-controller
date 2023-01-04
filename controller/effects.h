void walk(uint32_t(*readPixel)(uint16_t), void(*setPixel)(uint16_t, uint32_t, boolean), uint16_t start, uint16_t end) {
      int firstPixel = (*readPixel)(start-1);
      for (int i=start; i < end; i++) {
        (*setPixel)(i-1, (*readPixel)(i), false);
      }
      (*setPixel)(end-1, firstPixel, true);
}