import sys,os
import json
import subprocess


def get_json_data(file):
    data = []
    with open(file, "r") as f:
        for line in f:
            data.append(json.loads(line))
    return data


def download_videos(yt_lst):
    yt_lst = yt_lst[::-1]
    for i in range(len(yt_lst)):
        vid = yt_lst[i]
        subprocess.run(
            [
                "yt-dlp",
                "--extract-audio",
                "--audio-format",
                "mp3",
                "-o",
                f"{str(i+1).zfill(3)} %(title)s (heeraRattan).%(ext)s",
                vid["url"],
            ]
        )


def compare_and_download_videos(new_lst, old_lst):
    # new_lst should be the latest/longer list
    os.chdir("./vids")
    new_lst = new_lst[::-1]
    for i in range(len(new_lst)):
        vid = new_lst[i]
        if i < len(old_lst):
            continue
        subprocess.run(
            [
                "yt-dlp",
                "--extract-audio",
                "--audio-format",
                "mp3",
                "-o",
                f"{str(i+1).zfill(3)} %(title)s (heeraRattan).%(ext)s",
                vid["url"],
            ]
        )
    os.chdir("..")



new = get_json_data(sys.argv[1])
old = get_json_data(sys.argv[2])

compare_and_download_videos(new, [])

# download_videos(new)
