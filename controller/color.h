#ifdef WS2801

uint32_t colorMod(uint32_t input) {
  uint8_t w = input >> 24;
  uint8_t r = input >> 16;
  uint8_t g = input >> 8;
  uint8_t b = input;

  uint32_t output = r << 16 | b << 8 | g;

  return output;
}
#else

uint32_t colorMod(uint32_t input) {
  return input;
}

#endif