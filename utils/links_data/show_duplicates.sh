#!/bin/bash

# prefix="../Keertan"
prefix="../Keertan/AkhandKeertan"
files=$(find "$prefix" -type f -name "TRACKS.js")

function getSecondLastPart {
	path=$1
	IFS='/' read -ra ADDR <<<"$path"
	len=${#ADDR[@]}
	echo "${ADDR[len - 2]}"
}

all_urls=()
for path in $files; do
	type=$(getSecondLastPart "$path")
  echo "$type"
	clean_path=$(echo "$path" | sed 's/(/\\(/g; s/)/\\)/g')
	trackNum=0
	while IFS= read -r line; do
		a=$(grep -Eo '"(http|https)://[^"]+"' <<<"$line")
		b=$(grep -Eo "'(http|https)://[^']+'" <<<"$line")
		url=$([ -z "$a" ] && echo "$b" || echo "$a")
		if [ -z "$url" ]; then
			continue
		fi

    if [[ "${all_urls[*]}" =~ "${url}" ]]; then
      echo "Duplicate: $url"
      continue
    fi
    all_urls=("${all_urls[@]}" "$url")
		trackNum=$((trackNum + 1))
	done <"$clean_path"
done
