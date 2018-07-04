/*
  Serial RGB controller
 
 Reads a serial input string looking for three comma-separated
 integers with a newline at the end. Values should be between 
 0 and 255. The sketch uses those values to set the color 
 of an RGB LED attached to pins 9 - 11.
 
 The circuit:
 * Common-anode RGB LED cathodes attached to pins 9 - 11
 * LED anode connected to pin 13
 
 To turn on any given channel, set the pin LOW.  
 To turn off, set the pin HIGH. The higher the analogWrite level,
 the lower the brightness.
 
 created 29 Nov 2010
 by Tom Igoe
 
 edited 03 July 2018
 by Jim Hibbs
 
 This example code is in the public domain. 
 */

String inString = "";    // string to hold input
int currentColor = 0;
int red, green, blue = 0;
long randNumber;
unsigned long previousMillis = 0;
const long interval = 2000;
int previousInChar = 0;

void setup() {
  // Open serial communications and wait for port to open:
  Serial.begin(9600);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for Leonardo only
  
  }
  randomSeed(analogRead(0));
  // send an intro:
  Serial.println("\n\nString toInt() RGB:");
  Serial.println();
  // set LED cathode pins as outputs:
  pinMode(9, OUTPUT);
  pinMode(10, OUTPUT);
  pinMode(11, OUTPUT);
  // turn on pin 13 to power the LEDs:
  pinMode(13, OUTPUT);
  digitalWrite(13, HIGH);
}



void loop() {
  int inChar;
  unsigned long currentMillis = millis();

  // Read serial input:
  if (Serial.available() > 0) {
    inChar = Serial.read();
    previousMillis = currentMillis;
    previousInChar = inChar;
  }
  
  if (isDigit(inChar)) {
    // convert the incoming byte to a char 
    // and add it to the string:
    inString += (char)inChar;
    previousMillis = currentMillis;
    previousInChar = inChar;
  }

  // if you get a comma, convert to a number,
  // set the appropriate color, and increment
  // the color counter:
  if (inChar == ',') {
    previousMillis = currentMillis;
    previousInChar = inChar;
    // do something different for each value of currentColor:
    switch (currentColor) {
    case 0:    // 0 = red
      red = inString.toInt();
      // clear the string for new input:
      inString = ""; 
      break;
    case 1:    // 1 = green:
      green = inString.toInt();
      // clear the string for new input:
      inString = ""; 
      break;
    }
    currentColor++;
  }
  // if you get a newline, you know you've got
  // the last color, i.e. blue:
  if (inChar == '\n') {
    blue = inString.toInt();

    // set the levels of the LED.
    // subtract value from 255 because a higher
    // analogWrite level means a dimmer LED, since
    // you're raising the level on the anode:
//    if(true){
//      randNumber = random(256);
//      red = randNumber;
//      randNumber = random(256);
//      green = randNumber;
//      randNumber = random(256);
//      blue = randNumber;
//    }
    analogWrite(11, red);
    analogWrite(9, green);
    analogWrite(10, blue);

    // print the colors:
    Serial.print("Red: ");
    Serial.print(red);
    Serial.print(", Green: ");
    Serial.print(green);
    Serial.print(", Blue: ");
    Serial.println(blue);

    // clear the string for new input:
    inString = ""; 
    // reset the color counter:
    currentColor = 0;
    previousInChar = inChar;
    previousMillis = currentMillis;
  }
  
  
  if (currentMillis - previousMillis >= interval ) {//&& inChar == previousInChar
    // save the last time you blinked the LED
    //previousMillis = currentMillis;

    analogWrite(11, 0);
    analogWrite(9, 0);
    analogWrite(10, 0);
  } 

}



