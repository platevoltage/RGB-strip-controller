#ifdef WS2801

uint32_t Color(byte r, byte g, byte b, byte w) {
  uint32_t c;
  
  c = w;
  c <<= 8;
  c |= r;
  c <<= 8;
  c |= b;
  c <<= 8;
  c |= g;
  return c;
}

#else

uint32_t Color(byte r, byte g, byte b, byte w) {
  uint32_t c;
  
  c = w;
  c <<= 8;
  c |= r;
  c <<= 8;
  c |= g;
  c <<= 8;
  c |= b;
  return c;
}

#endif