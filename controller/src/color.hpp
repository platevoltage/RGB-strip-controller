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

  uint32_t output = w << 24 | r << 16 | g << 8 | b;

  return output;
}

uint32_t crossFadePixel(uint32_t color1, uint32_t color2, uint8_t amount) {

  const float crossFadePercent2 = (float)amount/100;
  const float crossFadePercent1 = (float)1 - crossFadePercent2;

  uint8_t w1 = color1 >> 24;
  uint8_t r1 = color1 >> 16;
  uint8_t g1 = color1 >> 8;
  uint8_t b1 = color1;

  uint8_t w2 = color2 >> 24;
  uint8_t r2 = color2 >> 16;
  uint8_t g2 = color2 >> 8;
  uint8_t b2 = color2;

  float w = w1*crossFadePercent1 + w2*crossFadePercent2;
  float r = r1*crossFadePercent1 + r2*crossFadePercent2;
  float g = g1*crossFadePercent1 + g2*crossFadePercent2;
  float b = b1*crossFadePercent1 + b2*crossFadePercent2;


  uint32_t output = (uint8_t)w << 24 | (uint8_t)r << 16 | (uint8_t)g << 8 | (uint8_t)b;

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