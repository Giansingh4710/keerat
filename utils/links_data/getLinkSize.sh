#!/bin/bash

function cleanup {
	print_size "$totalBytes"
	echo "Exited"
}
trap cleanup EXIT

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

# prefix="../Keertan"
prefix="/Users/gians/Desktop/dev/webdev/keerat/app"
tracksJsFiles=()
while IFS= read -r file; do tracksJsFiles+=("$file"); done < <(find "$prefix" -type f -name "TRACKS.js")

totalBytes=0

for path in "${tracksJsFiles[@]}"; do
	type=$(getParentOfFile "$path")
	clean_path=$(echo "$path" | sed 's/(/\\(/g; s/)/\\)/g')

	if [ ! -d 'links_size' ]; then mkdir links_size; fi
	cd links_size || exit
  
	if [ -f "$type.csv" ]; then 
    echo "exists $type.csv"
    cd ..
    continue
  fi

	echo "Bytes, Url" >>"$type.csv"
	trackNum=0

	while IFS= read -r line; do
		a=$(grep -Eo '"(http|https)://[^"]+"' <<<"$line")
		b=$(grep -Eo "'(http|https)://[^']+'" <<<"$line")
		url=$([ -z "$a" ] && echo "$b" || echo "$a")
		if [ -z "$url" ]; then continue; fi
		trackNum=$((trackNum + 1))

		url=$(rawurlencode "$url")
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
			echo "$bytes, $line" >>"$type.csv"
			totalBytes=$((totalBytes + bytes))
		else
			echo "000, $line" >>"$type.csv"
			# if end of file is wma
			if [[ "$url" == *wma ]]; then
				echo "wma file: $url"
			else
				echo "Not an audio file: $line"
				exit
			fi
		fi
	done <"$clean_path"

	echo "Total bytes for $type:"
	print_size "$totalBytes"
	cd ..
done
