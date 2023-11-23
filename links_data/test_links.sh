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

function join_by {
	local IFS="$1"
	shift
	echo "$*"
}

function getSecondLastPart {
	path=$1
	IFS='/' read -ra ADDR <<<"$path"
	len=${#ADDR[@]}
	echo "${ADDR[len - 2]}"
}

function rawurlencode() {
	echo "$1" | sed 's/ /%20/g; s/"/%22/g; s/(/%28/g; s/)/%29/g; s/{/%7B/g; s/}/%7D/g; s/,/%2C/g'
}

function get_index_for_url() {
	local url_to_find="$1"

	for i in "${!urls_in_csv[@]}"; do
		if [ "${urls_in_csv[$i]}" == "$url_to_find" ]; then
			echo "$i"
			return 0
		fi
	done

	echo "-1"
}


# prefix="../Keertan"
prefix="../Keertan/AkhandKeertan"
files=$(find "$prefix" -type f -name "TRACKS.js")
totalBytes=0

declare -a urls_in_csv
declare -a bytes_in_csv
csv_file="./AkhandKeertan.csv"
while IFS=, read -r bytes url; do
	bytes="${bytes// /}" # Trim leading/trailing whitespaces
	url="${url// /}"
	urls_in_csv+=("$url")
	bytes_in_csv+=("$bytes")
done <"$csv_file"



for path in $files; do
	# echo "Processing: $path"
	type=$(getSecondLastPart "$path")
	clean_path=$(echo "$path" | sed 's/(/\\(/g; s/)/\\)/g')
	echo "Bytes, Url" >>"$type.csv"
	trackNum=0
	while IFS= read -r line; do
		a=$(grep -Eo '"(http|https)://[^"]+"' <<<"$line")
		b=$(grep -Eo "'(http|https)://[^']+'" <<<"$line")
		url=$([ -z "$a" ] && echo "$b" || echo "$a")
		if [ -z "$url" ]; then
			continue
		fi

		trackNum=$((trackNum + 1))
		# if [ $trackNum -lt 568 ]; then
		#   continue
		# fi
		# echo "$trackNum: $url"

		url="${url#?}" #remove first char
		url="${url%?}" #remove last char
		url=$(rawurlencode "$url")
    index=$(get_index_for_url "$url")
    if [ "$index" -ne -1 ]; then
      bytes=${bytes_in_csv[$index]}
      # echo "$bytes, $url"
      totalBytes=$((totalBytes + bytes))
      continue
    fi

		curl_cmd=$(curl -Is "$url")
		if [ $? -ne 0 ]; then
			echo "Failed to fetch: $url"
      exit
		fi

		content_type=$(echo "$curl_cmd" | grep -i '^Content-Type:' | awk -F' ' '{print $2}')
		if [[ "$content_type" == *audio* ]]; then
			bytes=$(echo "$curl_cmd" | grep -i content-length | awk '{print $2}')
			len=${#bytes}
			bytes=${bytes::len-1}
			echo "$bytes, $url" >>"$type.csv"
			totalBytes=$((totalBytes + bytes))
		else
			echo "000, $url" >>"$type.csv"
			echo "Not an audio file: $url"
			exit
		fi
	done <"$clean_path"
	print_size "$totalBytes"
done
