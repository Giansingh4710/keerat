from azure.storage.blob import BlobServiceClient
import os
import subprocess
import json


def get_json_data_from_file(name):
    data = []
    with open(name, "r") as f:
        for line in f:
            data.append(json.loads(line))
    return data


def save_links_to_file(link, filename):
    subprocess.run(
        [
            "yt-dlp",
            "--flat-playlist",
            "-j",
            link,
        ],
        stdout=open(filename, "w"),
    )


def get_json_data_from_playlist(link, name):
    filename = f"{name}.json"
    already_downloaded = []
    if os.path.exists(filename):
        already_downloaded = get_json_data_from_file(filename)

    save_links_to_file(link, filename)
    all_data = get_json_data_from_file(filename)
    return_obj = {"start_from_idx": len(all_data), "data": all_data}
    if len(already_downloaded) == 0:
        print("First time downloading!!!")
        return return_obj

    idx_where_already_dled = -1
    for i in range(len(all_data)):
        if all_data[i]["id"] == already_downloaded[0]["id"]:
            idx_where_already_dled = i
            break

    if idx_where_already_dled == -1:
        raise Exception(f"Not Same Files {name}")

    return_obj["data"] = all_data[:idx_where_already_dled]
    return return_obj


def remove_bad_url_char(string):
    bad_chars = ["\n", "&", "?", "#", ":", "/", "\\", "|", "*", "<", ">"]
    for i in bad_chars:
        string = string.replace(i, "")

    string = string.strip().replace("  ", " ").replace("  ", " ")
    return string


def download_videos(obj, dir_name, sign=""):
    if not os.path.exists(dir_name):
        os.mkdir(dir_name)
    os.chdir(dir_name)


    title_num = obj["start_from_idx"]
    yt_lst = obj["data"]
    print(f"Downloading {len(yt_lst)} videos")
    for i in range(len(yt_lst)):
        vid = yt_lst[i]
        title = f"{str(title_num).zfill(3)} {remove_bad_url_char(vid['title'])}"
        title_num -= 1
        if sign != "":
            title = f"{title} ({sign})"
        print(f"Downloading {i+1}/{len(yt_lst)}: {title}")
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


def upload_to_azure(prefix, dir):
    f = open("../../../../azure/env.py", "r")
    CONNECTION_STRING = f.read().split()[-1][1:-1]

    connection_string = CONNECTION_STRING
    container_name = "ds1"
    blob_service_client = BlobServiceClient.from_connection_string(connection_string)
    container_client = blob_service_client.get_container_client(container_name)

    for i in os.listdir(dir):
        if i[0] == ".":
            continue
        blob_name = prefix + i
        blob_client = container_client.get_blob_client(blob_name)
        print(f"Uploading '{i}'")
        with open(os.path.join(dir, i), "rb") as data:
            blob_client.upload_blob(data, overwrite=True)

        blob_props = blob_client.get_blob_properties()
        blob_props.content_settings.content_type = "audio/mpeg"
        blob_client.set_http_headers(blob_props.content_settings)


def print_links(prefix, dir_name):
    print("\nLinks:\n")
    link_pref = "https://daasstorage13.blob.core.windows.net/ds1/" + prefix
    for file in sorted(os.listdir(dir_name)):
        if file[0] == ".":
            continue
        print(f"'{link_pref}{file}',")


def main(key):
    playlist = playlists[key]

    link = playlist["link"]
    dir_name = playlist["dir_name"]
    prefix = playlist["prefix"]
    sign = playlist["sign"]

    dl_obj = get_json_data_from_playlist(link, key)

    if len(dl_obj['data']) == 0:
        print(f"No new videos to download for {key}")
        return
    download_videos(dl_obj, dir_name, sign)

    upload_to_azure(prefix, dir_name)
    print_links(prefix, dir_name)


# no filtering needed for the links/channels below
playlists = {
    "lalli": {
        "link": "https://www.youtube.com/playlist?list=PL34jslVRIs1ffryd-uXG3CCk5oVew1bW2",  # 166/154 files
        "dir_name": "lalli_SDO",
        "prefix": "audios/keertan/sdo/yt_lalli_pl/",
        "sign": "",
    },
    "gas_kirtansewa": {
        "link": "https://www.youtube.com/playlist?list=PLJbQ7fetm0gpBOB1nWpqQeiYdfGy9HQu_",
        "dir_name": "Giani_Amolak_Singh_Kirtansewa",
        "prefix": "audios/keertan/giani_amolak_singh/yt_kirtanSewa/",
        "sign": "kirtanSewa",
    },
    "sdo_kirtansewa": {
        "link": "https://www.youtube.com/playlist?list=PLJbQ7fetm0gqfGken8dUkHPTP5BIQpqNb",
        "dir_name": "SDO_Kirtansewa",
        "prefix": "audios/keertan/sdo/yt_kirtanSewa/",
        "sign": "kirtanSewa",
    },
    "heeraRatan": {
        "link": "https://www.youtube.com/@heerarattan5973/videos",
        "dir_name": "HeeraRatan",
        "prefix": "audios/keertan/sdo/yt_heeraRattan/",
        "sign": "heeraRattan",
    },
    "karKeertan": {
        "link": "https://www.youtube.com/playlist?list=PLnHYMNVRCwh51tSOUjJf5ToO7POmGJtZ9",
        "dir_name": "karKeertan",
        "prefix": "audios/keertan/sdo/yt_karKeertan/",
        "sign": "karKeertan",
    },
}

# key = "karKeertan"
key = "heeraRatan"
main(key)
