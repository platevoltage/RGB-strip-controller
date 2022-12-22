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