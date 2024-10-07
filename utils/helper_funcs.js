export function randItemFromArr(arr) {
  return arr.splice((Math.random() * arr.length) | 0, 1)[0];
}

export function loopIncrement(arr, currentIdx) {
  return (currentIdx + 1) % arr.length;
}

export function loopDecrement(arr, currentIdx) {
  if (currentIdx === 0) {
    return arr.length - 1;
  }
  return currentIdx - 1;
}

export function randIdx(arr) {
  return Math.floor(Math.random() * arr.length);
}

export function getRandType(aristTracks) {
  const checkedTypesIdx = [];
  for (let idx = 0; idx < aristTracks.length; idx++) {
    const obj = aristTracks[idx];
    if (obj.checked) checkedTypesIdx.push(idx);
  }
  return randItemFromArr(checkedTypesIdx);
}

export function getNextCheckedType(aristTracks, currentTypeIdx) {
  for (let idx = currentTypeIdx + 1; idx < aristTracks.length; idx++) {
    const obj = aristTracks[idx];
    if (obj.checked) return idx;
  }

  for (let idx = 0; idx < currentTypeIdx; idx++) {
    const obj = aristTracks[idx];
    if (obj.checked) return idx;
  }
  return -1;
}

export function getRandomKey(obj) {
  return Object.keys(obj)[(Math.random() * Object.keys(obj).length) | 0];
}

export function getNameOfTrack(link) {
  if (!link) return "";
  const title = link.split("/").slice(-1)[0];
  return decodeURIComponent(decodeURIComponent(title));
}

export function getTrackLinks(allOpts) {
  const links = [];
  Object.keys(allOpts).forEach((artist) => {
    if (allOpts[artist].checked) {
      links.push(...allOpts[artist].trackLinks);
    }
  });
  return links;
}

export function formatTime(timeInSeconds) {
  if (!timeInSeconds) return "";
  function str_pad_left(string, pad, length) {
    return (new Array(length + 1).join(pad) + string).slice(-length);
  }

  let hours = Math.floor(timeInSeconds / 3600);
  let minutes = Math.floor((timeInSeconds % 3600) / 60);
  let seconds = Math.floor(timeInSeconds % 60);

  hours = str_pad_left(hours, "0", 2);
  minutes = str_pad_left(minutes, "0", 2);
  seconds = str_pad_left(seconds, "0", 2);

  let formattedTime = "";
  if (hours === "00") {
    formattedTime = `${minutes}:${seconds}`;
  } else {
    formattedTime = `${hours}:${minutes}:${seconds}`;
  }

  return formattedTime;
}

export function containsOnlyDigits(str) {
  return /^\d+$/.test(str);
}

export function addCheckedKey(allOpts, checked = true) {
  for (const artist in allOpts) {
    for (const obj of allOpts[artist]) {
      obj.checked = checked;
    }
  }
  return allOpts;
}

export function trackCount(allOpts) {
  let count = 0;
  for (const artist in allOpts) {
    for (const obj of allOpts[artist]) {
      if (obj.checked) count += obj.links.length;
    }
  }
  return count;
}

export function isChecked(allOpts, artist) {
  for (const obj of allOpts[artist]) {
    if (obj.checked) return true;
  }
  return false;
}

export function getSecondsFromTimeStamp(the_time) {
  if (!the_time) return 0;

  // get time in 10:23 format and convert to seconds
  let seconds = parseInt(the_time);
  seconds = isNaN(seconds) ? 0 : seconds;
  if (the_time.includes(":")) {
    const timeLst = the_time.split(":");
    let totalSeconds = 0;
    let multiplier = 1;
    for (let i = timeLst.length - 1; i > -1; i--) {
      totalSeconds += multiplier * parseInt(timeLst[i]);
      multiplier *= 60;
    }
    seconds = totalSeconds;
  }
  return seconds;
}

export function hasKeys(obj, keys) {
  for (const key of keys) {
    if (!obj.hasOwnProperty(key)) return false;
  }
  return true;
}

export function validTrackObj(trkObj) {
  const keys = ["artist", "type", "link"];
  if (typeof trkObj !== "object") {
    return false;
  }
  return hasKeys(trkObj, keys);
}

export function getObjFromUrl(link, allOpts) {
  for (const artist in allOpts) {
    for (let typeIdx = 0; typeIdx < allOpts[artist].length; typeIdx++) {
      const linkIdx = allOpts[artist][typeIdx].links.indexOf(link);
      if (linkIdx === -1) continue;
      return {
        artist,
        typeIdx,
        linkIdx,
        type: allOpts[artist][typeIdx].type,
        link: link,
      };
    }
  }
  return {};
}

export function getLinkFromOldUrlDate(artist, trackIndex, allOpts) {
  const artistTypes = allOpts[artist];
  if (!artistTypes) return "";
  const allLinks = [];
  for (const typeObj of artistTypes) {
    allLinks.push(...typeObj.links);
  }

  if (trackIndex > allLinks.length - 1) {
    return "";
  }
  return allLinks[trackIndex];
}

export function secondsToHMS(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      secs.toString().padStart(2, "0"),
    ].join(":");
  } else {
    return [
      minutes.toString().padStart(2, "0"),
      secs.toString().padStart(2, "0"),
    ].join(":");
  }
}

export function getTypeNLinkIdx(allOpts, trkObj) {
  let typeIdx = trkObj.typeIdx;
  let linkIdx = trkObj.linkIdx;
  if (typeIdx !== undefined && linkIdx !== undefined)
    return { typeIdx: parseInt(typeIdx), linkIdx: parseInt(linkIdx) };

  const artist = trkObj.artist;
  const type = trkObj.type;
  const link = trkObj.link;
  for (typeIdx = 0; typeIdx < allOpts[artist].length; typeIdx++) {
    if (allOpts[artist][typeIdx].type === type) {
      for (
        linkIdx = 0;
        linkIdx < allOpts[artist][typeIdx].links.length;
        linkIdx++
      ) {
        if (allOpts[artist][typeIdx].links[linkIdx] === link) {
          console.log("Found typeIdx from zustand");
          return { typeIdx, linkIdx };
        }
      }
    }
  }
  return { typeIdx: 0, linkIdx: 0 };
}

export function getAllLinkObjs(allOpts) {
  const tracksLst = [];
  for (const artist in allOpts) {
    for (const typeInd in allOpts[artist]) {
      if (!allOpts[artist][typeInd].checked) continue;
      for (const linkInd in allOpts[artist][typeInd].links) {
        tracksLst.push({
          artist: artist,
          typeIdx: typeInd,
          linkIdx: linkInd,
          type: allOpts[artist][typeInd].type,
          link: allOpts[artist][typeInd].links[linkInd],
        });
      }
    }
  }
  return tracksLst;
}

export function getDateFromUnixTime(unixTimeStamp) {
  const the_date = new Date(unixTimeStamp * 1000);
  return the_date.toLocaleString();
}


export function getRatio(artistTracks) {
  let checkedTracks = 0;
  const checkedTypes = artistTracks.filter((type) => type.checked);
  for (const type of checkedTypes) {
    checkedTracks += type.links.length;
  }
  const total = artistTrackCount(artistTracks);
  return `${checkedTracks}/${total}`;
}

function artistTrackCount(artistTracks) {
  let count = 0;
  for (const type of artistTracks) {
    count += type.links.length;
  }
  return count;
}
