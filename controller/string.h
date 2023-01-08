String getValue(String data, char separator, int index) {
    int found = 0;
    int strIndex[] = { 0, -1 };
    int maxIndex = data.length() - 1;

    for (int i = 0; i <= maxIndex && found <= index; i++) {
        if (data.charAt(i) == separator || i == maxIndex) {
            found++;
            strIndex[0] = strIndex[1] + 1;
            strIndex[1] = (i == maxIndex) ? i+1 : i;
        }
    }
    return found > index ? data.substring(strIndex[0], strIndex[1]) : "";
}

//turns 32 bit unsigned int from string to number. Built in method doesn't work.
uint32_t toInt32(String numberString) {
  if (numberString.length() == 9) {
    uint8_t straggler = (numberString[0] - '0');
    return numberString.substring(1, numberString.length()).toInt() + straggler*100000000;
  }
  if (numberString.length() == 10) {
    uint8_t straggler = ((numberString[0] - '0')*10 + (numberString[1] - '0'));
    return numberString.substring(2, numberString.length()).toInt() + straggler*100000000;
  }
  else return numberString.toInt();
}