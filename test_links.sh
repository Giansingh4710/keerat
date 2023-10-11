#!/bin/bash

files=(
	"./Keertan/AkhandKeertan/TRACKS.js"
	"./Keertan/TimeBasedKeertan(RaagKeertan)/TRACKS.js"
	"./Keertan/DarbarSahibPuratanKeertanSGPC/TRACKS.js"
	"./Keertan/AllKeertan/TRACKS.js"
	"./GianiSherSinghJi/TRACKS.js"
	"./Paath/TRACKS.js"
	"./MiscellaneousTopics/TRACKS.js"
	"./SantGianiGurbachanSinghJiSGGSKatha/TRACKS.js"
	"./BhagatJaswantSinghJi/TRACKS.js"
)

for file in "${files[@]}"; do
	while IFS= read -r line; do
		a=$(grep -Eo '"(http|https)://[^"]+"' <<<"$line")
		b=$(grep -Eo "'(http|https)://[^']+'" <<<"$line")
		url=$([ -z "$a" ] && echo "$b" || echo "$a")
    if [[ "$url" != *daas* ]]; then
      continue
    fi
    if [ -z "$url" ]; then
      continue
    fi
    url="${url#?}" #remove first char
    url="${url%?}" #remove last char
	  url="${url// /%20}"
		content_type=$(curl -Is "$url" | grep -i '^Content-Type:' | awk -F' ' '{print $2}')
		if [[ "$content_type" == *audio* ]]; then
			echo "Good: $url"
		else
			echo "Bad: $url"
		fi
	done <"$file"
done
