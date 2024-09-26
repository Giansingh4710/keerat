import os
import mutagen

def check_if_2_files_the_same(path1,path2):
    audio1 = mutagen.File(path1)
    audio2 = mutagen.File(path2)

    if not audio1:
        print(path1)
    if not audio2:
        print(path2)

    len1, len2 = audio1.info.length, audio2.info.length
    if len1 == len2:
        return True

    return False
    if os.path.exists(path1) and os.path.exists(path2):
        if os.path.getsize(path1) == os.path.getsize(path2):
            return True
        else:
            return False
    else:
        return False


def main():
    dir = "/Volumes/Hitachi/audios/keertan/sdo/yt_mga/"
    dir = "./yt_mga/"
    theFiles = os.listdir(dir)
    for i in range(len(theFiles)):
        file1 = os.path.join(dir, theFiles[i])
        for j in range(i+1,len(theFiles)):
            file2 = os.path.join(dir, theFiles[j])
            if check_if_2_files_the_same(file1,file2):
                print(theFiles[i]," == ",theFiles[j])
                print()
main()
# a = "/Volumes/Hitachi/audios/keertan/sdo/yt_mga/019 MGA SDO 1019 smpk 17 Rogi Ander Rog Khandene.m4a"
# b = "/Volumes/Hitachi/audios/keertan/sdo/yt_mga/086 MGA SDO 1068 M 14 ART line in track 02.m4a"
# audio1=mutagen.File(a)
# audio2=mutagen.File(b)
# print(os.path.getsize(a),audio1.info.length)
# print(os.path.getsize(b),audio2.info.length)

