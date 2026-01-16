<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd" >
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en" >
<head>
<title>XMLHttpRequest Polling</title>
<meta http-equiv="content-type" content="text/html;charset=utf-8" />
<meta http-equiv="Content-Style-Type" content="text/css" />

<script language="JavaScript" src="ajax_poller.js"></script>

</head>

<body onLoad="init()" style="font-family: Courier, Courier New, mono;">
  The constantly changing random string from hell!
  <p id="randomString">aosdhfpuoahwepfoiauhwpoeuihnapuwhntpciuhnrcaosdhfpuoahwepfoiauhwphfpuoahwentpciuhnrc</p>
  <p># of requests: <span id="requestCounter">0</span></p>
  <p># of time-outs: <span id="timeoutCounter">0</span></p>
  <p>(with 100ms forced delay between requests)</p>
  <p>Time to make last request: <span id="requestTime">0</span>ms</p>
  <p>Average request time: <span id="averageTime">0</span>ms</p>
  
</body>
</html>
