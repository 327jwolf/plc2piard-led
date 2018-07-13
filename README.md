plc2piard-led
=============

This project was inspired by the DMX controllers, allowing for scenes using LED RGB lighting. 

I wanted to control the LED strips from a PLC, without using a DMX programmer or driver. My idea was to use a Raspberry Pi to read from a PLC and send RGB color schemes to an Arduino thru USB to Serial connection. The Arduino would then use PWM outputs to drive a MOSFET for each of the RGB channels.

The RPi would also allow the user to set the color schemes through a Web Interface. 

All programming in the RPi  would done with Node.js and javascript. The Arduino wold, of course, use the Arduino IDE and a sketch.

## Parts List

1. Raspberry Pi Model 3 B+
2. Elegoo EL-CB-001 UNO R3 Board ATmega328P ATMEGA16U2 with USB Cable for Arduino
  + [Check it out here...](https://www.amazon.com/Elegoo-EL-CB-001-ATmega328P-ATMEGA16U2-Arduino/dp/B01EWOE0UU/ref=pd_nav_hcs_rp_t_1?_encoding=UTF8&psc=1&refRID=3RX41FE1J3AE63QPM8AN)
3. Diymore 4 Channels 4 Route MOSFET Button IRF540 V2.0 + MOSFET Switch Module for Arduino
  + [Check it out here...](https://www.amazon.com/Diymore-Channels-MOSFET-Button-Arduino/dp/B01MRQFYJN/ref=pd_sbs_328_2?_encoding=UTF8&pd_rd_i=B01MRQFYJN&pd_rd_r=5793619c-8332-11e8-9f1d-6db4f4e7a1f7&pd_rd_w=5Ukjc&pd_rd_wg=q25oy&pf_rd_i=desktop-dp-sims&pf_rd_m=ATVPDKIKX0DER&pf_rd_p=5825442648805390339&pf_rd_r=W3HC2625TAHWP2XVHMYZ&pf_rd_s=desktop-dp-sims&pf_rd_t=40701&psc=1&refRID=W3HC2625TAHWP2XVHMYZ)
4. A powered USB Hub any brand with at least a 2.5 amp power supply. 


