import boto3
import os
from urllib.parse import unquote
from botocore.exceptions import ClientError
import mimetypes

# AWS S3 Configuration
# Make sure to set vars set in ~/.aws/credentials (gotten after making User in IAM. That user will need s3 access permissions)
# [default]
# aws_access_key_id = <YOUR_ACCESS_KEY>
# aws_secret_access_key = <YOUR_SECRET_KEY>

AWS_DEFAULT_REGION="us-east-1"
bucket_name = "keerat.xyz"  # Replace with your S3 bucket name
s3_client = boto3.client("s3")
s3_resource = boto3.resource("s3")
bucket = s3_resource.Bucket(bucket_name)


def delete_folder(folder_path, depth=0):
    """Delete all objects in a folder (prefix) in S3"""
    objects_to_delete = []

    for obj in bucket.objects.filter(Prefix=folder_path):
        print("  " * depth, obj.key)
        objects_to_delete.append({"Key": obj.key})

    if objects_to_delete:
        # Delete objects in batches (S3 allows up to 1000 objects per request)
        for i in range(0, len(objects_to_delete), 1000):
            batch = objects_to_delete[i : i + 1000]
            s3_client.delete_objects(Bucket=bucket_name, Delete={"Objects": batch})
            for obj in batch:
                print(f"Deleted {obj['Key']}")


def rename_file(current_name, new_name):
    """Rename a file in S3 by copying and deleting the original"""
    try:
        # Copy the object
        s3_client.copy_object(
            Bucket=bucket_name,
            CopySource={"Bucket": bucket_name, "Key": current_name},
            Key=new_name,
        )

        # Delete the original
        s3_client.delete_object(Bucket=bucket_name, Key=current_name)
        print(f"Renamed '{current_name}' to '{new_name}'")

    except ClientError as e:
        print(f"Error renaming '{current_name}': {e}")


def rename_folder(old_folder_path, new_folder_path):
    """Rename a folder by renaming all objects with that prefix"""
    objects_to_rename = list(bucket.objects.filter(Prefix=old_folder_path))

    for obj in objects_to_rename:
        old_key = obj.key
        new_key = old_key.replace(old_folder_path, new_folder_path, 1)
        rename_file(old_key, new_key)

    print(f"Renamed folder '{old_folder_path}' to '{new_folder_path}'")


def get_size_of_folder(folder_path, depth=0):
    """Calculate the total size of all objects in a folder"""
    total_bytes = 0

    for obj in bucket.objects.filter(Prefix=folder_path):
        total_bytes += obj.size

    mbs = total_bytes / (1024 * 1024)
    gb = mbs / 1024
    print(f"Total size of '{folder_path}' is {gb:.2f} GB")
    return total_bytes


def download_folder(folder_path, where_to_dl=".", depth=0):
    """Download all objects in a folder to local directory"""
    # Create local directory structure
    folder_name = folder_path.rstrip("/").split("/")[-1]
    local_folder = os.path.join(where_to_dl, folder_name)

    for obj in bucket.objects.filter(Prefix=folder_path):
        # Skip if it's a "folder" (ends with /)
        if obj.key.endswith("/"):
            continue

        # Create local file path
        relative_path = obj.key[len(folder_path) :].lstrip("/")
        local_file_path = os.path.join(local_folder, relative_path)

        # Create directory if it doesn't exist
        os.makedirs(os.path.dirname(local_file_path), exist_ok=True)

        # Download the file
        try:
            s3_client.download_file(bucket_name, obj.key, local_file_path)
            print(f"Downloaded: {obj.key} to {local_file_path}")
        except ClientError as e:
            print(f"Error downloading {obj.key}: {e}")


