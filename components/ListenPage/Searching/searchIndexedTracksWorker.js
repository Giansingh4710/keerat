self.onmessage = function (e) {
  const { searchTerm, allOpts, indexTracks } = e.data;
  const results = wordSearchIndexedTracks(searchTerm, allOpts, indexTracks);
  self.postMessage(results);
};

function wordSearchIndexedTracks(searchTerm, allOpts, indexTracks) {
  const links = [];
  const wordsEntered = searchTerm.toLowerCase().split(" ");
  for (const key in indexTracks) {
    const indexes = indexTracks[key];
    const { typeIdx, linkIdx, type } = getTypeNLink(
      allOpts,
      key,
      indexes[0].artist,
    );
    for (const i in indexes) {
      const index = indexes[i];
      if (
        wordsEntered.every((word) => {
          return index.description?.toLowerCase().includes(word);
        })
      ) {
        links.push({
          lineMatched: index.description,
          timestamp: index.timestamp,

          artist: index.artist,
          link: key,
          linkIdx,
          typeIdx,
          type,
        });
        continue;
      }

      if (index.shabadArr === undefined) continue;
      for (const line of index.shabadArr) {
        if (wordsEntered.every((word) => line.toLowerCase().includes(word))) {
          links.push({
            lineMatched: line,
            timestamp: index.timestamp,

            artist: index.artist,
            link: key,
            linkIdx,
            typeIdx,
            type,
          });
          continue;
        }
      }
    }
  }
  return links;
}

function getTypeNLink(allOpts, link, artist) {
  for (let typeIdx = 0; typeIdx < allOpts[artist].length; typeIdx++) {
    for (
      let linkIdx = 0;
      linkIdx < allOpts[artist][typeIdx].links.length;
      linkIdx++
    ) {
      if (allOpts[artist][typeIdx].links[linkIdx] === link) {
        return { typeIdx, linkIdx, type: allOpts[artist][typeIdx].type };
      }
    }
  }
  // console.log(link.trim(), artist, "FAILEDDD");
  return { typeIdx: -1, linkIdx: -1, type: "" };
}
