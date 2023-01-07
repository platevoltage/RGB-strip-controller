#include "HardwareSerial.h"
#include <EEPROM.h>
#include <LittleFS.h>
#include <FS.h>

#define EEPROM_OFFSET 20

//stripLength - 0,1
//dividers - 2,3,4,5,6,7,8,9
//effectSpeed - 10,11
void listDir(const char * dirname) {
  Serial.printf("Listing directory: %s\n", dirname);

  Dir root = LittleFS.openDir(dirname);

  while (root.next()) {
    File file = root.openFile("r");
    Serial.print("  FILE: ");
    Serial.print(root.fileName());
    Serial.print("  SIZE: ");
    Serial.print(file.size());
    time_t cr = file.getCreationTime();
    time_t lw = file.getLastWrite();
    file.close();
    struct tm * tmstruct = localtime(&cr);
    Serial.printf("    CREATION: %d-%02d-%02d %02d:%02d:%02d\n", (tmstruct->tm_year) + 1900, (tmstruct->tm_mon) + 1, tmstruct->tm_mday, tmstruct->tm_hour, tmstruct->tm_min, tmstruct->tm_sec);
    tmstruct = localtime(&lw);
    Serial.printf("  LAST WRITE: %d-%02d-%02d %02d:%02d:%02d\n", (tmstruct->tm_year) + 1900, (tmstruct->tm_mon) + 1, tmstruct->tm_mday, tmstruct->tm_hour, tmstruct->tm_min, tmstruct->tm_sec);
  }
}

int * readLinesFromFile(const char * path, uint16_t from, uint16_t to) {
  Serial.printf("Reading file: %s\n", path);

  File file = LittleFS.open(path, "r");
  if (!file) {
    Serial.println("Failed to open file for reading");
  }

  Serial.print("Read from file: ");
  static int data[100];
  uint16_t count = 0;
  while (file.available()) {
    data[count] = file.readStringUntil('\n').toInt();
    if (count == to) break;
    count++;
    // Serial.write(file.read());
  }

  file.close();

  return data;
}

String readFile(const char * path) {
  Serial.printf("Reading file: %s\n", path);

  File file = LittleFS.open(path, "r");
  if (!file) {
    Serial.println("Failed to open file for reading");
  }

  Serial.print("Read from file: ");
  String data;

  while (file.available()) {
    data += file.readString();

    // Serial.write(file.read());
  }
  // Serial.println(data);
  file.close();
  return data;
}

void writeFile(const char * path, String message) {
  Serial.printf("Writing file: %s\n", path);

  File file = LittleFS.open(path, "w");
  if (!file) {
    Serial.println("Failed to open file for writing");
    return;
  }
  if (file.print(message)) {
    Serial.println("File written");
  } else {
    Serial.println("Write failed");
  }
  delay(2000); // Make sure the CREATE and LASTWRITE times are different
  file.close();
}

void appendFile(const char * path, String message) {
  Serial.printf("Appending to file: %s\n", path);

  File file = LittleFS.open(path, "a");
  if (!file) {
    Serial.println("Failed to open file for appending");
    return;
  }
  if (file.print(message)) {
    Serial.println("Message appended");
  } else {
    Serial.println("Append failed");
  }
  file.close();
}

void renameFile(const char * path1, const char * path2) {
  Serial.printf("Renaming file %s to %s\n", path1, path2);
  if (LittleFS.rename(path1, path2)) {
    Serial.println("File renamed");
  } else {
    Serial.println("Rename failed");
  }
}

void deleteFile(const char * path) {
  Serial.printf("Deleting file: %s\n", path);
  if (LittleFS.remove(path)) {
    Serial.println("File deleted");
  } else {
    Serial.println("Delete failed");
  }
}



void EEPROMinit() {
  if (EEPROM.read(0) == 255) {
    for (int i=0; i < EEPROM_SIZE; i++) {
      EEPROM.write(i, 0);
    }
    EEPROM.write(1, 20); //sets length to 20 if eeprom needs to be initialized
    EEPROM.commit();
  }
}

uint16_t readStripLengthFromEEPROM() {
  String string = readFile("/stripLength.txt");
  return string.toInt();
}


uint8_t readEEPROMAndReturnSubPixel(uint16_t position, uint8_t subPixel) {
  return EEPROM.read((position + EEPROM_OFFSET) * 4 + subPixel);    
}



void writePixelsToEEPROM(uint8_t currentData[][4], size_t length) {
  String message;
  for (int i=0; i < length; i++) {
    uint32_t color = currentData[i][0];
    for (int j=1; j < 4; j++) {
      color = color << 8 | currentData[i][j];
    }
    message += String(color);
    if(i < length-1) message += '\n';
    // message += "4278255360\n";
  }
  writeFile("pixels.txt", message);

  // String message;
  // for (int i=0; i < length; i++) {
  //   for (int j=0; j < 4; j++) {
  //     String byte = String(currentData[i][j], HEX);
  //     if (byte.length() < 1) {
  //       message += "0";
  //     }
  //     if (byte.length() < 2) {
  //       message += "0";
  //     }
  //     message += byte;
  //   }
  //   message += '\n';
  // }

  // Serial.println(message);
  // int x = (position + EEPROM_OFFSET )*4;
  // EEPROM.write(x, red);
  // EEPROM.write(x+1, green);
  // EEPROM.write(x+2, blue);
  // EEPROM.write(x+3, white);
}

String readPixelsFromEEPROM() {
  String message = readFile("/pixels.txt");
  return message;
}


void writeStripLengthToEEPROM(uint16_t stripLength) {
  if (stripLength > MAX_PIXELS) stripLength = MAX_PIXELS;

  EEPROM.commit();
  writeFile("stripLength.txt", String(stripLength));
}

void writeDividersToEEPROM(uint16_t positions[], size_t length) {
  String message;
  for (int i=0; i < length; i++) {
    if (positions[i] > 0) {
      message += positions[i];
      message += "\n";
    }
  }
  writeFile("dividers.txt", message);
}

void writeEffectSpeedToEEPROM(uint16_t effectSpeed) {
  writeFile("effectSpeed.txt", String(effectSpeed));
}

String readDividersFromEEPROM() {
  String message = readFile("/dividers.txt");
  return message;
}
uint16_t readEffectSpeedFromEEPROM() {
  String string = readFile("/effectSpeed.txt");
  return string.toInt();
}
