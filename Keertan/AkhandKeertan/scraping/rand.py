import json

def get_json_data_from_file(name):
    data = []
    with open(name, "r") as f:
        for line in f:
            data.append(json.loads(line))
    return data

a = get_json_data_from_file("./heeraRatan.json")[::-1]
b = get_json_data_from_file("./dl_all_links_from_yt_link/heeraRatan.json")[::-1]

for i in range(min(len(a), len(b))):
    print(i)
    if a[i]['title'] != b[i]['title']:
        print(a[i]['title'], b[i]['title'])
        break
print(len(a), len(b))
