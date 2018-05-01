#include <LiquidCrystal.h>
#include <math.h>

const int post_reading = 30;
int reading = 15;

void msg(String value)
{
  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print(value);
}

void msg2(String value)
{
  lcd.setCursor(0,1);
  lcd.print(value);
}

void displayReading(String value) {
  msg("Zone 1: ");
  lcd.setCursor(8,0);
  
  char percent [6]; 
  sprintf(percent, "%s%%", String(soilMoisturePercentage).c_str());
  lcd.print(percent);

  lcd.setCursor(0,1);
  lcd.print(value);

  reading = ++reading;
  if(reading >= post_reading)
  {
    lcd.setCursor(15,0);
    lcd.print("U");
    String address = trackUrl(value, soilMoisturePercentage);
    Serial.print("Posting result: ");
    Serial.println(address);
    trackEvent(address);
    reading = 0;
  }
}

