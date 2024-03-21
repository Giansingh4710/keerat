#!/bin/bash

bytes_to_mb() {
	echo "scale=2; $1 / (1000000)" | bc
	# echo "scale=2; $1 / (1024 * 1024)" | bc
}

function print_size {
	local bytes=$1
	local megabytes=$(echo "scale=2; $bytes / (1024 * 1024)" | bc)
	echo
	echo "${megabytes} MB"
	local gigabytes=$(echo "scale=2; $bytes / (1024 * 1024 * 1024)" | bc)
	echo "${gigabytes} GB"
}

add() {
	echo "scale=2; $1 + $2" | bc
}

size_of_lines() {
	csv_file="./AkhandKeertan.csv"
	total_size_mb=0
  start="$1"
  end="$2"

	lineNum=0
	while IFS=, read -r bytes url; do
		lineNum=$((lineNum + 1))
		if [ $lineNum -lt 2 ]; then
			continue
		fi

		if [ $lineNum -lt "$start" ]; then
			continue
		fi

		if [ $lineNum -gt "$end" ]; then
			break
		fi
		the_bytes=$(bytes_to_mb "$bytes")
		total_size_mb=$(add "$total_size_mb" "$the_bytes")
		echo "$lineNum: $the_bytes MB"
	done <"$csv_file"

	echo "Total Size: $total_size_mb MB"
}

total_size(){
	csv_file="./AkhandKeertan.csv"
  totalBytes=0

	lineNum=0
	while IFS=, read -r bytes url; do
    if [[ "$url" == "" ]]; then
      echo "New Line Break"
      break
    fi
		lineNum=$((lineNum + 1))
		if [ $lineNum -lt 2 ]; then
			continue
		fi

    totalBytes=$((totalBytes + bytes))
		echo "$bytes Bytes : $lineNum"
	done <"$csv_file"

  echo "Total Size: $totalBytes Bytes"
  bytes_to_mb "$totalBytes"
  print_size "$totalBytes"
}


get_biggest_file(){
  csv_file="./AkhandKeertan.csv"
  biggest_file=0
  biggest_file_url=""
  lineNum=0
  while IFS=, read -r bytes url; do
    lineNum=$((lineNum + 1))
    if [ $lineNum -lt 2 ]; then
      continue
    fi

    if [[ "$bytes" -gt "$biggest_file" && "${url##*.}" != "wav" ]]; then
      biggest_file=$bytes
      biggest_file_url=$url
    fi
  done <"$csv_file"

  echo "Biggest file: $biggest_file_url"
  echo "Biggest file size: $biggest_file"
  biggest_file_mb=$(bytes_to_mb "$biggest_file")
  echo "Biggest file size in MB: $biggest_file_mb"
}

# size_of_lines "754" "1462"
# get_biggest_file
total_size
