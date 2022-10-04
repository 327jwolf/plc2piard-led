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
unsigned long previousMillis2 = 0;
const long interval = 2000;
int previousInChar = 0;
bool tog = 0;
bool blink1 = 0;

String outString = "";
char buffer[31]="";

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
  pinMode(3, OUTPUT);
  pinMode(5, OUTPUT);
  pinMode(6, OUTPUT);
  
  // turn on pin 13 to power the LEDs:
  pinMode(13, OUTPUT);
  digitalWrite(13, HIGH);
}



void loop() {
  int inChar = ">";
  unsigned long currentMillis = millis();

  // Read serial input:
  if (Serial.available() > 0) {
    inChar = Serial.read();
    previousMillis = currentMillis;
    // previousInChar = inChar;
    tog = 0;
  }
  
  if (isDigit(inChar)) {
    // convert the incoming byte to a char 
    // and add it to the string:
    inString += (char)inChar;
    previousMillis = currentMillis;
    previousInChar = inChar;
    tog = 0;
  }

  // if you get a comma, convert to a number,
  // set the appropriate color, and increment
  // the color counter:
  if (inChar == ',' && previousInChar != ',') {
    tog = 0;
    previousMillis = currentMillis;
    previousInChar = inChar;
    // do something different for each value of currentColor:
    switch (currentColor) {
    case 0:    // 0 = red
      red = inString.toInt();
      break;
    case 1:    // 1 = green:
      green = inString.toInt();
      break;
    case 2:    // 1 = green:
      blue = inString.toInt();
      break;
    default:    
      break;
    }
    outString += inString;
    outString += "; ";
    inString = "";
    currentColor++;
  }
  // if you get a newline, you know you've got
  // the last color, i.e. blue:
  if (inChar == '\n' && previousInChar != '\n') {
    tog = 0;
    blue = inString.toInt();
    outString += inString;
    // clear the string for new input:
    inString = "";
    // reset the color counter:
    currentColor = 0;
    previousInChar = inChar;
    previousMillis = currentMillis;


    analogWrite(11, red);
    analogWrite(3, red);
    analogWrite(9, green);
    analogWrite(5, green);
    analogWrite(10, blue);
    analogWrite(6, blue);

    sprintf(buffer, "Red: %03d, Green: %03d, Blue: %03d", red, green, blue); 
    Serial.println(buffer);
    Serial.println(outString);
    outString = "";

    // print the colors:
    // Serial.print("Red: ");
    // Serial.print(red);
    // Serial.print(", Green: ");
    // Serial.print(green);
    // Serial.print(", Blue: ");
    // Serial.println(blue);
  }
  
  if (currentMillis - previousMillis >= interval ) {
    //&& inChar == previousInChar
    // save the last time you blinked the LED
    previousMillis = currentMillis;

    analogWrite(3, 0);
    analogWrite(5, 0);
    analogWrite(6, 0);
    analogWrite(9, 0);
    analogWrite(10, 0);
    analogWrite(11, 0);
  }
  
//    if (tog && currentMillis - previousMillis2 >= interval)
//    {
//      
//      if (blink1)
//      {
//        analogWrite(11, 255);
//        analogWrite(9, 255);
//        analogWrite(10, 255);
//        blink1 = !blink1;
// 
//      }
//      else
//      {
//        analogWrite(11, 0);
//        analogWrite(9, 0);
//        analogWrite(10, 0);
//        blink1 = !blink1;
//
//      }
//      previousMillis2 = currentMillis;
//    }
  tog = 1; 

}
