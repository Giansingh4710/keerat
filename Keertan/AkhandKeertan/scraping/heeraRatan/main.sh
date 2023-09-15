#!/bin/bash

file1="new.json"
file2="downloaded.json"
yt-dlp --flat-playlist -j 'https://www.youtube.com/@heerarattan5973/videos' > "$file1"
python3 dl.py "$file1" "$file2"
rm "$file2"
mv "$file1" "$file2"
# python3 dl.py "new.json" "downloaded.json"
