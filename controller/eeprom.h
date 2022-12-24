#include <EEPROM.h>

int readEEPROMAndReturnSubPixel(int position, int subPixel) {
  position *= 4;
  return EEPROM.read(position+subPixel);    
}

void readEEPROMAndSetPixels( void (*setStripLength)(int), void(*setPixel)(int, int, int, int, int) ) {
  int stripLength = EEPROM.read(1000);
  if (stripLength < 0 || stripLength > 150) stripLength = 20;
  (*setStripLength)(stripLength);
  for (int i = 0; i < stripLength; i++) {
    int x = i*4;
    int red = EEPROM.read(x);
    int green = EEPROM.read(x+1);             
    int blue = EEPROM.read(x+2); 
    int white = EEPROM.read(x+3); 
      
    (*setPixel)(i, red, green, blue, white);
  }
        
}

void writePixelToEEPROM(int position, int red, int green, int blue, int white) {
  int x = position*4;
  EEPROM.write(x, red);
  EEPROM.write(x+1, green);
  EEPROM.write(x+2, blue);
  EEPROM.write(x+3, white);

  EEPROM.commit();
}

void writeStripLengthToEEPROM(int stripLength) {
  EEPROM.write(1000, stripLength);
  EEPROM.commit();
}
