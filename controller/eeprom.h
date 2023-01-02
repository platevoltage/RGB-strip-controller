#include "HardwareSerial.h"
#include <EEPROM.h>

//stripLength - 1


int readEEPROMAndReturnSubPixel(int position, int subPixel) {
  position += 10;
  position *= 4;
  return EEPROM.read(position+subPixel);    
}

void readEEPROMAndSetPixels( void (*setStripLength)(int), void(*setPixel)(int, int, int, int, int) ) {
  int stripLength = EEPROM.read(1);
  if (stripLength < 0 || stripLength > 255) stripLength = 255;
  (*setStripLength)(stripLength);
  for (int i = 10; i < stripLength+10; i++) {
    int x = i*4;
    int red = EEPROM.read(x);
    int green = EEPROM.read(x+1);             
    int blue = EEPROM.read(x+2); 
    int white = EEPROM.read(x+3); 
      
    (*setPixel)(i, red, green, blue, white);
  }
        
}

void writePixelToEEPROM(int position, int red, int green, int blue, int white) {
  int x = (position+10)*4;
  EEPROM.write(x, red);
  EEPROM.write(x+1, green);
  EEPROM.write(x+2, blue);
  EEPROM.write(x+3, white);
}

void commitEEPROM() {
  EEPROM.commit();
}

void writeStripLengthToEEPROM(int stripLength) {
  EEPROM.write(1, stripLength);
  EEPROM.commit();
}
