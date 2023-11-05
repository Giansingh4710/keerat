#!/bin/bash

function cleanup {
  print_size "$totalBytes"
  echo "Exited"
}
trap cleanup EXIT

function print_size {
	bytes=$1
	megabytes=$(echo "scale=2; $bytes / (1024 * 1024)" | bc)
  echo
	echo "${megabytes} MB"
	gigabytes=$(echo "scale=2; $bytes / (1024 * 1024 * 1024)" | bc)
	echo "${gigabytes} GB"
}

prefix="./Keertan/AkhandKeertan"
files=$(find "$prefix" -type f -name "TRACKS.js")

for path in $files; do
  echo "Processing: $path"
  clean_path=$(echo "$path" | sed 's/(/\\(/g; s/)/\\)/g')
  totalBytes=0
  while IFS= read -r line; do
    a=$(grep -Eo '"(http|https)://[^"]+"' <<<"$line")
    b=$(grep -Eo "'(http|https)://[^']+'" <<<"$line")
    url=$([ -z "$a" ] && echo "$b" || echo "$a")
    if [ -z "$url" ]; then
      continue
    fi
    url="${url#?}" #remove first char
    url="${url%?}" #remove last char
    url="${url// /%20}"

    curl_cmd=$(curl -Is "$url")
    if [ $? -ne 0 ]; then
      echo "Failed to fetch: $url"
      continue
    fi
    echo "Fetched: $url"

    content_type=$(echo "$curl_cmd" | grep -i '^Content-Type:' | awk -F' ' '{print $2}')
    if [[ "$content_type" == *audio* ]]; then
      bytes=$(echo "$curl_cmd" | grep -i content-length | awk '{print $2}')
      len=${#bytes}
      bytes=${bytes::len-1}
      totalBytes=$((totalBytes + bytes))
    else
      echo "Not an audio file: $url"
    fi
  done <"$clean_path"
  print_size "$totalBytes"
done
