#include <sys/_stdint.h>

static uint8_t brightness = 100;



uint32_t adjustBrightness(uint32_t input, uint8_t brightness) {
  const float brightnessPercent = (float)brightness/100;

  uint8_t w = input >> 24;
  uint8_t r = input >> 16;
  uint8_t g = input >> 8;
  uint8_t b = input;

  w *= brightnessPercent;
  r *= brightnessPercent;
  g *= brightnessPercent;
  b *= brightnessPercent;

  uint32_t output = r << 16 | g << 8 | b;

  return output;
}


#ifdef WS2801
uint32_t colorMod(uint32_t input) {
  uint8_t w = input >> 24;
  uint8_t r = input >> 16;
  uint8_t g = input >> 8;
  uint8_t b = input;

  uint32_t output = r << 16 | b << 8 | g;
  output = adjustBrightness(input, brightness);

  return output;
}

#else
uint32_t colorMod(uint32_t input) {

  uint32_t output = adjustBrightness(input, brightness);

  return output;
}



#endif