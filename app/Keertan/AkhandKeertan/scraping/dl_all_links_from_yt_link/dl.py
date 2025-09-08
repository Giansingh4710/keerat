import os
import subprocess
import json
import boto3
from botocore.exceptions import ClientError
import mimetypes
# import pyperclip


def get_json_data_from_file(name):
    data = []
    with open(name, "r") as f:
        for line in f:
            data.append(json.loads(line))
    return data


def save_yt_playlist_links_to_file(link, filename):
    subprocess.run(
        [
            "yt-dlp",
            "--flat-playlist",
            "-j",
            link,
        ],
        stdout=open(filename, "w"),
    )

def saveNewDownloadedVids(dl_obj, filename):
    newly_downloaded = dl_obj['data']
    already_downloaded = get_json_data_from_file(filename)
    newData = newly_downloaded + already_downloaded
    with open(filename, "w") as f:
        for i in newData:
            f.write(json.dumps(i) + "\n")
    print(f"Saved {len(newly_downloaded)} new videos to {filename}\n")

def get_json_data_from_playlist(link, filename):
    already_downloaded = []
    if os.path.exists(filename):
        already_downloaded = get_json_data_from_file(filename)

    temp_filename = f"_temp.json"
    save_yt_playlist_links_to_file(link, temp_filename)
    # if youtuber changes playlist like delete vids or change titles, this data will have that
    currentPlaylistLinks = get_json_data_from_file(temp_filename)
    subprocess.run(["rm", temp_filename])

    return_obj = {
        "start_from_num": 1,
        "data": currentPlaylistLinks,
    }

    if len(already_downloaded) == 0:
        print("First time downloading!!!")
        return return_obj

    for i in range(len(currentPlaylistLinks)):
        if currentPlaylistLinks[i]["id"] == already_downloaded[0]["id"]:
            print(i)
            return_obj["start_from_num"] = len(already_downloaded) + 1
            return_obj["data"] = currentPlaylistLinks[:i] # data is in reverse order
            return return_obj

    raise Exception(f"Not Same Files {filename}")


def remove_bad_url_char(string):
    bad_chars = ["\n", "&", "?", "#", ":", "/", "\\", "|", "*", "<", ">"]
    for i in bad_chars:
        string = string.replace(i, "")

    string = string.strip().replace("  ", " ").replace("  ", " ")
    return string


def download_videos(obj, dir_name, sign=""):
    if os.path.exists(dir_name):
        subprocess.run(["mv", dir_name, f"{dir_name}_old"])
    os.mkdir(dir_name)
    os.chdir(dir_name)

    title_num = obj["start_from_num"]
    yt_lst = obj["data"][::-1]
    print(f"Downloading {len(yt_lst)} videos")
    for i in range(len(yt_lst)):
        vid = yt_lst[i]
        title = f"{str(title_num).zfill(3)} {remove_bad_url_char(vid['title'])}"
        title_num += 1
        if sign != "":
            title = f"{title} ({sign})"
        print(f"Downloading {i+1}/{len(yt_lst)}: {title}")

        if os.path.exists(f"{title}.mp3"):
            print(f"File already exists: {title}.mp3")
            continue
        subprocess.run(
            [
                "yt-dlp",
                "--extract-audio",
                "--audio-format",
                "mp3",
                "-o",
                f"{title}.%(ext)s",
                vid["url"],
            ]
        )
    os.chdir("..")


def upload_to_aws(prefix, dir):
    bucket_name = "keerat.xyz"
    s3_client = boto3.client("s3")
    for i in os.listdir(dir):
        if i[0] == ".":
            continue
        s3_key = prefix + i

        try:
            local_file_path = os.path.join(dir, i)
            content_type, _ = mimetypes.guess_type(local_file_path)
            extra_args = {}
            if content_type:
                extra_args["ContentType"] = content_type
                extra_args["ContentDisposition"] = "inline"   # tells browser to play instead of download

            s3_client.upload_file(local_file_path, bucket_name, s3_key,ExtraArgs=extra_args)
            print(f"Uploaded '{s3_key}'")
        except ClientError as e:
            print(f"Error uploading '{s3_key}': {e}")


def print_links_n_copy(prefix, dir_name):
    copyTxt = ""
    link_pref = "https://daasstorage13.blob.core.windows.net/ds1/" + prefix
    for file in sorted(os.listdir(dir_name)):
        if file[0] == ".":
            continue
        copyTxt+=f'"{link_pref}{file}",\n'

    # pyperclip.copy(copyTxt)
    print("\nLinks:\n"+copyTxt)


def main(key):
    playlist = playlists[key]

    link = playlist["link"]
    dir_name = playlist["dir_name"]
    prefix = playlist["prefix"]
    sign = playlist["sign"]

    dl_obj = get_json_data_from_playlist(link, f"{key}.json")
    if len(dl_obj["data"]) == 0:
        print(f"No new videos to download for {key}")
        return

    download_videos(dl_obj, dir_name, sign)

    upload_to_aws(prefix, dir_name)
    saveNewDownloadedVids(dl_obj, f"{key}.json")

    print_links_n_copy(prefix, dir_name)




# no filtering needed for the links/channels below
playlists = {
    # "lalli": {
    #     "link": "https://www.youtube.com/playlist?list=PL34jslVRIs1ffryd-uXG3CCk5oVew1bW2",  # 166/154 files
    #     "dir_name": "lalli_SDO",
    #     "prefix": "audios/keertan/sdo/yt_lalli_pl/",
    #     "sign": "",
    # },
    "gas_kirtansewa": {
        "link": "https://www.youtube.com/playlist?list=PLJbQ7fetm0gpBOB1nWpqQeiYdfGy9HQu_",
        "dir_name": "Giani_Amolak_Singh_Kirtansewa",
        "prefix": "keertan/giani_amolak_singh/yt_kirtanSewa/",
        "sign": "kirtanSewa",
    },
    "sdo_kirtansewa": {
        "link": "https://www.youtube.com/playlist?list=PLJbQ7fetm0gqfGken8dUkHPTP5BIQpqNb",
        "dir_name": "SDO_Kirtansewa",
        "prefix": "keertan/sdo/yt_kirtanSewa/",
        "sign": "kirtanSewa",
    },
    "heeraRatan": {
        "link": "https://www.youtube.com/@heerarattan5973/videos",
        "dir_name": "HeeraRatan",
        "prefix": "keertan/sdo/yt_heeraRattan/",
        "sign": "heeraRattan",
    },
    "karKeertan": {
        "link": "https://www.youtube.com/playlist?list=PLnHYMNVRCwh51tSOUjJf5ToO7POmGJtZ9",
        "dir_name": "karKeertan",
        "prefix": "keertan/sdo/yt_karKeertan/",
        "sign": "karKeertan",
    },
}

# key = "karKeertan"
# key = "heeraRatan"
# key = "sdo_kirtansewa"
keys = list(playlists.keys())
for key in keys:
    main(key)
