from selenium import webdriver
from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup as bs
import time
import requests
import os
from bs4 import BeautifulSoup as bs
import urllib.request


def download(links, path):
    print("Downloading..." + path)
    if path[-1] != "/":
        path += "/"
    if os.path.isdir(path) == False:
        os.mkdir(path)
    count = 0
    for i in links:
        count += 1
        padded_count = str(count).zfill(3)
        title = "".join(i.split("/")[-1])
        title = title.replace("%20", " ", -1)
        title = f"{padded_count}) {title}"
        try:
            urllib.request.urlretrieve(i, path + title)
            print(f"Downloaded: {title}")
        except Exception as e:
            print(f"No download :{e}")


def golden_khajana():
    def goldenKhajana(link):
        res = requests.get(link)
        soup = bs(res.text, "lxml")
        td = soup.find_all("td", valign="top")
        atags = [i.find("a") for i in td]
        links = []
        names = []
        for i in atags:
            title = "http://sikhsoul.com" + i["href"]
            if title not in links:
                links.append("http://sikhsoul.com" + i["href"])
            if i.text not in names:
                names.append(i.text)
        names = names[1:]
        return names, links

    # theLink = "http://sikhsoul.com/golden_khajana/index.php?q=f&f=%2FKeertan%2FBhai+Mohinder+Singh+SDO"
    # theLink="http://sikhsoul.com/golden_khajana/index.php?q=f&f=%2FKeertan%2FBhai+Joginder+Singh+Talwara"
    # theLink="http://sikhsoul.com/golden_khajana/index.php?q=f&f=%2FKeertan%2FBhai+Mehar+Singh"
    theLink="http://sikhsoul.com/golden_khajana/index.php?q=f&f=%2FKeertan%2FBhai+Tejinderpal+Singh+Dulla"
    names, links = goldenKhajana(theLink)
    # download(links, "SDO")
    [print(i) for i in links]


def i_kirtan():
    def ikirtan(link, baseLink):
        res = requests.get(link)
        soup = bs(res.text, "lxml")
        if link[-1] != "/":
            link += "/"

        tables = soup.find_all(
            "table",
            bgcolor="CCCCCC",
            width="80%",
            cellspacing="0",
            cellpadding="4",
            border="0",
        )
        tables += soup.find_all("table", bgcolor="9999CC")
        links = []
        for item in tables:
            audio = item.find("img", src="index.php?i=a") or item.find(
                "img", src="index.php?i=v"
            )
            otherHalf = item.find("a")["href"]
            if otherHalf[0] == "/":
                otherHalf = otherHalf[1:]
            new_link = baseLink + otherHalf
            if not audio:
                # only folders are supposed to be in here
                print(f"folder: {new_link}")
                links += ikirtan(new_link, baseLink)
                continue
            print(new_link)
            links.append(new_link)
        return links

    base = "https://www.ikirtan.com/"
    # theLink = "https://www.ikirtan.com/index.php?q=f&f=%2FBhai_Mohinder_Singh_Jee_SDO"
    # theLink="http://www.ikirtan.com/index.php?f=%2FBhai_Joginder_Singh_Jee_Talwara&q=f"
    # theLink="https://www.ikirtan.com/index.php?q=f&f=%2FBhai_Mehar_Singh_Jee"
    theLink="https://www.ikirtan.com/index.php?q=f&f=%2F_Bhai_Jeevan_Singh_Jee"
    links = ikirtan(theLink, base)
    # download(links,path)
    print("\n")
    [print(i) for i in links]


def sikhRoots():
    def sikh_roots(link):
        br = webdriver.Firefox()
        br.get(link)
        time.sleep(5)
        tracks = br.find_elements(By.CLASS_NAME, "song-icons")
        links = [i.find_element(By.TAG_NAME, "a").get_attribute("href") for i in tracks]
        [print(i) for i in links]
        # for i in tracks:
        # atag=i.find_element_by_tag_name('a')
        # atag.click()

    theLink = "https://www.sikhroots.com/audio-mp3/M/Bhai-Mehar-Singh/Mixed-Kirtan"
    sikh_roots(theLink)


golden_khajana()
# i_kirtan()
# youtube()
# sikhRoots()
