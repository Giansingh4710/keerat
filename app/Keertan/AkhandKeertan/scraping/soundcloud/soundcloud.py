from selenium import webdriver
import time
from selenium.webdriver.common.by import By

def getAllSDOlinks():
    br = webdriver.Firefox()
    theUrl = "https://soundcloud.com/search/sounds?q=bhai%20mohinder%20singh%20sdo"
    br.get(theUrl)
    # time.sleep(5)
    for i in range(15):
        print(i)
        br.execute_script("window.scrollTo(0, document.body.scrollHeight)")
        time.sleep(1)
    tracks = br.find_elements(By.CLASS_NAME, "searchItem__trackItem")
    atags = [track.find_elements(By.TAG_NAME, "a")[3] for track in tracks]
    links = [i.get_attribute("href") for i in atags]
    print(links)
    br.close()
    return links


links = getAllSDOlinks()
