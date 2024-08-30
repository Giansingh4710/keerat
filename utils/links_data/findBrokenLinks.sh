#!/bin/bash

function print_size {
  bytes=$1
  megabytes=$(echo "scale=2; $bytes / (1024 * 1024)" | bc)
  echo "${megabytes} MB"
  gigabytes=$(echo "scale=2; $bytes / (1024 * 1024 * 1024)" | bc)
  echo "${gigabytes} GB"
}

function join_by {
  local IFS="$1"
  shift
  echo "$*"
}

function getParentOfFile {
  path=$1
  IFS='/' read -ra ADDR <<<"$path"
  len=${#ADDR[@]}
  echo "${ADDR[len - 2]}"
}

function rawurlencode() {
  local url="$1"
  local url="${url#?}" #remove first char
  local url="${url%?}" #remove last char
  echo "$url" | sed 's/ /%20/g; s/"/%22/g; s/(/%28/g; s/)/%29/g; s/{/%7B/g; s/}/%7D/g; s/,/%2C/g'
}

function getBrokenLinks {
  local type=$1
  local path=$2

  while IFS= read -r line; do
    a=$(grep -Eo '"(http|https)://[^"]+"' <<<"$line")
    b=$(grep -Eo "'(http|https)://[^']+'" <<<"$line")
    url=$([ -z "$a" ] && echo "$b" || echo "$a")
    if [ -z "$url" ]; then continue; fi
    trackNum=$((trackNum + 1))

    url=$(rawurlencode "$url")
    # curl_cmd=$(curl -Is "$url")
    curl_cmd=$(curl -Is "$url" | grep -i "Content-Type" | head -n 1 | tr '[:upper:]' '[:lower:]' | tr -d '\r' | xargs)
    if [[ "$curl_cmd" != "content-type: audio/mpeg" ]]; then
      echo "$curl_cmd"
      echo "Failed to fetch: $url"
      echo
      # exit
    fi
  done <"$path"
  echo "Total: $trackNum"
}

prefix="/Users/gians/Desktop/dev/webdev/keerat/app"
tracksJsFiles=()
while IFS= read -r file; do tracksJsFiles+=("$file"); done < <(find "$prefix" -type f -name "TRACKS.js")


opts=( TimeBasedRaagKeertan DarbarSahibPuratanKeertanSGPC AkhandKeertan AllKeertan GianiSherSinghJi Paath MiscellaneousTopics RimmyRadio SantGianiGurbachanSinghJiSGGSKatha BhagatJaswantSinghJi)
opt="AkhandKeertan"

for path in "${tracksJsFiles[@]}"; do
  type=$(getParentOfFile "$path")
  clean_path=$(echo "$path" | sed 's/(/\\(/g; s/)/\\)/g')
  if [ "$opt" != "$type" ]; then continue; fi
  echo "Finding Broken Links: $type"
  getBrokenLinks "$type" "$clean_path"
done
