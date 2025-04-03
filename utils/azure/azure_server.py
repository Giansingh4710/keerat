from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient
import os
from env import CONNECTION_STRING
from urllib.parse import unquote

connection_string = CONNECTION_STRING
container_name = "ds1"
blob_service_client = BlobServiceClient.from_connection_string(connection_string)
# blob_service_client = get_blob_service_client_token_credential()
container_client = blob_service_client.get_container_client(container_name)


def delete_folder(folder_path, depth=0):
    blobs = container_client.walk_blobs(name_starts_with=folder_path)
    for blob in blobs:
        name = blob.name
        print("  " * depth, name)
        if "/" == name[-1]:
            delete_folder(name, depth + 1)
        else:
            container_client.delete_blob(blob.name)
            print(f"Deleted {blob.name}")


def rename_file(current_name, new_name):
    source_blob_client = container_client.get_blob_client(current_name)

    destination_blob_client = container_client.get_blob_client(new_name)
    destination_blob_client.start_copy_from_url(source_blob_client.url)

    container_client.delete_blob(current_name)


def rename_folder(old_folder_path, new_folder_path):
    blobs_to_rename = container_client.walk_blobs(name_starts_with=old_folder_path)
    for blob in blobs_to_rename:
        name = blob.name
        if "/" == name[-1]:
            new_name = name.replace(old_folder_path, new_folder_path)
            rename_folder(name, new_name)
        else:
            new_name = name.replace(old_folder_path, new_folder_path)
            rename_file(name, new_name)
            print(f"Renamed '{name}' to '{new_name}'.")

    print(f"Renamed '{old_folder_path}' to '{new_folder_path}'.")


def get_size_of_folder(folder_path, depth=0, total_bytes=0):
    blobs = container_client.walk_blobs(name_starts_with=folder_path)
    for blob in blobs:
        name = blob.name
        if "/" == name[-1]:
            total_bytes += get_size_of_folder(name, depth + 1)
        else:
            blob_client = container_client.get_blob_client(name)
            # blob_url = blob_client.url
            blob_properties = blob_client.get_blob_properties()
            blob_size_in_bytes = blob_properties["size"]
            total_bytes += blob_size_in_bytes
    mbs = total_bytes / (1024 * 1024)
    gb = mbs / 1024
    print(f"Total size of '{folder_path}' is {gb} GB")
    return total_bytes


def download_folder(folder_path, whereToDl=".", depth=0):
    blobs = container_client.walk_blobs(name_starts_with=folder_path)
    whereToDl += "/" + folder_path.split("/")[-2]
    for blob in blobs:
        name = blob.name

        if "/" == name[-1]:
            download_folder(name, whereToDl, depth + 1)
            continue

        blob_client = container_client.get_blob_client(name)
        blob_url = blob_client.url

        os.makedirs(whereToDl, exist_ok=True)
        download_file_path = f"{whereToDl}/{name.split('/')[-1]}"

        with open(download_file_path, "wb") as file:
            blob_data = blob_client.download_blob()
            file.write(blob_data.readall())
        print(f"Downloaded: {blob_url} to {download_file_path}")


def upload_folder(local_folder_path, parent_folder_name):
    already_uploaded = []

    for root, dirs, files in os.walk(local_folder_path):
        blob_folder = root.replace(local_folder_path, parent_folder_name)
        for file in files:
            blob_name = os.path.join(blob_folder, file)
            try:
                local_file_path = os.path.join(root, file)
                if blob_name in already_uploaded:
                    print(f"Skipping '{blob_name}'")
                    continue
                blob_client = container_client.get_blob_client(blob_name)
                with open(local_file_path, "rb") as data:
                    blob_client.upload_blob(data, overwrite=True)

                print(f"Uploaded '{blob_name}'")
            except Exception as e:
                print(f"Error uploading '{blob_name}': {e}")


def upload_file(local_file_path, blob_name):
    blob_client = container_client.get_blob_client(blob_name)
    with open(local_file_path, "rb") as data:
        blob_client.upload_blob(data, overwrite=True)
    print(f"Uploaded '{blob_name}'")


def read(folder_path, depth=0):
    blobs = container_client.walk_blobs(name_starts_with=folder_path)
    for blob in blobs:
        name = blob.name
        # print("  " * depth, name)
        if "/" == name[-1]:
            read(name, depth + 1)
        else:
            print(name)


