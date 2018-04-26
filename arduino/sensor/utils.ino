#include <LiquidCrystal.h>
#include <math.h>

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
  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("Zone 1: ");
  lcd.setCursor(8,0);
  
  char percent [6]; 
  sprintf(percent, "%s%%", String(soilMoisturePercentage).c_str());
  lcd.print(percent);

  lcd.setCursor(0,1);
  lcd.print(value);
}
