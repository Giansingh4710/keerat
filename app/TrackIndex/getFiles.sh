#!/bin/bash

files=$(find .. -type f -name 'TRACKS.js')
num=1
optsLst=""
filesLst=""
for file in $files; do
  if [[ "$file" == '../Keertan/AllKeertan/TRACKS.js' ]]; then
    continue
  fi  
  echo  "import {ALL_OPTS as opt${num}} from '$file'"
  optsLst="${optsLst}opt${num}, "

  cleaned_path="${file/..\///}"
  cleaned_path="${cleaned_path%/*}"
  filesLst="${filesLst}'$cleaned_path', "

  num=$((num+1))
done

echo "


  const theOpts = [ ${optsLst} ]
  const theFiles = [ ${filesLst} ]
"