def upload_folder(local_folder_path):
    """Upload a local folder to S3 with proper ContentType for audio files"""
    for root, dirs, files in os.walk(local_folder_path):
        for file in files:
            local_file_path = os.path.join(root, file)

            s3_key = os.path.relpath(local_file_path, local_folder_path).replace(
                "\\", "/"
            )

            try:
                if s3_key in already_uploaded:
                    print(f"Skipping '{s3_key}'")
                    continue

                # Guess MIME type (e.g., audio/mpeg, audio/wav, etc.)
                content_type, _ = mimetypes.guess_type(local_file_path)
                extra_args = {}

                if content_type:
                    extra_args["ContentType"] = content_type
                    extra_args["ContentDisposition"] = "inline"   # tells browser to play instead of download
                    if content_type.startswith("audio/"):
                        extra_args["ContentDisposition"] = "inline"   # tells browser to play instead of download

                print(
                    f"Uploading '{s3_key}' with ContentType={content_type or 'default'}"
                )

                s3_client.upload_file(
                    local_file_path, bucket_name, s3_key, ExtraArgs=extra_args
                )

            except ClientError as e:
                print(f"Error uploading '{s3_key}': {e}")


def upload_file(local_file_path, s3_key):
    """Upload a single file to S3"""
    try:
        s3_client.upload_file(local_file_path, bucket_name, s3_key)
        print(f"Uploaded '{s3_key}'")
    except ClientError as e:
        print(f"Error uploading '{s3_key}': {e}")


def read(folder_path, depth=0):
    """List all objects in a folder"""
    for obj in bucket.objects.filter(Prefix=folder_path):
        if not obj.key.endswith("/"):
            print(obj.key)


def print_links(folder_path=""):
    """Print URLs for all objects in a folder"""
    print(f"Links in '{folder_path}':\n")

    for obj in bucket.objects.filter(Prefix=folder_path):
        if not obj.key.endswith("/"):
            # url = f"https://{bucket_name}.s3.{AWS_DEFAULT_REGION}.amazonaws.com/{obj.key}"
            url = f"https://s3.{AWS_DEFAULT_REGION}.amazonaws.com/{bucket_name}/{obj.key}"
            print(url)


def print_public_links(folder_path):
    """Print public URLs (only works if bucket/objects are public)"""
    print(f"Public links in '{folder_path}':\n")

    for obj in bucket.objects.filter(Prefix=folder_path):
        if not obj.key.endswith("/"):
            # Public URL format
            region = s3_client.meta.region_name
            url = f"https://{bucket_name}.s3.{region}.amazonaws.com/{obj.key}"
            print(f'"{url}",')


def count(folder_path):
    """Count number of files in a folder"""
    count = 0
    for obj in bucket.objects.filter(Prefix=folder_path):
        if not obj.key.endswith("/"):
            count += 1
    print(count)
    return count


def files_map(folder_path, condition, action, depth=0):
    """Apply an action to files matching a condition"""
    for obj in bucket.objects.filter(Prefix=folder_path):
        if not obj.key.endswith("/"):
            if condition(obj):
                action(obj)


def delete_file(obj):
    """Delete a single file"""
    print("Deleting " + obj.key)
    obj.delete()


def the_condition(obj):
    """Check if object is an audio file with incorrect content type"""
    audio_extensions = [".mp3", ".MP3", ".m4a", ".M4A", ".wav"]

    # Get object metadata
    try:
        response = s3_client.head_object(Bucket=bucket_name, Key=obj.key)
        content_type = response.get("ContentType", "")

        return (
            any(obj.key.endswith(ext) for ext in audio_extensions)
            and content_type != "audio/mpeg"
        )
    except ClientError:
        return False


def make_link_play_in_browser(obj):
    """Update content type for audio files"""
    try:
        # Copy object with new metadata
        s3_client.copy_object(
            Bucket=bucket_name,
            CopySource={"Bucket": bucket_name, "Key": obj.key},
            Key=obj.key,
            ContentType="audio/mpeg",
            MetadataDirective="REPLACE",
        )
        print("Set content type for " + obj.key)
    except ClientError as e:
        print(f"Error updating content type for {obj.key}: {e}")


def the_action(obj):
    """Action to apply to matching files"""
    make_link_play_in_browser(obj)


def is_webm(obj):
    """Check if object is a webm file"""
    return obj.key.endswith(".webm")


# Configuration
folder = "Test"  # S3 "folder" (prefix)
# folder = "audios/keertan/dr_pritam_singh_anjaan/"
# folder = "audios/keertan/sdo/yt_kirtanSewa/"
# folder = "audios/katha/bh_sukha_s/"

already_uploaded = []
print_links()
