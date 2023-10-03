from azure.storage.blob import BlobServiceClient, BlobPrefix
import os
from env import CONNECTION_STRING

connection_string = CONNECTION_STRING
container_name = "ds1"
blob_service_client = BlobServiceClient.from_connection_string(connection_string)
container_client = blob_service_client.get_container_client(container_name)


def delete_folder(folder_path, depth=0):
    blobs = container_client.walk_blobs(name_starts_with=folder_path)
    for blob in blobs:
        name = blob.name
        print("  " * depth, name)
        if "/" == name[-1]:
            delete_folder(name, depth + 1)
        else:
            continue
            container_client.delete_blob(blob.name)


def rename_folder(old_folder_path, new_folder_path):
    blobs_to_rename = container_client.walk_blobs(name_starts_with=old_folder_path)

    for blob in blobs_to_rename:
        name = blob.name
        if "/" == name[-1]:
            new_name = name.replace(old_folder_path, new_folder_path)
            rename_folder(name, new_name)
        else:
            new_name = name.replace(old_folder_path, new_folder_path)
            source_blob_client = container_client.get_blob_client(name)
            destination_blob_client = container_client.get_blob_client(new_name)
            destination_blob_client.start_copy_from_url(source_blob_client.url)
            container_client.delete_blob(name)
            print(f"Renamed '{name}' to '{new_name}'.")

    print(f"Renamed '{old_folder_path}' to '{new_folder_path}'.")


def upload_blob(local_folder_path, parent_folder_name):
    for root, dirs, files in os.walk(local_folder_path):
        for file in files:
            blob_folder = root.replace(local_folder_path, parent_folder_name)
            local_file_path = os.path.join(root, file)
            blob_name = os.path.join(blob_folder, file)
            blob_client = container_client.get_blob_client(blob_name)
            with open(local_file_path, "rb") as data:
                blob_client.upload_blob(data, overwrite=True)
            print(f"Uploaded '{blob_name}'")



folder = "audios/"  # needs to end with /
# upload_blob("../Keertan/", "Keertan2/")
# rename_folder(folder, "audios2/")
# delete_folder(folder)