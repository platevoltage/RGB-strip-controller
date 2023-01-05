#include "HardwareSerial.h"
#include <EEPROM.h>

#define EEPROM_OFFSET 20

//stripLength - 0,1
//dividers - 2,3,4,5,6,7,8,9
//effectSpeed - 10,11

void EEPROMinit() {
  if (EEPROM.read(0) == 255) {
    for (int i=0; i < EEPROM_SIZE; i++) {
      EEPROM.write(i, 0);
    }
    EEPROM.write(1, 20); //sets length to 20 if eeprom needs to be initialized
    EEPROM.commit();
  }
}


uint8_t readEEPROMAndReturnSubPixel(uint16_t position, uint8_t subPixel) {
  return EEPROM.read((position + EEPROM_OFFSET) * 4 + subPixel);    
}

void readEEPROMAndSetPixels( void (*setStripLength)(uint16_t), void(*setPixel)(uint16_t, uint32_t, boolean) ) {
  uint16_t stripLength = EEPROM.read(0) << 8 | EEPROM.read(1);
  if (stripLength > MAX_PIXELS) stripLength = MAX_PIXELS;

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

void writePixelToEEPROM(uint16_t position, uint8_t red, uint8_t green, uint8_t blue, uint8_t white) {
  int x = (position + EEPROM_OFFSET )*4;
  EEPROM.write(x, red);
  EEPROM.write(x+1, green);
  EEPROM.write(x+2, blue);
  EEPROM.write(x+3, white);
}

void commitEEPROM() {
  EEPROM.commit();
}

void writeStripLengthToEEPROM(uint16_t stripLength) {
  if (stripLength > MAX_PIXELS) stripLength = MAX_PIXELS;

  EEPROM.write(0, stripLength >> 8);
  EEPROM.write(1, stripLength);
  // Serial.println((stripLength >> 8),BIN);
  // Serial.println((uint8_t)stripLength, BIN);
  EEPROM.commit();
}

void writeDividerToEEPROM(uint8_t index, uint16_t position) {
  Serial.print("input divider - ");
  Serial.println(position);
    Serial.print("bit 1 - ");
  Serial.println(position >> 8);
    Serial.print("bit 2 - ");
  Serial.println((uint8_t)position);
  index *= 2;
  EEPROM.write(index+2, position >> 8);
  EEPROM.write(index+3, position);
}

void writeEffectSpeedToEEPROM(uint16_t effectSpeed) {
  EEPROM.write(10, effectSpeed >> 8);
  EEPROM.write(11, effectSpeed);
  // Serial.println((EEPROM.read(7) << 8) + EEPROM.read(8));
}

uint16_t readDividerFromEEPROM(uint8_t index) {
  // Serial.print("index - ");
  // Serial.println(index);
  index *= 2;
  // Serial.print("divider - ");
  // Serial.println(EEPROM.read(index+2) << 8 | EEPROM.read(index+3));
  return EEPROM.read(index+2) << 8 | EEPROM.read(index+3);

}
uint16_t readEffectSpeedFromEEPROM() {

  return EEPROM.read(10) << 8 | EEPROM.read(11) ;
}
