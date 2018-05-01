#include <Adafruit_CC3000.h>

#define WLAN_SSID     ""
#define WLAN_PASS     ""
#define WLAN_SECURITY WLAN_SEC_WPA2

const char
  host[]       = "",
  route[]      = "",
  auth_code[]  = "",
  agent[]      = "Arduino-Moisture-Sensor v1.0";
  
const unsigned long
  dhcpTimeout     = 60L * 1000L, // Max time to wait for address from DHCP
  connectTimeout  = 15L * 1000L, // Max time to wait for server connection
  responseTimeout = 15L * 1000L; // Max time to wait for data from server