def print_links(folder_path):
    print(f"Links in '{folder_path}':\n")
    blobs = container_client.walk_blobs(name_starts_with=folder_path)
    for blob in blobs:
        name = blob.name
        if "/" == name[-1]:
            print_links(name)
        else:
            blob_client = container_client.get_blob_client(name)
            url = unquote(blob_client.url)
            print(f'"{url}",')


def count(folder_path, depth=0):
    blobs = container_client.walk_blobs(name_starts_with=folder_path)
    count = 0
    for blob in blobs:
        name = blob.name
        # print("  " * depth, name)
        if "/" == name[-1]:
            read(name, depth + 1)
        else:
            count = count + 1
    print(count)


def files_map(folder_path, condition, action, depth=0):
    blobs = container_client.walk_blobs(name_starts_with=folder_path)
    for blob in blobs:
        if "/" == blob.name[-1]:
            files_map(blob.name, condition, action, depth + 1)
        else:
            # if "application/octet-stream" != blob.content_settings.content_type:
            if condition(blob):
                action(blob)


def delete_file(blob):
    name = blob.name
    print("Deleting " + name)
    container_client.delete_blob(name)


def the_condition(blob):
    return (
        blob.name.endswith(".mp3")
        or blob.name.endswith(".MP3")
        or blob.name.endswith(".m4a")
        or blob.name.endswith(".M4A")
        or blob.name.endswith(".wav")
    ) and blob.content_settings.content_type != "audio/mpeg"


def make_link_play_in_browser_and_now_download(blob):
    source_blob_client = container_client.get_blob_client(blob)
    blob.content_settings.content_type = "audio/mpeg"
    source_blob_client.set_http_headers(blob.content_settings)
    print("Set content type for " + blob.name)


def the_action(blob):
    make_link_play_in_browser_and_now_download(blob)


def is_webm(blob):
    return blob.name.endswith(".webm")


def random_stuff():
    # folder = "audios/keertan/sdo/aisa_keertan/"
    folder = "audios/keertan/giani_amolak_singh/aisa_keertan/"

    def number_files():
        num = 1
        input(f"Are you sure you want to rename {folder}?")
        blobs_to_rename = container_client.walk_blobs(name_starts_with=folder)
        for blob in blobs_to_rename:
            name = blob.name
            name_lst = name.split("/")

            base_name = str(num).rjust(3, "0") + " " + name_lst[-1]
            new_name = "/".join(name_lst[:-1]) + "/" + base_name
            num += 1
            rename_file(name, new_name)

            print(f"Renamed to {new_name}")

    def a():
        blobs_to_rename = container_client.walk_blobs(name_starts_with=folder)
        for blob in blobs_to_rename:
            name = blob.name
            if (
                "audios/keertan/giani_amolak_singh/aisa_keertan/Asa Di Vaar 1970"
                in name
            ):
                print(name)
                b = "audios/keertan/giani_amolak_singh/aisa_keertan/Asa Di Vaar 1970s.mp3"
                rename_file(name, b)
                print(f"Renamed to {b}")

    # a()


folder = "audios/"  # needs to end with /
# folder = "audios/keertan/dr_pritam_singh_anjaan/"
# folder = "audios/keertan/sdo/yt_kirtanSewa/"
folder = "audios/BhagatJaswantSinghJi/"

# curr = "audios/keertan/timeBased/3)6amto9am/Raag devgandhari - Att Sundar man Mohan piyare - Canada2019.mp3.mp3"
# new = "audios/keertan/timeBased/3)6amto9am/Raag devgandhari - Att Sundar man Mohan piyare - Canada2019.mp3"
# rename_file(curr, new)

# get_size_of_folder(folder)

# files_map(folder, the_condition, the_action)
# files_map(folder, is_webm, delete_file)

# upload_file("/Users/gians/Desktop/dev/webdev/keerat/app/Keertan/AkhandKeertan/scraping/dl_all_links_from_yt_link/HeeraRatan/114 Bhai Mohinder Singh Ji SDO ਬੰਬਈ ਅਤੇ ਪੂਨਾ 1979-1 Bombay (heeraRattan).mp3", "audios/keertan/114 Bhai Mohinder Singh Ji SDO ਬੰਬਈ ਅਤੇ ਪੂਨਾ 1979-1 Bombay (heeraRattan).mp3")
# read(folder)
# print_links(folder)
# delete_folder(folder)  # very DANGAROUS


# upload_folder("/Users/gians/Desktop/audios/1 Bh Sukha S/", folder)
print_links(folder)
