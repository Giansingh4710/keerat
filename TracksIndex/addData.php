<?php
//header("Access-Control-Allow-Origin: *");

ini_set('display_errors', 1);
error_reporting(E_ALL);

//echo "<pre>";
//var_dump($_POST);
//echo "</pre>";

$timestamp = "";
if(!empty($_POST["hours"])){
  $timestamp .= $_POST["hours"];
  $timestamp .= ":";
}
if(!empty($_POST["mins"])){
  $timestamp .= $_POST["mins"];
  $timestamp .= ":";
}
if(!empty($_POST["secs"])){
  $timestamp .= $_POST["secs"];
}

$timestamp = $timestamp==""?"0:00": $timestamp;
$line = array(time(), $_POST["keertani"], $_POST["description"], $timestamp, $_POST["link"], $_POST["shabadId"]);

echo "<pre>";
var_dump($line);
echo "</pre>";

$fp = fopen("data.csv", "a");
fputcsv($fp, $line); # $line is an array of strings (array|string[])
fclose($fp);
echo "The Data has been added to the database";

?>
