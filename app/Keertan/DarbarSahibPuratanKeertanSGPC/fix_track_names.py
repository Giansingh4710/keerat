from urllib.parse import unquote

links = [
    "https://sgpc.net/puratan-kirtan/Surjit Singh/Baisakhi%2520-%2520Jai%2520Jai%2520Jag%2520Karan%2520Srist%2520Ubarang%2520Mam%2520Prit%2520Parang%2520Jai%2520Te%2520Gangg%5B1%5D.mp3",
    "https://sgpc.net/puratan-kirtan/Surjit Singh/Baisakhi%2520-%2520Mer%2520Abhai%2520Benti%2520Sun%2520Leejai%2520%28Patshahi%252010%29%5B1%5D.mp3",
    "https://sgpc.net/puratan-kirtan/Surjit Singh/Baisakhi%2520-%2520Raj%2520Me%2520Raj%2520Jog%2520Me%2520Jogi%2520Tap%2520Me%2520Tapisar%2520Grasth%2520Me%2520Bhogi%5B1%5D.mp3",
    "https://sgpc.net/puratan-kirtan/Surjit Singh/Bhai%2520Surjit%2520Singh%2520-%2520Ab%2520mohe%2520jivan%2520padvi%2520payee%5B1%5D.mp3",
    "https://sgpc.net/puratan-kirtan/Surjit Singh/Bhai%2520Surjit%2520Singh%2520-%2520Anand%2520rang%2520binod%2520hamare%5B1%5D.mp3",
    "https://sgpc.net/puratan-kirtan/Surjit Singh/Bhai%2520Surjit%2520Singh%2520-%2520Baso%2520mere%2520man%2520mai%5B1%5D.mp3",
    "https://sgpc.net/puratan-kirtan/Surjit Singh/Bhai%2520Surjit%2520Singh%2520-%2520Chal%2520re%2520baikunth%2520tujhai%2520lai%2520taroon%5B1%5D.mp3",
    "https://sgpc.net/puratan-kirtan/Surjit Singh/Bhai%2520Surjit%2520Singh%2520-%2520Chalange%2520uth%2520naam%2520jap%2520%2520nis%2520basar%2520aradh%5B1%5D.mp3",
    "https://sgpc.net/puratan-kirtan/Surjit Singh/Bhai%2520Surjit%2520Singh%2520-%2520Deenan%2520ko%2520data%2520hai%5B1%5D.mp3",
    "https://sgpc.net/puratan-kirtan/Surjit Singh/Bhai%2520Surjit%2520Singh%2520-%2520Dekho%2520bhai%2520gyan%2520ki%2520ayi%2520aandhi%5B1%5D.mp3",
    "https://sgpc.net/puratan-kirtan/Surjit Singh/Bhai%2520Surjit%2520Singh%2520-%2520Ek%2520tuhi%2520ek%2520tuhi%5B1%5D.mp3",
    "https://sgpc.net/puratan-kirtan/Surjit Singh/Bhai%2520Surjit%2520Singh%2520-%2520Gur%2520mere%2520sang%2520sadaa%2520hai%2520naale%5B1%5D.mp3",
    "https://sgpc.net/puratan-kirtan/Surjit Singh/Bhai%2520Surjit%2520Singh%2520-%2520Halat%2520sukh%2520palat%2520sukh%2520nit%2520sukh%2520simarano%5B1%5D.mp3",
    "https://sgpc.net/puratan-kirtan/Surjit Singh/Bhai%2520Surjit%2520Singh%2520-%2520Har%2520bin%2520jeeo%2520jal%2520bal%2520jaavon%5B1%5D.mp3",
    "https://sgpc.net/puratan-kirtan/Surjit Singh/Bhai%2520Surjit%2520Singh%2520-%2520Japyo%2520jin%2520arjan%2520dev%2520guru%5B1%5D.mp3",
    "https://sgpc.net/puratan-kirtan/Surjit Singh/Bhai%2520Surjit%2520Singh%2520-%2520Jee%2520ki%2520ekai%2520hi%2520paimani%5B1%5D.mp3",
    "https://sgpc.net/puratan-kirtan/Surjit Singh/Bhai%2520Surjit%2520Singh%2520-%2520Karat%2520karat%2520charach%2520charach%2520charchari%5B1%5D.mp3",
    "https://sgpc.net/puratan-kirtan/Surjit Singh/Bhai%2520Surjit%2520Singh%2520-%2520Mai%2520Banjaran%2520Ram%2520Ki%5B1%5D.mp3",
    "https://sgpc.net/puratan-kirtan/Surjit Singh/Bhai%2520Surjit%2520Singh%2520-%2520Mai%2520gobind%2520puja%2520kaha%2520lai%2520charavoh%5B1%5D.mp3",
    "https://sgpc.net/puratan-kirtan/Surjit Singh/Bhai%2520Surjit%2520Singh%2520-%2520Mere%2520sahiba%2520kaun%2520jaane%2520guna%2520tere%5B1%5D.mp3",
    "https://sgpc.net/puratan-kirtan/Surjit Singh/Bhai%2520Surjit%2520Singh%2520-%2520Mere%2520sahiba%2520kaun%2520jane%2520gun%2520tere%5B1%5D.mp3",
    "https://sgpc.net/puratan-kirtan/Surjit Singh/Bhai%2520Surjit%2520Singh%2520-%2520Mohan%2520neend%2520na%2520aavai%2520havai%5B1%5D.mp3",
    "https://sgpc.net/puratan-kirtan/Surjit Singh/Bhai%2520Surjit%2520Singh%2520-%2520mohe%2520na%2520bisaro%2520mai%2520jan%2520tera%5B1%5D.mp3",
    "https://sgpc.net/puratan-kirtan/Surjit Singh/Bhai%2520Surjit%2520Singh%2520-%2520Pratpal%2520prabh%2520kripal%2520kavan%2520gun%2520gani%5B1%5D.mp3",
    "https://sgpc.net/puratan-kirtan/Surjit Singh/Bhai%2520Surjit%2520Singh%2520-%2520Pratpal%2520prabh%2520kripal%2520kavan%2520gun%2520gani%5B1%5D 1.mp3",
    "https://sgpc.net/puratan-kirtan/Surjit Singh/Bhai%2520Surjit%2520Singh%2520-%2520Pritam%2520ke%2520des%2520kaise%2520batan%2520se%2520jaiye%2520%282%29%5B1%5D.mp3",
    "https://sgpc.net/puratan-kirtan/Surjit Singh/Bhai%2520Surjit%2520Singh%2520-%2520Pritam%2520ke%2520des%2520kaise%2520batan%2520se%2520jaiye%5B1%5D.mp3",
    "https://sgpc.net/puratan-kirtan/Surjit Singh/Bhai%2520Surjit%2520Singh%2520-%2520Rajan%2520kaun%2520tumare%2520aavai%5B1%5D.mp3",
    "https://sgpc.net/puratan-kirtan/Surjit Singh/Bhai%2520Surjit%2520Singh%2520-%2520Sajana%2520sant%2520aavoh%2520mere%25202%5B1%5D.mp3",
    "https://sgpc.net/puratan-kirtan/Surjit Singh/Bhai%2520Surjit%2520SIngh%2520-%2520Sajana%2520sant%2520aavoh%2520mere%5B1%5D.mp3",
    "https://sgpc.net/puratan-kirtan/Surjit Singh/Bhai%2520Surjit%2520Singh%2520-%2520Sevak%2520ki%2520ohrak%2520nibhi%2520preet%5B1%5D.mp3",
    "https://sgpc.net/puratan-kirtan/Surjit Singh/Bhai%2520Surjit%2520Singh%2520-%2520Subh%2520bachan%2520bol%2520gun%2520amol%2520kinkari%2520bichar%5B1%5D.mp3",
    "https://sgpc.net/puratan-kirtan/Surjit Singh/Bhai%2520Surjit%2520Singh%2520-%2520Sun%2520sajan%2520prem%2520sandesada%5B1%5D.mp3",
    "https://sgpc.net/puratan-kirtan/Surjit Singh/Bhai%2520Surjit%2520Singh%2520-%2520Taiso%2520hi%2520mai%2520dith%2520jaisa%2520satgur%2520sunida%5B1%5D.mp3",
    "https://sgpc.net/puratan-kirtan/Surjit Singh/Bhai%2520Surjit%2520Singh%2520-%2520Tera%2520jan%2520ram%2520rasaian%2520mata%5B1%5D.mp3",
    "https://sgpc.net/puratan-kirtan/Surjit Singh/Bhai%2520Surjit%2520Singh%2520-%2520Tohi%2520mohi%2520mohi%2520tohi%2520antar%2520kaisa%5B1%5D.mp3",
    "https://sgpc.net/puratan-kirtan/Surjit Singh/sajana%2520sant%2520aavoh%2520mere%5B1%5D.mp3",
    "https://sgpc.net/puratan-kirtan/Surjit Singh/sajana%2520sant%2520aavoh%2520mere%5B1%5D 1.mp3",
    "https://sgpc.net/puratan-kirtan/Surjit Singh/Surjit SIngh Kat jaiye re ghar lago rang%5D.mp3",
    "https://sgpc.net/puratan-kirtan/Surjit Singh/Surjit SIngh Lobh lahar at neejhar bajai%5B1%5D.mp3",
    "https://sgpc.net/puratan-kirtan/Surjit Singh/Surjit SIngh  Sajana sant aavoh mere.mp3",
    "https://sgpc.net/puratan-kirtan/Surjit Singh/Surjit Singh Tou darshan ki karo samai.mp3",
]

for i in links:
    print(f'\n"{i}",')
    print(f'"{unquote(i)}",')
    print(f'"{unquote(unquote(i))}",')
