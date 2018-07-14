plc2piard-led
=============

This project was inspired by the DMX controllers, allowing for scenes using LED RGB lighting. However, I feel DMX is overkill for simple RGB LED Strips, like the AspectLED [AL-SL-WR-U-RGBA](https://www.aspectled.com/collections/flexible-led-strip-lights/products/w-rgba-color-changing-5050-ultra-bright#tab-1).

I wanted to control the LED strips from a PLC, without using a DMX programmer or driver. My idea was to use a Raspberry Pi to read from a PLC and send RGB color schemes to an Arduino thru USB to Serial connection. The Arduino would then use PWM outputs to drive a MOSFET for each of the RGB channels.

The RPi would also allow the user to set the color schemes through a Web Interface. 

All programming in the RPi  would done with Node.js and javascript. The Arduino wold, of course, use the Arduino IDE and a sketch.

## Parts List

1. Raspberry Pi Model 3 B+
2. Elegoo EL-CB-001 UNO R3 Board ATmega328P ATMEGA16U2 with USB Cable for Arduino [Check it out here...](https://www.elegoo.com/product/elegoo-uno-r3-board-atmega328p-atmega16u2-with-usb-cable/)
3. Diymore 4 Channels 4 Route MOSFET Button IRF540 V2.0 + MOSFET Switch Module for Arduino [Check it out here...](https://www.amazon.com/Diymore-Channels-MOSFET-Button-Arduino/dp/B01MRQFYJN/ref=pd_sbs_328_2?_encoding=UTF8&pd_rd_i=B01MRQFYJN&pd_rd_r=5793619c-8332-11e8-9f1d-6db4f4e7a1f7&pd_rd_w=5Ukjc&pd_rd_wg=q25oy&pf_rd_i=desktop-dp-sims&pf_rd_m=ATVPDKIKX0DER&pf_rd_p=5825442648805390339&pf_rd_r=W3HC2625TAHWP2XVHMYZ&pf_rd_s=desktop-dp-sims&pf_rd_t=40701&psc=1&refRID=W3HC2625TAHWP2XVHMYZ)
4. A powered USB Hub any brand with at least a 2.5 amp power supply. 
5. USB Cable (A-Male to B-Male)
6. USB cable (A-Male to Micro B Male)

## Getting Project to Load on Boot

I used [this guide](https://certsimple.com/blog/deploy-node-on-linux#node-linux-service-systemd) to help me get a service set up on the RPi. First I created `plc2piard-led.service` in `/etc/systemd/system/`. The article, also, shows how to deploy automatically using GitHub or GitLab.

    [Unit]
	Description=LED Controller
	After=network.target
    
    [Service]
    ExecStart=/home/pi/code/plc2piard-led/app.js
    Restart=always
    User=nobody
    # Note RHEL/Fedora uses 'nobody', Debian/Ubuntu uses 'nogroup'
    Group=nogroup  
    Environment=PATH=/usr/bin:/usr/local/bin
    Environment=NODE_ENV=production
    WorkingDirectory=/home/pi/code/plc2piard-led
    
    [Install]
    WantedBy=multi-user.target
 **Important:**  You must add `#!/usr/bin/env node` to the top of your project entry point.
  i.e. `app.js`. Then make it executable with `chmod +x app.js`.

One of the issues I ran into was that after the service initiated, I received an error  from the `serialport` module. 
>`Error: can't open device "/dev/ttyACM0": Permission denied`
>
With the help from the Arduino.cc  forum, I found [this](https://forum.arduino.cc/index.php?topic=495039.0) helpful snippet.
>`In a terminal, with the board plugged in, enter.
>ls -l /dev/ttyACM*, this will show the group that has access to the port.
>
>Example: crw-rw-r-- 1 root dialout ... /dev/ttyACM0, root is owner, dialout is the group with >access.
>
>Entering the command, groups, in a terminal will show the groups you belong to.
>
>sudo adduser YourUserName GroupToJoin  Will fix things if you need to join a group, logout and >login after you run adduser.`
>
Just using `sudo chmod a+rw /dev/ttyACM0` worked until I rebooted, the permissions were not persistent after a reboot on a USB port.