import subprocess
import os


def download(link):
    dir = link.split("/")[-1]
    os.mkdir(dir)
    os.chdir(dir)
    subprocess.call(["yt-dlp", link])
    os.chdir("..")


links = [
    # "https://soundcloud.com/gianishersinghjiambala/sets/sri-guru-hargobind-sahib-ji",
    # "https://soundcloud.com/gianishersinghjiambala/sets/sri-guru-gobind-singh-ji-katha",
    "https://soundcloud.com/gianishersinghjiambala/sets/cn2ab7ey2zx0",  # vaarag Shaatk
    "https://soundcloud.com/gianishersinghjiambala/sets/8befjvsawdtv",  # 101 Ardaasa
]

for link in links:
    download(link)
