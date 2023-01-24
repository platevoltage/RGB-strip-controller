#include <sys/types.h>
#include <LittleFS.h>
#include "FS.h"

// void listDir(const char *dirname) {
//   Serial.printf("Listing directory: %s\n", dirname);

//   Dir root = LittleFS.openDir(dirname);

//   while (root.next()) {
//     File file = root.openFile("r");
//     Serial.print("  FILE: ");
//     Serial.print(root.fileName());
//     Serial.print("  SIZE: ");
//     Serial.print(file.size());
//     time_t cr = file.getCreationTime();
//     time_t lw = file.getLastWrite();
//     file.close();
//     struct tm *tmstruct = localtime(&cr);
//     Serial.printf("    CREATION: %d-%02d-%02d %02d:%02d:%02d\n", (tmstruct->tm_year) + 1900, (tmstruct->tm_mon) + 1, tmstruct->tm_mday, tmstruct->tm_hour, tmstruct->tm_min, tmstruct->tm_sec);
//     tmstruct = localtime(&lw);
//     Serial.printf("  LAST WRITE: %d-%02d-%02d %02d:%02d:%02d\n", (tmstruct->tm_year) + 1900, (tmstruct->tm_mon) + 1, tmstruct->tm_mday, tmstruct->tm_hour, tmstruct->tm_min, tmstruct->tm_sec);
//   }
// }

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



void writeFile(const char * path, const char * message) {
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


uint16_t readStripLengthFromEEPROM() {
  String string = readFile( "/stripLength.txt");
  return string.toInt();
}


void writePixelsToEEPROM(uint32_t pixelData[], size_t length, uint8_t profile) {
  String message;
  for (size_t i=0; i < length; i++) {
    uint32_t color = pixelData[i];

    message += String(color);
    if(i < length-1) message += '\n';
  }
  writeFile( ("/" + (String)profile + "/pixels.txt").c_str(), message.c_str());
}

String readPixelsFromEEPROM(uint8_t profile) {
  String message = readFile( ("/" + (String)profile + "/pixels.txt").c_str());
  return message;
}


void writeStripLengthToEEPROM(uint16_t stripLength) {
  if (stripLength > MAX_PIXELS) stripLength = MAX_PIXELS;
  writeFile( "/stripLength.txt", String(stripLength).c_str());
}

void writeDividersToEEPROM(uint16_t positions[], size_t length) {
  String message;
  for (size_t i=0; i < length; i++) {
    if (positions[i] > 0) {
      message += positions[i];
      message += "\n";
    }
  }
  writeFile( "/dividers.txt", message.c_str());
}

void writeScheduleToEEPROM(float times[], size_t length) {
  String message;
  for (size_t i=0; i < length; i++) {
      message += times[i];
      message += "\n";
  }
  writeFile( "/schedule.txt", message.c_str());
}

String readScheduleFromEEPROM() {
  String message = readFile( "/schedule.txt");
  return message;
}

void writeEffectSpeedToEEPROM(uint16_t effectSpeed, uint8_t profile) {
  writeFile( ("/" + (String)profile + "/effectSpeed.txt").c_str(), String(effectSpeed).c_str());
}
void writeCurrentProfileToEEPROM(uint8_t profile) {
  writeFile( "/profile.txt", String(profile).c_str());
}

String readDividersFromEEPROM() {
  String message = readFile( "/dividers.txt");
  return message;
}
uint16_t readEffectSpeedFromEEPROM(uint8_t profile) {
  String message = readFile(( "/" + (String)profile + "/effectSpeed.txt").c_str());

  return message.toInt();
}
uint8_t readCurrentProfileFromEEPROM() {
  String string = readFile( "/profile.txt");
  return string.toInt();
}

void writeSystemPrefsToEEPROM(String ssid, String password, String bonjourName, uint8_t dataPin, uint16_t pixelType, uint8_t brightness) {
  String message = ssid;
  message += "\n";
  message += password;
  message += "\n";
  message += bonjourName;
  message += "\n";
  message += String(dataPin);
  message += "\n";
  message += String(pixelType);
  message += "\n";
  message += String(brightness);
  writeFile( "/preferences.txt", message.c_str());
}

String readSystemPrefsFromEEPROM() {
  String message = readFile( "/preferences.txt");
  return message;
}

