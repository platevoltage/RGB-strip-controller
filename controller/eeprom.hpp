#include <sys/types.h>
#include <LittleFS.h>
#include "FS.h"



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
void createDir(const char * path){
    Serial.printf("Creating Dir: %s\n", path);
    if(LittleFS.mkdir(path)){
        Serial.println("Dir created");
    } else {
        Serial.println("mkdir failed");
    }
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
  delay(200); // Make sure the CREATE and LASTWRITE times are different
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

uint16_t readStripLengthFromEEPROM() {
  String string = readFile( "/stripLength.txt");
  return string.toInt();
}


void writePixelsToEEPROM(uint32_t currentData[], size_t length, uint8_t profile) {
  String message;
  for (int i=0; i < length; i++) {
    uint32_t color = currentData[i];

    message += String(color);
    if(i < length-1) message += '\n';
  }
  writeFile( ("/" + (String)profile + "/pixels.txt").c_str(), message);
  // writeFile("0/pixels.txt", message);
}

String readPixelsFromEEPROM(uint8_t profile) {
  String message = readFile( ("/" + (String)profile + "/pixels.txt").c_str());
  // String message = readFile("/0/pixels.txt");
  return message;
}


void writeStripLengthToEEPROM(uint16_t stripLength) {
  if (stripLength > MAX_PIXELS) stripLength = MAX_PIXELS;
  writeFile( "/stripLength.txt", String(stripLength));
}

void writeDividersToEEPROM(uint16_t positions[], size_t length) {
  String message;
  for (int i=0; i < length; i++) {
    if (positions[i] > 0) {
      message += positions[i];
      message += "\n";
    }
  }
  writeFile( "/dividers.txt", message);
}

void writeEffectSpeedToEEPROM(uint16_t effectSpeed, uint8_t profile) {
  // writeFile("effectSpeed.txt", String(effectSpeed));
  writeFile( ("/" + (String)profile + "/effectSpeed.txt").c_str(), String(effectSpeed));
}
void writeCurrentProfileToEEPROM(uint8_t profile) {
  writeFile( "/profile.txt", String(profile));
}

String readDividersFromEEPROM() {
  String message = readFile( "/dividers.txt");
  return message;
}
uint16_t readEffectSpeedFromEEPROM(uint8_t profile) {
  // String string = readFile("/effectSpeed.txt");
  String message = readFile(( "/" + (String)profile + "/effectSpeed.txt").c_str());

  return message.toInt();
}
uint8_t readCurrentProfileFromEEPROM() {
  String string = readFile( "/profile.txt");
  return string.toInt();
}

String readBonjourNameFromEEPROM() {
  String message = readFile( "/bonjour.txt");
  return message;
}

void writeBonjourNameToEEPROM(String bonjourName) {
  writeFile( "/bonjour.txt", bonjourName);
}

