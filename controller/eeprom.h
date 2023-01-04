#include "HardwareSerial.h"
#include <EEPROM.h>

#define EEPROM_OFFSET 10

//stripLength - 1


uint8_t readEEPROMAndReturnSubPixel(uint8_t position, uint8_t subPixel) {
  return EEPROM.read((position + EEPROM_OFFSET) * 4 + subPixel);    
}

void readEEPROMAndSetPixels( void (*setStripLength)(uint8_t), void(*setPixel)(uint8_t, uint32_t, boolean) ) {
  uint8_t stripLength = EEPROM.read(1);
  if (stripLength < 0 || stripLength > 255) stripLength = 255;
  (*setStripLength)(stripLength);
  for (int i = EEPROM_OFFSET; i < stripLength + EEPROM_OFFSET; i++) {
    int x = i*4;
    uint8_t red = EEPROM.read(x);
    uint8_t green = EEPROM.read(x+1);             
    uint8_t blue = EEPROM.read(x+2); 
    uint8_t white = EEPROM.read(x+3); 
      
    (*setPixel)(i-EEPROM_OFFSET, Color(red, green, blue, white), i == stripLength-1);
  }
        
}

void writePixelToEEPROM(uint8_t position, uint8_t red, uint8_t green, uint8_t blue, uint8_t white) {
  int x = (position + EEPROM_OFFSET )*4;
  EEPROM.write(x, red);
  EEPROM.write(x+1, green);
  EEPROM.write(x+2, blue);
  EEPROM.write(x+3, white);
}

void commitEEPROM() {
  EEPROM.commit();
}

void writeStripLengthToEEPROM(uint8_t stripLength) {
  EEPROM.write(1, stripLength);
  EEPROM.commit();
}

void writeDividerToEEPROM(uint8_t position, uint8_t divider) {
  EEPROM.write(position+2, divider);
}

void writeEffectSpeedToEEPROM(uint16_t effectSpeed) {
  EEPROM.write(7, effectSpeed >> 8);
  EEPROM.write(8, effectSpeed);
  // Serial.println((EEPROM.read(7) << 8) + EEPROM.read(8));
}

uint8_t readDividerFromEEPROM(uint8_t position) {
  return EEPROM.read(position+2);
}
uint16_t readEffectSpeedFromEEPROM() {

  return EEPROM.read(7) << 8 | EEPROM.read(8) ;
}
