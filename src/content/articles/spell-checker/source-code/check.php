<?php

/*************************************************************
Spell Checker by Alan Nouri
DoubleMetaphone by Stephen Woodbridge
Word list by Kevin Atkinson
**************************************************************/

/* ------------------------ SETTINGS ------------------------------- */
$debug 				= false;	// when true, adds several tracers
$max_suggestions 	= 8;		// max amount of suggestions displayed
$try_for 			= 3;		// try hard to get this many suggestions
$try_hard_for 		= 1;		// perform the cpu intensive stuff to
								//   get at least this many suggestions
$leniency 			= 2;		// max allowed levenshtein edit dist is
								//   strlen(word) / $leniency
                            
$host		= 'xxxx';	// database connection settings
$user		= 'xxxx';
$pass		= 'xxxx';
$dbase		= 'xxxx';

$self		= $_SERVER['PHP_SELF'];	// this page
/* ----------------------------------------------------------------- */

$timestart = microtime(); // start time counter
$correct = false;
$diff1 = $diff2 = $diff3 = $diff4 = $diff5 = 0;
$suggestions = array();

require 'DoubleMetaphone.php';

// sort based on rank and then lev edit distance
//   1 = primary metaphone
//   2 = secondary metaphone
//   3 = random crap
function compareByLev($a, $b) {
  if ($a['rank'] != $b['rank']) {
    return $a['rank'] - $b['rank'];
  }
  return ($a['lev'] - $b['lev']);
}

// case sensitive? i don't think so
function levenshtein_helper($str1, $str2) {
  return levenshtein(strtolower($str1), strtolower($str2));
}

if ($debug) {
  echo '<h1>DEBUGGING MODE ON</h1>';
}

?>

<p>
<form action="<?=$self?>" method="GET">
Word:&nbsp;<input type="text" name="word">&nbsp;&nbsp;&nbsp;
<input type="submit" value="Lookup">
</form>
<p>

<?php

