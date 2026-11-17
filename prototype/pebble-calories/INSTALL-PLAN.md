# Pebble Round 2 test installation

This PR currently contains calculation code, not a .pbw watchface.

Once the TimeStyle test fork is compiled for the Round 2 (gabbro), give it a distinct app UUID and name to preserve the existing TimeStyle.

1. Download the .pbw onto iPhone in Files, Mail, or AirDrop.
2. Share/open it with Pebble Core.
3. Install the sideloaded face from Pebble Core's app locker to the connected watch.
4. Switch back to the original TimeStyle anytime.

Official instructions: https://developer.repebble.com/guides/tools-and-resources/testing-with-the-mobile-app/

Before packaging: verify time-resolved Pebble calories, avoid double-counting, test iOS background refresh with phone locked, compare daily total against Apple Health, and display last-update time. Never label an uncorrected sum as accurate.