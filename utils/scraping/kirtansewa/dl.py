import os
import json
import subprocess
import sys
from azure.storage.blob import BlobServiceClient

f = open("../../../../azure/env.py", "r")
CONNECTION_STRING = f.read().split()[-1][1:-1]

connection_string = CONNECTION_STRING
container_name = "ds1"
blob_service_client = BlobServiceClient.from_connection_string(connection_string)
container_client = blob_service_client.get_container_client(container_name)


def get_json_data(file):
    data = []
    try:
        with open(file, "r") as f:
            for line in f:
                data.append(json.loads(line))
    except FileNotFoundError:
        print(f"File not found. {file}")
    return data


def filter_data(data):
    sdo = []
    gas = []
    for i in data:
        title = i["title"].lower()
        if "sdo" in title:
            sdo.append(i)
        elif "giani amolak" in title:
            gas.append(i)
    return {"sdo": sdo, "gas": gas}


def remove_bad_url_char(start_str):
    file_name = ""
    for i in os.listdir():
        if i.startswith(start_str):
            file_name = i
            break

    bad_chars = ["&", "?", "#", ":", "/", "\\", "|", "*", "<", ">"]
    new_file_name = file_name
    for i in bad_chars:
        new_file_name = new_file_name.replace(i, "")

    if file_name != new_file_name:
        os.rename(file_name, new_file_name)


def compare_and_download_videos(title, new_lst, old_lst):
    if not os.path.exists(title):
        os.mkdir(title)
    os.chdir(title)

    new_lst = new_lst[::-1]
    for i in range(len(new_lst)):
        vid = new_lst[i]
        if i < len(old_lst):
            continue

        # title = vid["title"].lower()
        subprocess.run(
            [
                "yt-dlp",
                "--extract-audio",
                "--audio-format",
                "mp3",
                "-o",
                f"{str(i+1).zfill(3)} %(title)s (kirtanSewa).%(ext)s",
                vid["url"],
            ]
        )
        remove_bad_url_char(str(i + 1).zfill(3))
    os.chdir("..")


def upload_to_azure(prefix, dir):
    os.chdir(dir)
    for i in os.listdir():
        if i[0] == ".":
            continue
        blob_name = prefix + i
        blob_client = container_client.get_blob_client(blob_name)
        print(f"Uploading '{i}'")
        with open(i, "rb") as data:
            blob_client.upload_blob(data, overwrite=True)
    os.chdir("..")


def print_link(dir, prefix):
    os.chdir(dir)
    print("Links:\n\n")
    for i in os.listdir():
        if i[0] == ".":
            continue
        link = "https://daasstorage13.blob.core.windows.net/ds1/" + prefix + i
        print(link)
    print("\n")
    os.chdir("..")


new = filter_data(get_json_data(sys.argv[1]))
old = filter_data(get_json_data(sys.argv[2]))

sdo = "SDO"
gas = "Giani Amolak Singh"
compare_and_download_videos(sdo, new["sdo"], old["sdo"])
compare_and_download_videos(gas, new["gas"], old["gas"])

# upload_to_azure("audios/keertan/sdo/yt_kirtanSewa/", sdo)
print_link(sdo, "audios/keertan/sdo/yt_kirtanSewa/")

# upload_to_azure("audios/keertan/giani_amolak_singh/yt_kirtanSewa/", gas)
print_link(gas, "audios/keertan/giani_amolak_singh/yt_kirtanSewa/")

"""
{
    "_type": "url",
    "ie_key": "Youtube",
    "id": "-MoFwJmGGa4",
    "url": "https://www.youtube.com/watch?v=-MoFwJmGGa4",
    "title": "Har Jio Tudh Vito Bal - Bhai Mohinder Singh SDO (Chandigarh - May 1965)",
    "description": "If you have any inquiries, or you have recordings, pictures, or history of ANY kirtani's, please email\nkirtansewacanada@gmail.com\n\nFor rare audio recordings of various Kirtanis, please visit...",
    "duration": 3282.0,
    "channel_id": null,
    "channel": null,
    "channel_url": null,
    "uploader": null,
    "uploader_id": null,
    "uploader_url": null,
    "thumbnails": [
        {
            "url": "https://i.ytimg.com/vi/-MoFwJmGGa4/hqdefault.jpg?sqp=-oaymwE1CKgBEF5IVfKriqkDKAgBFQAAiEIYAXABwAEG8AEB-AH-CYAC0AWKAgwIABABGE0gYyhlMA8=&rs=AOn4CLBRXwMVKVjYzjqjQlyRxUAZweep_w",
            "height": 94,
            "width": 168
        },
        {
            "url": "https://i.ytimg.com/vi/-MoFwJmGGa4/hqdefault.jpg?sqp=-oaymwE1CMQBEG5IVfKriqkDKAgBFQAAiEIYAXABwAEG8AEB-AH-CYAC0AWKAgwIABABGE0gYyhlMA8=&rs=AOn4CLDWbo4xt8aA_3LIv5TSFXCpgmi_uA",
            "height": 110,
            "width": 196
        }, 
        {
            "url": "https://i.ytimg.com/vi/-MoFwJmGGa4/hqdefault.jpg?sqp=-oaymwE2CPYBEIoBSFXyq4qpAygIARUAAIhCGAFwAcABBvABAfgB_gmAAtAFigIMCAAQARhNIGMoZTAP&rs=AOn4CLAI5YVdqgC1ljcEZwxhtam_okIAbg",
            "height": 138,
            "width": 246
        },
        {
            "url": "https://i.ytimg.com/vi/-MoFwJmGGa4/hqdefault.jpg?sqp=-oaymwE2CNACELwBSFXyq4qpAygIARUAAIhCGAFwAcABBvABAfgB_gmAAtAFigIMCAAQARhNIGMoZTAP&rs=AOn4CLDHkQcLWxDIjQbWtcigSMm4XRVfoA",
            "height": 188,
            "width": 336
        }
    ],
    "timestamp": null,
    "release_timestamp": null,
    "availability": null,
    "view_count": 153,
    "live_status": null,
    "channel_is_verified": null,
    "__x_forwarded_for_ip": null,
    "webpage_url": "https://www.youtube.com/watch?v=-MoFwJmGGa4",
    "original_url": "https://www.youtube.com/watch?v=-MoFwJmGGa4",
    "webpage_url_basename": "watch",
    "webpage_url_domain": "youtube.com",
    "extractor": "youtube",
    "extractor_key": "Youtube",
    "playlist_count": 2252,
    "playlist": "Kirtan Sewa Canada - Videos",
    "playlist_id": "UCNPn_8FpWrxYpumk8aEhNVQ",
    "playlist_title": "Kirtan Sewa Canada - Videos",
    "playlist_uploader": "Kirtan Sewa Canada",
    "playlist_uploader_id": "@kirtansewacanada",
    "n_entries": 2252,
    "playlist_index": 1,
    "__last_playlist_index": 2252,
    "playlist_autonumber": 1,
    "epoch": 1697639046,
    "duration_string": "54:42",
    "_version": {
        "version": "2023.07.06",
        "current_git_head": null,
        "release_git_head": "b532a3481046e1eabb6232ee8196fb696c356ff6",
        "repository": "yt-dlp/yt-dlp"
        }
}
"""
