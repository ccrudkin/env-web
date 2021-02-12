# Temperature and Humidity Monitor

## TODO:
* Stabilize unsupervised running.
  * Why does it fail? WiFi/Internet disconnect? How to resolve?
  * \+ CXN to mongoDB fails. On fail, try to connect to something else reliable, e.g., Google, to rule out network issues. [Reference](https://paulgalow.com/how-to-check-for-internet-connectivity-node). Use simpler mitigations before elevating to reboot.
* Multi-unit
  * \[x\] Make stability and efficiency improvements
  * \[x\] Move all differentiating variables to dotenv \(location, database\)
  * New page layout, or use mutiple pages \(?\); display location for each
  * Make main server cloud-based (Heroku)
  * Seperate server code from sensor read and post code
  * design file structure for ease of access and universality
* Walk back "access from anywhere" for MongoDB
* Display local time
* Highlight unit
* Style buttons

## Main Features Desired

### Web Phase 1
Push updates to page while live (try for fresh updates every minute).  
Requests beyond last 48-hour period, server-side scripts will handle.  
Refactor code.  
Add "table" mode with reduced number of data points.  