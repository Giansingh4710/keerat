const a = [
  "https://sgpc.net/puratan-kirtan/DALBIR SINGH/ab%2520ham%2520chali%2520thakur%2520kay%5B1%5D.mp3",
  "https://sgpc.net/puratan-kirtan/DALBIR SINGH/asi%2520kirpa%2520kro%2520prabh%2520meray%5B1%5D.mp3",
  "https://sgpc.net/puratan-kirtan/DALBIR SINGH/hamari%2520payari%2520amrit%2520dhari%5B1%5D.mp3",
  "https://sgpc.net/puratan-kirtan/DALBIR SINGH/Jasi%2520teri%2520chaal%5B1%5D.mp3",
  "https://sgpc.net/puratan-kirtan/DALBIR SINGH/jay%2520ko%2520apni%2520sobha%2520loray%5B1%5D.mp3",
  "https://sgpc.net/puratan-kirtan/DALBIR SINGH/kahay%2520ray%2520ban%2520khojan%2520jai%5B1%5D.mp3",
  "https://sgpc.net/puratan-kirtan/DALBIR SINGH/man%2520ray%2520prabh%2520ki%2520saran%2520vicharo%5B1%5D.mp3",
  "https://sgpc.net/puratan-kirtan/DALBIR SINGH/meray%2520lalan%2520ki%2520sobha%5B1%5D.mp3",
  "https://sgpc.net/puratan-kirtan/DALBIR SINGH/prabh%2520sao%2520lag%2520rahio%2520%5B1%5D.mp3",
  "https://sgpc.net/puratan-kirtan/DALBIR SINGH/sadho%2520man%2520ka%2520maan%2520tago%5B1%5D.mp3",
  "https://sgpc.net/puratan-kirtan/DALBIR SINGH/thakur%2520gaiya%2520atam%2520rang%5B1%5D.mp3",
]

function decodeLinks(links) {
    const decodedLinks = [];
    for (const link of links) {
        // Decode the link using decodeURIComponent and push it to the decodedLinks array
        decodedLinks.push(decodeURIComponent(decodeURIComponent(decodeURIComponent(link))))
    }
    return decodedLinks;
}

const b = decodeLinks(a);
console.log(b);
