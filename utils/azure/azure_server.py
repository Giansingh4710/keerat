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
folder = "audios/katha/bh_sukha_s/"

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


already_uploaded = [
    "audios/katha/bh_sukha_s/applying Gurbani to your life.mp3",
    "audios/katha/bh_sukha_s/Shaheed Baba Deep Singh Jee.mp3",
    "audios/katha/bh_sukha_s/the Purity of Holy Company.mp3",
    "audios/katha/bh_sukha_s/Power of Amrit.mp3",
    "audios/katha/bh_sukha_s/the Plant of Sikhi.mp3",
    "audios/katha/bh_sukha_s/the Height of Spirituality.mp3",
    "audios/katha/bh_sukha_s/Vaheguru Simran.mp3",
    "audios/katha/bh_sukha_s/the Sweetness of Amrit.mp3",
    "audios/katha/bh_sukha_s/the company of a Gurmukh.mp3",
    "audios/katha/bh_sukha_s/Remembering God with Complete Focus.mp3",
    "audios/katha/bh_sukha_s/the Greatness of Sadhsangat.mp3",
    "audios/katha/bh_sukha_s/Losing Yourself.mp3",
    "audios/katha/bh_sukha_s/the effect of the company of Saints.mp3",
    "audios/katha/bh_sukha_s/Making the Most of this Life.mp3",
    "audios/katha/bh_sukha_s/Unity In The Panth - UK.mp3",
    "audios/katha/bh_sukha_s/Writing the Guru_s Word upon your Heart.mp3",
    "audios/katha/bh_sukha_s/UK - Challenges to Gurmat Philosophy.mp3",
    "audios/katha/bh_sukha_s/Vichaar Goshti on Sri Dasam Guru Granth Sahib Ji.mp3",
    "audios/katha/bh_sukha_s/Shaheedi of Guru Tegh Bahadur Sahib Ji.mp3",
    "audios/katha/bh_sukha_s/how to obtain anything from Seva.mp3",
    "audios/katha/bh_sukha_s/Viah Purab of Guru Arjan Dev Ji.mp3",
    "audios/katha/bh_sukha_s/the three types of Anand Karaj.mp3",
    "audios/katha/bh_sukha_s/Emotional 40 Mukte Campfire @ KCA16.mp3",
    "audios/katha/bh_sukha_s/Sampooranta Divas of Sri Guru Granth Sahib Ji.mp3",
    "audios/katha/bh_sukha_s/the power of Guru_s words.mp3",
    "audios/katha/bh_sukha_s/Prakash of Guru Gobind Singh Ji.mp3",
    "audios/katha/bh_sukha_s/Realising God to be Ever Present.m4a",
    "audios/katha/bh_sukha_s/the Gurpurab of Sri Guru Harkirshan Sahib Ji.mp3",
    "audios/katha/bh_sukha_s/.DS_Store",
    "audios/katha/bh_sukha_s/pleasing the Guru.mp3",
    "audios/katha/bh_sukha_s/the Prakash Purab of Guru Gobind Singh Ji.mp3",
    "audios/katha/bh_sukha_s/Jaito da Morcha.mp3",
    "audios/katha/bh_sukha_s/Clearing the Inner Darkness.mp3",
    "audios/katha/bh_sukha_s/True Friendship 2.mp3",
    "audios/katha/bh_sukha_s/the need of a Guru.mp3",
    "audios/katha/bh_sukha_s/Loving Each Other as Sikhs.mp3",
    "audios/katha/bh_sukha_s/Focusing on Only the One.mp3",
    "audios/katha/bh_sukha_s/Prakash Purab of Baba Sri Chand Ji.mp3",
    "audios/katha/bh_sukha_s/Guru Nanak, Bestower of Divine Gifts.mp3",
    "audios/katha/bh_sukha_s/Guru Nanak and a Supplication.mp3",
    "audios/katha/bh_sukha_s/the Prakash Ustav of Guru Hargobind Sahib Ji.mp3",
    "audios/katha/bh_sukha_s/the Karam Philosophy.mp3",
    "audios/katha/bh_sukha_s/Becoming the Slave of Slaves.mp3",
    "audios/katha/bh_sukha_s/the miracle of Sadhsangat.mp3",
    "audios/katha/bh_sukha_s/the True Inner Home.m4a",
    "audios/katha/bh_sukha_s/what we can do about Punjab Situation, SPG Guru Arj, and Masands.mp3",
    "audios/katha/bh_sukha_s/Continuous Remembrance of God.mp3",
    "audios/katha/bh_sukha_s/How to do a Benti.mp3",
    "audios/katha/bh_sukha_s/Searching for an Eternal Home.mp3",
    "audios/katha/bh_sukha_s/Remembering God with Every Breath.mp3",
    "audios/katha/bh_sukha_s/Prakash Ustav of Guru Har Rai Sahib Ji.mp3",
    "audios/katha/bh_sukha_s/the Life of a Saint.mp3",
    "audios/katha/bh_sukha_s/Forgetting the True Soul.mp3",
    "audios/katha/bh_sukha_s/Sikhi Di Saanjh, Unanswered Questions.mp3",
    "audios/katha/bh_sukha_s/Vaisakhi 1699 Updesh.mp3",
    "audios/katha/bh_sukha_s/Standing Under the Guru_s Command.mp3",
    "audios/katha/bh_sukha_s/University Talk on the foundations of Sikhi.mp3",
    "audios/katha/bh_sukha_s/Pukaar and Deedar.mp3",
    "audios/katha/bh_sukha_s/the Divine Gift of Amrit.mp3",
    "audios/katha/bh_sukha_s/the Jeevan of Baba Buddha Ji.mp3",
    "audios/katha/bh_sukha_s/Talk on What Happened to Sikhs in 1984.mp3",
    "audios/katha/bh_sukha_s/Barsi of Sant Baba Thakur Singh Ji.mp3",
    "audios/katha/bh_sukha_s/the State of our Soul.mp3",
    "audios/katha/bh_sukha_s/Addressing the Mind.mp3",
    "audios/katha/bh_sukha_s/Running to the Guru_s Sanctuary.mp3",
    "audios/katha/bh_sukha_s/Opening the Inner Fragrance.mp3",
    "audios/katha/bh_sukha_s/Surrendering before God.mp3",
    "audios/katha/bh_sukha_s/Guru Amar Das Ji.mp3",
    "audios/katha/bh_sukha_s/Gurgaddi of Guru Hargobind Sahib Ji.mp3",
    "audios/katha/bh_sukha_s/the Internal Battle.mp3",
    "audios/katha/bh_sukha_s/the Prakash Purab of Guru Nanak Dev Ji.mp3",
    "audios/katha/bh_sukha_s/Breaking Entanglements.mp3",
    "audios/katha/bh_sukha_s/1984 shaheeds.mp3",
    "audios/katha/bh_sukha_s/taking the support of God_s Lotus Feet.mp3",
    "audios/katha/bh_sukha_s/the Nature of unstable Pleasures.mp3",
    "audios/katha/bh_sukha_s/the desire to meet God.mp3",
    "audios/katha/bh_sukha_s/the Glory of the Khalsa.mp3",
    "audios/katha/bh_sukha_s/Society of Saints 6.13.13.m4a",
    "audios/katha/bh_sukha_s/Sri Guru Arjun Dev Ji - 3 May 2014 .mp3",
    "audios/katha/bh_sukha_s/the Thirst of a Rainbird.mp3",
    "audios/katha/bh_sukha_s/the Teachings of the Guru.mp3",
    "audios/katha/bh_sukha_s/Living in Pain and Pleasure.mp3",
    "audios/katha/bh_sukha_s/Shaheedi of Guru Arjan Dev Ji 6.12.13.m4a",
    "audios/katha/bh_sukha_s/A Fathers Sacrifice For You.mp3",
    "audios/katha/bh_sukha_s/making Guru_s teachings fruitful.mp3",
    "audios/katha/bh_sukha_s/Mother of the Khalsa, Mata Sahib Devan Ji.mp3",
    "audios/katha/bh_sukha_s/the Sacrifices of Chamkaur Sahib.mp3",
    "audios/katha/bh_sukha_s/Being Misled.mp3",
    "audios/katha/bh_sukha_s/Gurpurab of Guru Raam Das Ji.mp3",
    "audios/katha/bh_sukha_s/Serving God.mp3",
    "audios/katha/bh_sukha_s/Guru Nanak Dev Ji 550th Gurpurab.mp3",
    "audios/katha/bh_sukha_s/the Humility of Water.mp3",
    "audios/katha/bh_sukha_s/the Preaching of God_s devotees.mp3",
    "audios/katha/bh_sukha_s/the Ingredients of Amrit.mp3",
    "audios/katha/bh_sukha_s/the Definition of Gursikhi.mp3",
    "audios/katha/bh_sukha_s/Dhan Mata Sahib Kaur Jee.mp3",
    "audios/katha/bh_sukha_s/Talk on the Arts of Sikhi.mp3",
    "audios/katha/bh_sukha_s/Gurgaddi of Sr Guru Granth Sahib Ji.mp3",
    "audios/katha/bh_sukha_s/the Guru_s Transformation.mp3",
    "audios/katha/bh_sukha_s/becoming a Sevadar.mp3",
    "audios/katha/bh_sukha_s/Remembering Death.mp3",
    "audios/katha/bh_sukha_s/Falling in Love with the Sadhsangat.mp3",
    "audios/katha/bh_sukha_s/realising God to be all powerful.mp3",
    "audios/katha/bh_sukha_s/Talk on Guru Nanak Dev Ji, The Revolutionary.mp3",
    "audios/katha/bh_sukha_s/How to Bow before the Guru.mp3",
    "audios/katha/bh_sukha_s/Obtaining the Grace of God.mp3",
    "audios/katha/bh_sukha_s/How to be Coloured in God’s Love.mp3",
    "audios/katha/bh_sukha_s/Vaheguru Simran 2.mp3",
    "audios/katha/bh_sukha_s/the Inner Coolness.mp3",
    "audios/katha/bh_sukha_s/the Story of Fateh.mp3",
    "audios/katha/bh_sukha_s/Vaisaakh and Amrit.mp3",
    "audios/katha/bh_sukha_s/the Company of God_s Saints.mp3",
    "audios/katha/bh_sukha_s/Recognising the Power of God.m4a",
    "audios/katha/bh_sukha_s/Interview with Sikh Channel Canada.mp3",
    "audios/katha/bh_sukha_s/being transformed by the Guru.mp3",
    "audios/katha/bh_sukha_s/Saawan da Mahina, experiencing true bliss.mp3",
    "audios/katha/bh_sukha_s/the Jyoti Jot of Guru Gobind Singh Ji.m4a",
    "audios/katha/bh_sukha_s/Jot and Jugat.mp3",
    "audios/katha/bh_sukha_s/Gurbani Jaap - Hau Dhadhi Shabad.mp3",
    "audios/katha/bh_sukha_s/Hola Mohalla, the Game of Colours.mp3",
    "audios/katha/bh_sukha_s/Love for Guru Sahib.mp3",
    "audios/katha/bh_sukha_s/true reverance to the Guru.mp3",
    "audios/katha/bh_sukha_s/speaking God_s Language.mp3",
    "audios/katha/bh_sukha_s/the Parkash of Guru Nanak Sahib.mp3",
    "audios/katha/bh_sukha_s/the Khalsa and Kakkars.mp3",
    "audios/katha/bh_sukha_s/Talk on Guru Nanak Kahaeyo.mp3",
    "audios/katha/bh_sukha_s/the History of Sri Sarbloh Granth.mp3",
    "audios/katha/bh_sukha_s/Katha of Never Tiring to Praise the Guru.mp3",
    "audios/katha/bh_sukha_s/Bhog of Sri Dasam Guru Granth Sahib Ji.mp3",
    "audios/katha/bh_sukha_s/the meaning of a Gurdwara.mp3",
    "audios/katha/bh_sukha_s/Laavan.mp3",
    "audios/katha/bh_sukha_s/the Power of Amrit.mp3",
    "audios/katha/bh_sukha_s/Loving Gurbani with the Qualities of a Bee.mp3",
    "audios/katha/bh_sukha_s/the Journey of Jap to Sohila.mp3",
    "audios/katha/bh_sukha_s/Guru Gobind Singh Ji through Gurbani.mp3",
    "audios/katha/bh_sukha_s/GNA Talk on Aas (Hopes and Desires).mp3",
    "audios/katha/bh_sukha_s/Punjab Situation Profile.mp3",
    "audios/katha/bh_sukha_s/rising above Praise and Slander.mp3",
    "audios/katha/bh_sukha_s/Guru Arjan Dev Ji, the boat of the Dark Age.mp3",
    "audios/katha/bh_sukha_s/the Power of Remembering the Guru.mp3",
    "audios/katha/bh_sukha_s/the value of Kesh (Uncut Hair).mp3",
    "audios/katha/bh_sukha_s/how the internal affects the external.mp3",
    "audios/katha/bh_sukha_s/Losing our Demerits.mp3",
    "audios/katha/bh_sukha_s/How our Mind is to be Instructed.mp3",
    "audios/katha/bh_sukha_s/Falling in Love with the Saints.mp3",
    "audios/katha/bh_sukha_s/Being Saved by the Guru.mp3",
    "audios/katha/bh_sukha_s/Interview at Punjabi Radio USA.mp3",
    "audios/katha/bh_sukha_s/the Life of Bhagat Jaidev Ji.mp3",
    "audios/katha/bh_sukha_s/being reunited with God.mp3",
    "audios/katha/bh_sukha_s/Katha at Gurdwara Nanak Piao Sahib.mp3",
    "audios/katha/bh_sukha_s/Sewa, Selfless Service.mp4",
    "audios/katha/bh_sukha_s/Jap, the Root of Sikhi.mp3",
    "audios/katha/bh_sukha_s/Old Age and the End.mp3",
    "audios/katha/bh_sukha_s/the Flame of Love.mp3",
    "audios/katha/bh_sukha_s/what are we giving back to the Sahibzade.mp3",
    "audios/katha/bh_sukha_s/Talk on the Real Sikh Story of 1984.mp3",
    "audios/katha/bh_sukha_s/the Distinct Aura of the Saints.mp3",
    "audios/katha/bh_sukha_s/Saka Nankana Sahib.mp3",
    "audios/katha/bh_sukha_s/the Doubt of the World.mp3",
    "audios/katha/bh_sukha_s/Kali Diwali & Becoming a Diva.mp3",
    "audios/katha/bh_sukha_s/the Arrow of Love.mp3",
    "audios/katha/bh_sukha_s/walking the Path of Spirituality.mp3",
    "audios/katha/bh_sukha_s/Acquiring the Truth.mp3",
    "audios/katha/bh_sukha_s/the Definition of a Devotee.m4a",
    "audios/katha/bh_sukha_s/How time for a Realised Being Passes.mp3",
    "audios/katha/bh_sukha_s/Talk on Sikhan Dee Bhagat Mala.mp3",
    "audios/katha/bh_sukha_s/Talk on Qualities of a Gursikh.mp3",
    "audios/katha/bh_sukha_s/How the Guru is the Protector.mp3",
    "audios/katha/bh_sukha_s/the Events of June 1984.mp3",
    "audios/katha/bh_sukha_s/the Greatness of the Guru.mp3",
    "audios/katha/bh_sukha_s/Fateh Divas.mp3",
    "audios/katha/bh_sukha_s/Destroying Our Doubts.mp3",
    "audios/katha/bh_sukha_s/Preparing for Death.mp3",
    "audios/katha/bh_sukha_s/Speech at June 1984 Rally.mp3",
    "audios/katha/bh_sukha_s/Calling out for the Guru.mp3",
    "audios/katha/bh_sukha_s/Guidance from the Saints.mp3",
    "audios/katha/bh_sukha_s/Obtaining the Guru_s Grace.mp3",
    "audios/katha/bh_sukha_s/giving your Arm to the Guru.mp3",
    "audios/katha/bh_sukha_s/Obtaining the Guru_s Fragrance.mp3",
    "audios/katha/bh_sukha_s/Talk on Gursikhi Jeevan.mp3",
    "audios/katha/bh_sukha_s/Building a Relationship with the Guru.mp3",
    "audios/katha/bh_sukha_s/the Blessings of Praising God.mp3",
    "audios/katha/bh_sukha_s/Prakash Divas of Guru Gobind Singh Ji.mp3",
    "audios/katha/bh_sukha_s/Not Losing hope in God.mp3",
    "audios/katha/bh_sukha_s/True Friendship.mp3",
    "audios/katha/bh_sukha_s/How Youth is often Wasted.mp3",
    "audios/katha/bh_sukha_s/the Time of Death.mp3",
    "audios/katha/bh_sukha_s/the Life of Sheikh Farid Ji.mp3",
    "audios/katha/bh_sukha_s/Guru Maneyo Granth.mp3",
    "audios/katha/bh_sukha_s/the rosary of the Guru.mp3",
    "audios/katha/bh_sukha_s/Barsi of Sant Baba Ghanaiya Singh Ji.mp3",
    "audios/katha/bh_sukha_s/No Peace without Meditation.mp3",
    "audios/katha/bh_sukha_s/leaving Vikaar and joining with Nirankaar.mp3",
    "audios/katha/bh_sukha_s/Dusht Daman to Guru Gobind Singh Ji.mp3",
    "audios/katha/bh_sukha_s/Farmers’ Protest Delhi -  UK.mp3",
    "audios/katha/bh_sukha_s/Basics of Sikhi.mp3",
    "audios/katha/bh_sukha_s/the Saints coloured in God_s Love.mp3",
    "audios/katha/bh_sukha_s/Destroying the disease of Worrying.mp3",
    "audios/katha/bh_sukha_s/having Bandgi or Gandgi.mp3",
    "audios/katha/bh_sukha_s/the Love between Guru Nanak Dev Ji & Bhai Mardana.mp3",
    "audios/katha/bh_sukha_s/Assu da Mahina, losing yourself.mp3",
    "audios/katha/bh_sukha_s/the Greatness of a Gursikh.mp3",
    "audios/katha/bh_sukha_s/Sudh Nitnem Paath Bodh Smagam - Importance of Gurbani Santhia.mp3",
    "audios/katha/bh_sukha_s/Diwali.mp3",
    "audios/katha/bh_sukha_s/the Longing to Meet God.mp3",
    "audios/katha/bh_sukha_s/Gursikhi Jeevan.mp3",
]

# upload_folder("/Users/gians/Desktop/audios/1 Bh Sukha S/", folder)
print_links(folder)
