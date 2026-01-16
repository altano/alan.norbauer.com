var timeoutTimer; // we'll use this to catch timeouts
var requestCounter; // # of requests we've made (loops back to 0 after 30k requests)
var lastTime;
var totalTime;

// Executed at start of application (body onLoad)
function init() {
  timeoutTimer = false;
  requestCounter = 0;
  
  lastTime = new Date();
  lastTime -= 100;
  
  totalTime = 0;
  
  // start polling
  makeRequest();
}

// Loops infinitely, trying to make requests
function makeRequest() {
  // calculate times
  var curTime = new Date();
  var requestTime = curTime - lastTime - 100;  // account for 100ms delay
  document.getElementById("requestTime").innerHTML = requestTime;
  
  // calculate averages
  totalTime += requestTime;
  document.getElementById("averageTime").innerHTML =
      Math.round( totalTime / requestCounter * 100 ) / 100;  // round to two decimal spaces
  
  // reset clock
  lastTime = curTime;
  
  if (requestCounter > 30000) {
    totalTime = 0;
    requestCounter = 0;
  }
  else {
    requestCounter++;
  }
  document.getElementById("requestCounter").innerHTML = requestCounter.toString();

  // XMLHttpRequest obj not re-usable?
  var xmlhttp = createXmlObj(updateString);

  // Let's get the ball rolling... [re]start the application
  var url = "characterGenerator.php";

  // every 100 requests, do something
  if (requestCounter % 100 == 0) {
    url += "&doSomething_a=1";
  }

  // every 99 requests, do something else
  if (requestCounter % 99 == 0) {
    url += "&doSomething_b=1";
  }

  // start timeout timer; goes off if no response in 5 seconds
  if (timeoutTimer != null) {
    clearTimeout(timeoutTimer);
  }
  timeoutTimer = setTimeout("startTimeoutProcedure()", 5000);

  try {
    xmlhttp.open("GET", url, "true");
    
    // safari fix
    xmlhttp.setRequestHeader('If-Modified-Since', 'Wed, 15 Nov 1995 00:00:00 GMT');
    
    xmlhttp.send(null);
  }
  catch(e) {
    // Sending occasionally fails.  Restart when this happens
    // try again in 2 seconds
    setTimeout("makeRequest()", 2000);
  }
}

// Takes a responseXML obj of chars and update the random string!
function updateString(xmlDoc, xmlhttp) {
  var characters = xmlDoc.getElementsByTagName("characters");
  var stringEl = document.getElementById("randomString");
  var curString = stringEl.innerHTML;
  var randNum = Math.round((Math.random()*(curString.length-5))); // which characters to update
  
  var childNode, chr, newString;

  if (characters != null && characters.length != 0) {
    characters = characters.item(0);

    for (var i = 0; i < characters.childNodes.length && i < 5; i++) {
      curString = stringEl.innerHTML;
      newString = curString;
      
      childNode = characters.childNodes.item(i);

      // skip non element_nodes
      if (childNode.nodeType != 1) continue;

      if (childNode.nodeName == "char") {
        chr = childNode.childNodes[0].nodeValue;
      }

      // replace the char
      newString = curString.substr(0, randNum);
      
      newString += chr;
      newString += curString.substr(randNum+1);
      randNum++;
      
      // update
      stringEl.innerHTML = newString;
    }
  }

  delete xmlhttp;
}

// every 5 seconds, make another request if no response is recieved
function startTimeoutProcedure() {
  var timeoutCounter = document.getElementById("timeoutCounter").innerHTML.toString();
  document.getElementById("timeoutCounter").innerHTML = ++timeoutCounter;
  makeRequest();
}

// Creates the XMLHttpRequest object and resets any variables
//     needed to restart the application
// Takes a single argument: the callback function (null for no callback)
function createXmlObj(callback) {
  var XMLObj;

  /*@cc_on @*/
  /*@if (@_jscript_version >= 5)
  // JScript gives us Conditional compilation, we can cope with old IE versions.
  // and security blocked creation of the objects.
    try {
      XMLObj = new ActiveXObject("Msxml2.XMLHTTP");
    }
    catch (e) {
      try {
        XMLObj = new ActiveXObject("Microsoft.XMLHTTP");
      }
      catch (E) {
        XMLObj = false;
      }
    }
  @end @*/

  if (!XMLObj && typeof XMLHttpRequest != 'undefined') {
    XMLObj = new XMLHttpRequest();
    XMLObj.overrideMimeType('text/xml');
  }

  if (callback) {
    XMLObj.onreadystatechange = function() {
        // every time there is a change in readyState, reset the time-out timer
        if (timeoutTimer != null) {
          clearTimeout(timeoutTimer);
        }
        timeoutTimer = setTimeout("startTimeoutProcedure()", 5000);

        try {
          if (XMLObj.readyState == 4) {
            // send response to the callback function
            callback(XMLObj.responseXML, XMLObj);

            // make another request in 100 ms (so polling interval is request time + 100ms)
            theTimer = setTimeout("makeRequest()", 100);
          }
        }
        catch(e) {
        }
      }
  }

  return XMLObj;
}
