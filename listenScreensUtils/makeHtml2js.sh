#!/bin/bash

IFS='' #preserves indentation when reading the file
lines=$(cat ./index.html)

fileName="./htmlBody.js"

echo "document.write('\\" > "$fileName"
echo $lines |
while read line
do
  echo "$line \\" >> "$fileName" 
done
echo "')" >> "$fileName" 
