self.onmessage = function (e) {
  const {searchTerm, allOpts} = e.data;
  const results = searchTracks(searchTerm, allOpts);
  self.postMessage(results);
};

function searchTracks(searchTerm, allOpts) {
  const words = searchTerm.toLowerCase().split(' ');
  const results = [];
  for (const artist in allOpts) {
    for (let typeIdx = 0; typeIdx < allOpts[artist].length; typeIdx++) {
      if (!allOpts[artist][typeIdx].checked) continue;
      const links = allOpts[artist][typeIdx].links;

      for (let linkIdx = 0; linkIdx < links.length; linkIdx++) {
        const link = links[linkIdx].toLowerCase();
        let allWordsFound = true;
        for (const word of words) {
          if (!link.includes(word)) {
            allWordsFound = false;
            break;
          }
        }
        if (allWordsFound) {
          results.push({
            artist,
            typeIdx,
            linkIdx,
            type: allOpts[artist][typeIdx].type,
            link: links[linkIdx], // to get unlowered case
          });
        }
      }
    }
  }
  return results;
}
