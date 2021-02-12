# Temperature and Humidity Monitor

## TODO:
* Stabilize unsupervised running.
  * Why does it fail? WiFi/Internet disconnect? How to resolve?
  * \+ CXN to mongoDB fails. On fail, try to connect to something else reliable, e.g., Google, to rule out network issues. [Reference](https://paulgalow.com/how-to-check-for-internet-connectivity-node). Use simpler mitigations before elevating to reboot.
  * Logging:
    * \[x\] add DEBUG=app:* to cron task, follow up with >> log.txt
    * \[x\] log file
* Chart aeshetics and readability
  * \[x\] Parse timestamps. For tooltips, use [tooltip callback function](https://www.chartjs.org/docs/latest/configuration/tooltip.html).  
  * \[x\] Colors.  
  * \[x\] Mobile: don't display, display warning, or otherwise adapt to be readable.  
  * Shallower/shorter on full-width desktop; fit full chart on one screen.  
* Efficiency
  * \[x\] Store date object, not string. Is this a breaking change?
  * \[x\] Get data only once
* Multi-unit
  * \[x\] Make stability and efficiency improvements
  * \[x\] Move all differentiating variables to dotenv \(location, database\)
  * New page layout, or use mutiple pages \(?\); display location for each
  * Make main server cloud-based (Heroku)
  * Seperate server code from sensor read and post code
  * design file structure for ease of access and universality

## Main Features Desired

### Phase 1
\[x\] Webpage displaying most recent temperature and humidity (T&H) datapoint.  
\[x\] T&H read every 60 seconds.  
\[x\] Served via Express and a simple variable held and updated in Node.  

### Phase 2
Webpage displaying current T&H as a number, and **historical T&H data as a graph.**  
\[x\] Served via Express, but need database to persist old data.  
\[x\] T&H recorded every 300 seconds, yielding 288 datapoints per day.  
\[x\] Graph via chart.js  

### Phase 3
\[x\] Run disconnected from SSH.  
\[x\] Run from headless startup.  
\[x\] Recover from power failure.  
~~Add reboot button.~~  
Push updates to page.  
Requests beyond last 48-hour period, server-side scripts will handle.  
Refactor code.  
Add "table" mode with reduced number of data points.  

## Notes
1. To keep running after exiting PuTTY, use `nohup npm start &` then `exit` before closing. Add `DEBUG=app:*` prior, as a discreet command, to turn on debugging.
2. Noticed failure to connect BEFORE an initial failed post to mdb. So it seems to be the network, at least sometimes.
3. Strategy to catch failures: 
  1. If server fails to connect to mongoDB Atlas, reboot. (Opt.: check another connection, like Google.)
  2. Run server script on boot.
  3. Wait 60 seconds after script start before trying to send requests to allow for wifi connection.

## Resources
* [RPIO](https://www.npmjs.com/package/rpio)  
* [ExpressJS](https://expressjs.com/)  
* [EJS](https://ejs.co/)  
* [socket.io](https://socket.io/)  
* [Raspberry Pi Pinout](https://pinout.xyz/)  
* [DHT Module](https://github.com/momenso/node-dht-sensor)  
* [mongoDB Node Fundamentals](https://docs.mongodb.com/drivers/node/fundamentals)  
* [chart.js](https://www.chartjs.org)  