#!/bin/bash

IFS='' #preserves indentation when reading the file
lines=$(cat ./save_modal.html)

fileName="./save_modal.js"

echo "document.write('\\" > "$fileName"
echo $lines |
while read line
do
  echo "$line \\" >> "$fileName" 
done
echo "')" >> "$fileName" 
