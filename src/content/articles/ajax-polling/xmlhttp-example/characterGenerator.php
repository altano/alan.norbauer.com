<?php

// We don't want this page to get cached, so let's throw a bunch of crap at the header
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");  // Date in the past
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");  // always modified
header("Cache-Control: no-store, no-cache, must-revalidate");  // HTTP/1.1
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");  // HTTP/1.0
  
// return an XML document (comment this out if you're not returning XML)
header("Content-type: text/xml");

// Do something every 100 requests
if (isset($_GET['doSomething_a'])) {

}

// Do something else every 99 requests
if (!isset($_GET['doSomething_b'])) {

}

// Generate 5 random characters
echo '<characters>';

for ($count=0; $count < 5; $count++) {
  $chr = chr(!mt_rand(0,2)?mt_rand(48,57):(!mt_rand(0,1)?mt_rand(97,110):mt_rand(111,122)));
  echo "<char>$chr</char>";
}

echo '</characters>';

?>
