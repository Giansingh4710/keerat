import sys
import os
import json
import subprocess
from azure.storage.blob import BlobServiceClient


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


def compare_and_download_videos(new_lst, old_lst):
    # new_lst should be the latest/longer list
    if not os.path.exists("./vids"):
        os.mkdir("./vids")
    os.chdir("./vids")
    new_lst = new_lst[::-1]
    for i in range(len(new_lst)):
        vid = new_lst[i]
        if i < len(old_lst):
            continue
        title = vid["title"]
        print(title)
        if title.lower() == "Bhai Mohinder Singh Ji SDO".lower():
            title = vid["description"]
        subprocess.run(
            [
                "yt-dlp",
                "--extract-audio",
                "--audio-format",
                "mp3",
                "-o",
                f"{str(i+1).zfill(3)} {title} (heeraRattan).%(ext)s",
                vid["url"],
            ]
        )
        remove_bad_url_char(str(i+1).zfill(3))
    os.chdir("..")


def upload_to_azure():
    f = open("../../../../azure/env.py", "r")
    CONNECTION_STRING = f.read().split()[-1][1:-1]

    connection_string = CONNECTION_STRING
    container_name = "ds1"
    blob_service_client = BlobServiceClient.from_connection_string(connection_string)
    container_client = blob_service_client.get_container_client(container_name)

    os.chdir("./vids")
    prefix = "audios/keertan/sdo/yt_heeraRattan/"
    for i in os.listdir():
        if i[0] == ".": continue
        blob_name = prefix+i
        blob_client = container_client.get_blob_client(blob_name)
        print(f"Uploading '{i}'")
        with open(i, "rb") as data:
            blob_client.upload_blob(data, overwrite=True)
    os.chdir("..")

def print_link():
    os.chdir("./vids")
    print("Links:\n\n")
    for i in os.listdir():
        if i[0] == ".": continue
        link = 'https://daasstorage13.blob.core.windows.net/ds1/audios/keertan/sdo/yt_heeraRattan/' + i
        print(link)
    os.chdir("..")


new = get_json_data(sys.argv[1])
old = get_json_data(sys.argv[2])
compare_and_download_videos(new, old)
upload_to_azure()
print_link()