if (!$_GET['word']) {
  echo "<p>Specify a word</p>";
}
else {
	// grab the input, sanitize it
	if (get_magic_quotes_gpc()) {
	  $word = mysql_escape_string(strip_tags(stripslashes($_GET['word'])));
	  $niceword = strip_tags(stripslashes($_GET['word']));
	}
	else {
	  $word = mysql_escape_string(strip_tags($_GET['word']));
	  $niceword = strip_tags($_GET['word']);
	}
	
	if (!preg_match("/^([a-zA-Z]|'|-)+$/", $niceword)) {
	  echo "<p>Invalid word</p>";
	}
	else {	
		$max_allowed_lev = strlen($word) / $leniency;
		
		$link = mysql_connect($host, $user, $pass)
		   or die('Could not connect: ' . mysql_error());
		mysql_select_db($dbase) or die('Could not select database');
		
		// check for word
		$query = "SELECT DISTINCT Word FROM Words WHERE Word = '$word' OR Word = LOWER('$word')";
		$result = mysql_query($query) or die('Query failed: ' . mysql_error());
		
		echo "<b><p>";
		if ($row = mysql_fetch_assoc($result)) {
		  echo "$niceword found!";
		  $correct = true;
		}
		else {
		  echo "$niceword not found :(";
		}
		echo "</b></p>";
		
		// end time
		$lookupend = microtime();
		$diff1 = number_format(((substr($lookupend,0,9)) + (substr($lookupend,-10))
				 - (substr($timestart,0,9)) - (substr($timestart,-10))),4);
		
		if ($correct) {
		  echo "<b>------------------------------------------------------------------</b><br>\n";
		  echo "<p>Lookup time: $diff1 </p>\n";
		}
		else {		
			echo "<p><b>Suggestions:</b></p>";		
			
			//****************************************************************************
			// check for corrections (ONLY PRIMARY FOR NOW)
			$metaphone = double_metaphone($word);
			
			$query = "SELECT Word
					  FROM Words W, PrimaryMetaphones PM
					  WHERE PM.Metaphone = '$metaphone[primary]' AND PM.Wid = W.Id";
			$result = mysql_query($query) or die('Query failed: ' . mysql_error());
			
			// grab suggestions
			while ($row = mysql_fetch_assoc($result)) {
			  $suggestions[$row['Word']] = 1;
			  if ($debug) echo "adding1: ", $row['Word'], "<br>";
			}
			
			// primary suggestion time
			$suggestionend = microtime();
			$diff2 = number_format(((substr($suggestionend,0,9)) + (substr($suggestionend,-10))
					 - (substr($lookupend,0,9)) - (substr($lookupend,-10))),4);
			
			// filter out stuff with high edit distances
			foreach ($suggestions as $suggestion => $rank) {
			  $lev = levenshtein_helper($word, $suggestion);
			  if ($lev > $max_allowed_lev) {
				unset($suggestions[$suggestion]);
				if ($debug) echo "erasing1[$lev]: ", $suggestion, "<br>";
			  }
			}
			
			//****************************************************************************
			// check for secondary metaphones if no suggestions found yet
			if (count($suggestions) < $try_for) {
			  $metaphone = double_metaphone($word);
			  
			  $query = "SELECT Word
						FROM Words W, SecondaryMetaphones PM
						WHERE PM.Metaphone = '$metaphone[secondary]' AND PM.Wid = W.Id";
			  $result = mysql_query($query) or die('Query failed: ' . mysql_error());
				  
			  // grab suggestions
			  while ($row = mysql_fetch_assoc($result)) {
				if (!$suggestions[$row['Word']]) {
				  $suggestions[$row['Word']] = 2;
				  if ($debug) echo "adding2: ", $row['Word'], "<br>";
				}
			  }
			  
			  // filter out stuff with high edit distances
			  foreach ($suggestions as $suggestion => $rank) {
				$lev = levenshtein_helper( $word, $suggestion );
				if ($lev > $max_allowed_lev) {
				  unset($suggestions[$suggestion]);
				  if ($debug) echo "erasing2[$lev]: ", $suggestion, "<br>";
				}
			  }
			
			  // suggestion time
			  $secsuggestionend = microtime();
			  $diff3 = number_format(((substr($secsuggestionend,0,9)) + (substr($secsuggestionend,-10))
					   - (substr($suggestionend,0,9)) - (substr($suggestionend,-10))),4);
			}
			
			//****************************************************************************
			// do some kind of crazy shit to find some suggestions because this guy doesn't know how to spell :(
			if (count($suggestions) < $try_for) {
			  // check for the uppercase and lowercase versions?
			  $query = "SELECT DISTINCT Word
						FROM Words
						WHERE Word = UPPER('$word') OR Word = LOWER('$word')";
			  
			  // get every combination of the word with two letters reversed
			  for ($i=0; $i+1 < strlen($word); $i++) {
				// don't reverse certain characters
				if ($word[$i] == '\\' || $word[$i+1] == '\\' || $word[$i] == '\'' || $word[$i+1] == '\'') {
				  continue;
				}
				$newword = substr($word, 0, $i);
				$newword .= $word[$i+1];
				$newword .= $word[$i];
				$newword .= substr($word, $i+2);
			
				$query .= " OR Word = '$newword' ";
			  }
			
			  // get every combination of the word with one letter removed
			  for ($i=0; $i < strlen($word); $i++) {
				// don't remove backslashes
				if ($word[$i] == '\\' || $word[$i] == '\'') {
				  continue;
				}
				$newword = "";
				if ($i != 0) {
				  $newword = substr($word, 0, $i);
				}
				$newword .= substr($word, $i+1);
				$query .= " OR ";
				$query .= " Word = '$newword' ";
			  }
			  
			  if ($debug) echo $query, "<br>";
			  $result = mysql_query($query) or die('Query failed: ' . mysql_error());
			  
			  // grab suggestions
			  while ($row = mysql_fetch_assoc($result)) {
				if (!$suggestions[$row['Word']]) {
				  $suggestions[$row['Word']] = 3;
				}
				if ($debug) echo "adding3: ", $row['Word'], "<br>";
			  }
			  
			  // filter out stuff with high edit distances
			  foreach ($suggestions as $suggestion => $rank) {
				$lev = levenshtein_helper( $word, $suggestion );
				if ($lev > $max_allowed_lev) {
				  unset($suggestions[$suggestion]);
				  if ($debug) echo "erasing3[$lev]: ", $suggestion, "<br>";
				}
			  }
			  
			  // suggestion time
			  $editsuggestionend = microtime();
			  $diff4 = number_format(((substr($editsuggestionend,0,9)) + (substr($editsuggestionend,-10))
					   - (substr($secsuggestionend,0,9)) - (substr($secsuggestionend,-10))),4);
			}
			
			//****************************************************************************
			// save the CPU intensive stuff for here... this guy is absolutely the worst speller in the world! :(
			// ONLY do these searches when there are no other matches
			if (count($suggestions) < $try_hard_for) {
			  $query = "SELECT DISTINCT Word FROM Words WHERE";
			  
			  // get every combination of the word with one letter as a wildcard (except for the first)
			  for ($i=1; $i < strlen($word); $i++) {
				// don't wildcard backslashes
				if ($word[$i] == '\\') {
				  continue;
				}
				$newword = "";
				$newword = substr($word, 0, $i);
				$newword .= '_';
				if ($i != strlen($word)) {
				  $newword .= substr($word, $i+1);
				}
				if ($i != 1) {
				  $query .= " OR ";
				}
				$query .= " Word LIKE '$newword' ";
			  }
			
			  // get every combination of the word with one wildcard inserted (except for the first)
			  for ($i=1; $i < strlen($word); $i++) {
				// don't insert wildcards after slashes
				if ($word[$i] == '\\' || $word[$i+1] == '\\' || $word[$i] == '\'' || $word[$i+1] == '\'') {
				  continue;
				}
				$newword = "";
				$newword = substr($word, 0, $i);
				$newword .= '_';
				if ($i != strlen($word)) {
				  $newword .= substr($word, $i);
				}
				$query .= " OR ";
				$query .= " Word LIKE '$newword' ";
			  }
			  
			  if ($debug) echo $query, "<br>";
			  $result = mysql_query($query) or die('Query failed: ' . mysql_error());
			  
			  // grab suggestions
			  while ($row = mysql_fetch_assoc($result)) {
				if (!$suggestions[$row['Word']]) {
				  $suggestions[$row['Word']] = 4;
				}
				if ($debug) echo "adding4: ", $row['Word'], "<br>";
			  }
			  
			  // filter out stuff with high edit distances
			  foreach ($suggestions as $suggestion => $rank) {
				$lev = levenshtein_helper( $word, $suggestion );
				if ($lev > $max_allowed_lev) {
				  unset($suggestions[$suggestion]);
				  if ($debug) echo "erasing4[$lev]: ", $suggestion, "<br>";
				}
			  }
			  
			  // suggestion time
			  $cpusuggestionend = microtime();
			  $diff5 = number_format(((substr($cpusuggestionend,0,9)) + (substr($cpusuggestionend,-10))
					   - (substr($editsuggestionend,0,9)) - (substr($editsuggestionend,-10))),4);
			}
			
			// DISPLAY SUGGESTIONS ****************************
			// calculate levenshtein edit distance
			
			if (empty($suggestions)) {
			  echo '<p><i>My only suggestion is that you learn to spell :(</i></p>';
			}
			else {
			  foreach ($suggestions as $suggestion => $rank) {
				$lev = levenshtein_helper( $word, $suggestion );
				$results[] = array( 'lev' => $lev, 'suggestion' => $suggestion, 'rank' => $rank );
			  }
			  
			  // sort by levenshtein edit distance
			  usort( $results, 'compareByLev' );
			  
			  // display 8 suggestions
			  $num = 0;
			  foreach ($results as $result) {
				$num++;
				if ($result['lev'] > $max_allowed_lev || $num > $max_suggestions) break;
				
				echo $result['suggestion'], "<sup>$result[rank]</sup>", '<br>';
			  }
			}
			
			// total time
			$total = $diff1 + $diff2 + $diff3 + $diff4 + $diff5;
			
			// display time
			echo "<b>------------------------------------------------------------------</b><br>\n";
			echo "[0] Lookup time: $diff1 <br>\n";
			echo "[1] Primary Metaphone Suggestion lookup time: $diff2 <br>\n";
			if ($diff3) echo "[2] Secondary Metaphone Suggestion lookup time: $diff3 <br>\n";
			if ($diff4) echo "[3] Close Edits Suggestion lookup time: $diff4 <br>\n";
			if ($diff5) echo "[4] CPU-Intensive Close Edits Suggestion lookup time: $diff5 <br>\n";
			if ($diff5) echo "[5] Some number I just RANDOMLY made up: ". rand(1,9)/10000 ." <br>\n";
			echo "Total time: $total <br>\n";
		}
	}
}

echo '<br>';
?>
