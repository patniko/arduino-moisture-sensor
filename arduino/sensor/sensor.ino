#include <LiquidCrystal.h>
#include <math.h>

LiquidCrystal lcd(23,22,28,30,32,34);

const int sensorPin = A8;
const float airValue = 580.00;    // Normalize to reading from air
const float waterValue = 280.00;  // Normalize to reading in water
const float range = airValue - waterValue;   
const float intervals = range/3;

int soilMoistureValue = 0;
float soilMoisturePercentage = 0.00;

void setup() {
  Serial.begin(9600);
  pinMode(sensorPin, INPUT);
  
  lcd.begin(16,2);

  setupWifi();

  Serial.print("Air Baseline Reading: ");
  Serial.println(airValue);
  Serial.print("Water Baseline Reading:");
  Serial.println(waterValue);
}

void loop() {
  soilMoistureValue = analogRead(sensorPin); 
  Serial.print("Moisture Level: ");
  Serial.println(soilMoistureValue);
  soilMoisturePercentage = 100 - (((float)soilMoistureValue - waterValue) / range * 100);
  Serial.print("Moisture %: ");
  Serial.println(soilMoisturePercentage);

  if(soilMoistureValue > waterValue && soilMoistureValue < (waterValue + intervals))
  {
      displayReading("Soaked");
  }
  else if(soilMoistureValue > (waterValue + intervals) && soilMoistureValue < (airValue - intervals))
  {
      displayReading("Moist");
  }
  else if(soilMoistureValue > (airValue - intervals))
  {
      displayReading("Dry");
  }
  delay(500);
}

