#ifdef ESP32
#include <WiFi.h>

#else
#include <ESP8266WiFi.h>
#endif


static const unsigned int localPort = 2390;  // local port to listen for UDP packets
IPAddress timeServerIP;  // time.nist.gov NTP server address
static const char* ntpServerName = "time.nist.gov";
static const int NTP_PACKET_SIZE = 48;  // NTP time stamp is in the first 48 bytes of the message
WiFiUDP udp;

static uint32_t epoch = 0;
static float schedule[10];
static uint8_t scheduleLength = 4;
static uint8_t profile = 0;


static byte packetBuffer[NTP_PACKET_SIZE]; 

void startNTP() {
    Serial.println("Starting UDP");
    udp.begin(localPort);
    Serial.print("Local port: ");
    // Serial.println(udp.localPort());
}

// send an NTP request to the time server at the given address
void sendNTPpacket(IPAddress& address) {
  Serial.println("sending NTP packet...");
  // set all bytes in the buffer to 0
  memset(packetBuffer, 0, NTP_PACKET_SIZE);
  // Initialize values needed to form NTP request
  // (see URL above for details on the packets)
  packetBuffer[0] = 0b11100011;  // LI, Version, Mode
  packetBuffer[1] = 0;           // Stratum, or type of clock
  packetBuffer[2] = 6;           // Polling Interval
  packetBuffer[3] = 0xEC;        // Peer Clock Precision
  // 8 bytes of zero for Root Delay & Root Dispersion
  packetBuffer[12] = 49;
  packetBuffer[13] = 0x4E;
  packetBuffer[14] = 49;
  packetBuffer[15] = 52;

  // all NTP fields have been given values, now
  // you can send a packet requesting a timestamp:
  udp.beginPacket(address, 123);  // NTP requests are to port 123
  udp.write(packetBuffer, NTP_PACKET_SIZE);
  udp.endPacket();
}

uint32_t getTime() {
    // get a random server from the pool
  WiFi.hostByName(ntpServerName, timeServerIP);

  sendNTPpacket(timeServerIP);  // send an NTP packet to a time server
  // wait to see if a reply is available
  delay(1000);

  int cb = udp.parsePacket();
  if (!cb) {
    Serial.println("no packet yet");
  } else {
    Serial.print("packet received, length=");
    Serial.println(cb);
    // We've received a packet, read the data from it
    udp.read(packetBuffer, NTP_PACKET_SIZE);  // read the packet into the buffer

    // the timestamp starts at byte 40 of the received packet and is four bytes,
    //  or two words, long. First, esxtract the two words:

    unsigned long highWord = word(packetBuffer[40], packetBuffer[41]);
    unsigned long lowWord = word(packetBuffer[42], packetBuffer[43]);
    // combine the four bytes (two words) into a long integer
    // this is NTP time (seconds since Jan 1 1900):
    unsigned long secsSince1900 = highWord << 16 | lowWord;
    Serial.print("Seconds since Jan 1 1900 = ");
    Serial.println(secsSince1900);

    // now convert NTP time into everyday time:
    Serial.print("Unix time = ");
    // Unix time starts on Jan 1 1970. In seconds, that's 2208988800:
    const unsigned long seventyYears = 2208988800UL;
    // subtract seventy years:
    unsigned long epoch = secsSince1900 - seventyYears;
    // print Unix time:
    Serial.println(epoch);


    // print the hour, minute and second:
    Serial.print("The UTC time is ");       // UTC is the time at Greenwich Meridian (GMT)
    Serial.print((epoch % 86400L) / 3600);  // print the hour (86400 equals secs per day)
    Serial.print(':');
    if (((epoch % 3600) / 60) < 10) {
      // In the first 10 minutes of each hour, we'll want a leading '0'
      Serial.print('0');
    }
    Serial.print((epoch % 3600) / 60);  // print the minute (3600 equals secs per minute)
    Serial.print(':');
    if ((epoch % 60) < 10) {
      // In the first 10 seconds of each minute, we'll want a leading '0'
      Serial.print('0');
    }
    Serial.println(epoch % 60);  // print the second
    return epoch;
  }
  // wait ten seconds before asking for the time again
  return 0;
}

float getTimeDecimal() {
  float temp = (epoch % 86400L) / 3600 ;
  float decimal = (float((epoch % 3600) / 60) / 60) ;
  return temp + decimal;
}

static unsigned long NTPPreviousMillis = 0;
void NTPTimer() {
    unsigned long currentMillis = millis();
    if (currentMillis - NTPPreviousMillis >= 3600000) {
      NTPPreviousMillis = currentMillis;
      uint32_t _epoch = getTime();
      if (_epoch > 0) epoch = _epoch;
    }
}


uint8_t determineProfileUsedRealTime() {
  float timeDecimal = getTimeDecimal();
  Serial.print(timeDecimal);
  Serial.print("----");

  // int scheduleSize = 3;
  int _profile = 0;
  int biggest = 0;
  float temp = schedule[0];
  Serial.print(schedule[0]);
  for (int i=1; i < 4; i++) {
          Serial.print(",");
      Serial.print(schedule[i]);
    if (schedule[i] > temp) {
      temp = schedule[i];
      biggest = i;
    }
  }
  Serial.println();
  Serial.print("biggest - ");
  _profile = biggest;
  Serial.println(temp);
  temp = 0;
  for (int i=0; i < scheduleLength; i++) {
    bool isOn = ( schedule[i] <= timeDecimal && schedule[i] > temp );
    if (isOn) {
      _profile = i;
      temp = schedule[i];
    }
    Serial.print(isOn);
    Serial.print(",");
  }
  Serial.println();
  Serial.println(_profile);
  return _profile;
}

uint8_t determineProfileUsedTimer() {
  Serial.println( millis()/10000 % 3 );
  return millis()/10000 % 3;
}

static unsigned long clockTickPreviousMillis = 0;
void clockTick(void(*activateProfile)(uint8_t, uint8_t)) {
    unsigned long currentMillis = millis();
    if (currentMillis - clockTickPreviousMillis >= 1000) {
      clockTickPreviousMillis = currentMillis;
        epoch++;
        // uint8_t _profile = determineProfileUsedRealTime();
        uint8_t _profile = determineProfileUsedTimer();
        if (profile != _profile) {
          (*activateProfile)(profile, _profile);
          profile = _profile;
        }
        Serial.print("HEAP - ");
        Serial.println(ESP.getFreeHeap());

    }  

}
