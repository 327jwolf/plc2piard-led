/*

 RGB controller
 
 The circuit:
 * Common-anode RGB LED cathodes attached to pins 9 - 11
 * LED anode connected to pin 13
 created 21 October 2021
 by Jim Hibbs
 
 This example code is in the public domain. 
 */
#define ENABLE_PIN 13
#define RED_PIN 11
#define GREEN_PIN 9
#define BLUE_PIN 10

int currentColor = 0;
int red, green, blue = 0;
long randNumber;
unsigned long previousMillis = 0;
const long interval = 5100;
int delayTime = 50;
int increament = 3;
bool timeDone = true;

void setup() {
  randomSeed(analogRead(0));
  pinMode(BLUE_PIN, OUTPUT);
  pinMode(GREEN_PIN, OUTPUT);
  pinMode(BLUE_PIN, OUTPUT);
  pinMode(ENABLE_PIN, OUTPUT);
  digitalWrite(ENABLE_PIN, HIGH);
}

void loop() {
  unsigned long currentMillis = millis();
  ;
  for(currentColor = 1; currentColor < 8; currentColor++){
    rotateFadeInOut(currentColor);
  }
  for(int x = 1; x < 8; x++){
    fastChange(x);
    delay(delayTime*20);
    turnOffLEDs();
    delay(delayTime*10);
  }
  // for(int y = 1; y < 8; y++){
  //   strobeLEDs(y);
  //   // delay(delayTime*10);
  //   turnOffLEDs();
  //   delay(delayTime*5);
  // }
}

void writeLEDS (int R, int G, int B) {
  analogWrite (RED_PIN, R); 
  analogWrite (GREEN_PIN, G);
  analogWrite (BLUE_PIN, B);
}

void fastChange(int count){
  changeColor1(count);
  delay(delayTime);
  writeLEDS(red, green, blue);
}

void strobeLEDs(int count){
  changeColor1(count);
  for(int inc = 1; inc < 8; inc++){
    delay(delayTime*2);
    writeLEDS(red, green, blue);
    // writeLEDS(255, 255, 255);
    delay(delayTime*2);
    writeLEDS(0, 0, 0);
  }
}

void turnOffLEDs(){
  writeLEDS(0, 0, 0);
}

void rotateFadeInOut(int colorCount){
  changeColor1(colorCount);
  delay(delayTime);
  fadeInfadeOutLEDs(colorCount);
  turnOffLEDs();
}

void fadeInfadeOutLEDs(int count){
  int redInitial = red;
  int greenInitial = green;
  int blueInitial = blue;
  for (int value = 1 ; value < 256; value += increament){
    redInitial != 255 ? red : red = value;
    greenInitial != 255 ? green : green = value;
    blueInitial != 255 ? blue : blue = value;
    writeLEDS(red, green, blue);
    delay(delayTime);
  }
  // strobeLEDs(count);
  delay(delayTime*2);

  for (int value = 255 ; value > 1; value -= increament){
    redInitial != 255 ? red : red = value;
    greenInitial != 255 ? green : green = value;
    blueInitial != 255 ? blue : blue = value;
    writeLEDS(red, green, blue);
    delay(delayTime);
  }
}

void changeColor1(int count){
  int randomRange = 5;
  switch(count){
    case 1:
      red = 255;
      green = 0;
      blue = 0;
      break;
     case 2:
      red = 0;
      green = 255;
      blue = 0;
      break;
     case 3:
      red = 255;
      green = 255;
      blue = 0;
      break;
     case 4:
      red = 0;
      green = 0;
      blue = 255;
      break;
     case 5:
      red = 255;
      green = 0;
      blue = 255;
      break;
     case 6:
      red = 0;
      green = 255;
      blue = 255;
      break;
     case 7:
      red = 255;
      green = 255;
      blue = 255;
      break;
  }

}
void changeColor2(int count){
  int randomRange = 5;
  switch(count){
    case 1:
      red = 255;
      green = 0;
      blue = 0;
      break;
     case 2:
      red = 255;
      green = 20;
      blue = 0;
      break;
     case 3:
      red = 255;
      green = 255;
      blue = 0;
      break;
     case 4:
      red = 0;
      green = 255;
      blue = 0;
      break;
     case 5:
      red = 0;
      green = 0;
      blue = 255;
      break;
     case 6:
      red = 0;
      green = 255;
      blue = 255;
      break;
     case 7:
      red = 255;
      green = 0;
      blue = 255;
      break;
  }
}


