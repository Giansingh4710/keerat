<?php
//header("Access-Control-Allow-Origin: *");

ini_set('display_errors', 1);
error_reporting(E_ALL);

//echo "<pre>";
//var_dump($_POST);
//echo "</pre>";

function addToCsvFromPostRequest(){
  $timestamp = "";
  if(!empty($_POST["hours"])){
    $timestamp = str_pad($_POST["hours"], 2, "0", STR_PAD_LEFT);
  }else{
    $timestamp = "00";
  }

  $timestamp .= ":";
  if(!empty($_POST["mins"])){
    $timestamp .= str_pad($_POST["mins"], 2, "0", STR_PAD_LEFT);
  }else{
    $timestamp .= "00";
  }

  $timestamp .= ":";
  if(!empty($_POST["secs"])){
    $timestamp .= str_pad($_POST["secs"], 2, "0", STR_PAD_LEFT);
  }else{
    $timestamp .= "00";
  }

  $line = array(time(), $_POST["keertani"], $_POST["description"], $timestamp, $_POST["link"], $_POST["shabadId"]);

  echo "<pre>";
  var_dump($line);
  echo "</pre>";

  $fp = fopen("data.csv", "a");
  fputcsv($fp, $line); # $line is an array of strings (array|string[])
  fclose($fp);
  echo "The Data has been added to the database";
}

addToCsvFromPostRequest()
//header("Location: http://santjikhata.us");
?>
