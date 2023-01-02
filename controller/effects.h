void walk(uint32_t(*readPixel)(uint8_t), void(*setPixel)(uint8_t, uint32_t, boolean), uint8_t stripLength) {
      int firstPixel = (*readPixel)(0);
      for (int i=1; i < stripLength; i++) {
        (*setPixel)(i-1, (*readPixel)(i), false);
      }
      (*setPixel)(stripLength-1, firstPixel, true);
}