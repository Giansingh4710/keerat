import {TrackOption, ArtistOpt, Track} from './types';

function randItemFromArr<T>(arr: T[]): T {
  return arr.splice((Math.random() * arr.length) | 0, 1)[0];
}

function loopIncrement<T>(arr: T[], currentIdx: number): number {
  return (currentIdx + 1) % arr.length;
}

function loopDecrement<T>(arr: T[], currentIdx: number): number {
  if (currentIdx === 0) {
    return arr.length - 1;
  }
  return currentIdx - 1;
}

export function randIdx<T>(arr: T[]): number {
  return Math.floor(Math.random() * arr.length);
}

export function getRandType(aristTracks: TrackOption[]): number {
  const checkedTypesIdx: number[] = [];
  for (let idx = 0; idx < aristTracks.length; idx++) {
    const obj = aristTracks[idx];
    if (obj.checked) checkedTypesIdx.push(idx);
  }
  return randItemFromArr(checkedTypesIdx);
}

export function getNextTrackInLst(tracks: Track[], currTrack: Track): Track {
  const ind = tracks.findIndex(track => track.link === currTrack.link);
  if (ind === -1) return tracks[0];
  return tracks[loopIncrement(tracks, ind)];
}

export function getPrevTrackInLst(tracks: Track[], currTrack: Track): Track {
  const ind = tracks.findIndex(track => track.link === currTrack.link);
  if (ind === -1) return tracks[0];
  return tracks[loopDecrement(tracks, ind)];
}

export function getNextTrackInLst_(allOpts: ArtistOpt[], currTrack: Track): Track | null {
  let artistIdx = allOpts.findIndex(artist => artist.artist_name === currTrack.artist_name);
  let artist_tracks = allOpts[artistIdx];
  let track_group = artist_tracks.track_groups[currTrack.typeIdx];

  // next link
  if (currTrack.linkIdx < track_group.links.length - 1 && track_group.checked) {
    return {
      artist_name: currTrack.artist_name,
      typeIdx: currTrack.typeIdx,
      linkIdx: currTrack.linkIdx + 1,
      type: track_group.type,
      link: track_group.links[currTrack.linkIdx + 1],
    };
  }

  // next type
  const typeIdx = getNextCheckedType(artist_tracks.track_groups, currTrack.typeIdx);
  if (typeIdx !== -1) {
    return {
      artist_name: currTrack.artist_name,
      typeIdx,
      linkIdx: 0,
      type: artist_tracks.track_groups[typeIdx].type,
      link: artist_tracks.track_groups[typeIdx].links[0],
    };
  }

  // next artist with checked type
  while (true) {
    if (artistIdx < allOpts.length - 1) artistIdx = artistIdx + 1;
    else artistIdx = 0;

    if (allOpts[artistIdx].artist_name === currTrack.artist_name) break;

    artist_tracks = allOpts[artistIdx];
    for (let i = 0; i < artist_tracks.track_groups.length; i++) {
      if (artist_tracks.track_groups[i].checked) {
        return {
          artist_name: artist_tracks.artist_name,
          typeIdx: i,
          linkIdx: 0,
          type: artist_tracks.track_groups[i].type,
          link: artist_tracks.track_groups[i].links[0],
        };
      }
    }
  }

  return null;
}

function getNextCheckedType(aristTracks: TrackOption[], currentTypeIdx: number): number {
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

export function getRandomKey(obj: Record<string, unknown>): string {
  return Object.keys(obj)[(Math.random() * Object.keys(obj).length) | 0];
}

export function getNameOfTrack(link: string): string {
  if (!link) return '';
  const title = link.split('/').slice(-1)[0];
  return decodeURIComponent(decodeURIComponent(title));
}

export function getTrackLinks(allOpts: ArtistOpt[]): string[] {
  const links: string[] = [];
  allOpts.forEach(artist => {
    for (const type of artist.track_groups) {
      if (type.checked) {
        links.push(...type.links);
      }
    }
  });
  return links;
}

export function formatTime(timeInSeconds: number): string {
  if (!timeInSeconds) return '';
  function str_pad_left(string: string, pad: string, length: number): string {
    return (new Array(length + 1).join(pad) + string).slice(-length);
  }

  let hours = Math.floor(timeInSeconds / 3600);
  let minutes = Math.floor((timeInSeconds % 3600) / 60);
  let seconds = Math.floor(timeInSeconds % 60);

  const hoursStr = str_pad_left(hours.toString(), '0', 2);
  const minutesStr = str_pad_left(minutes.toString(), '0', 2);
  const secondsStr = str_pad_left(seconds.toString(), '0', 2);

  let formattedTime = '';
  if (hoursStr === '00') {
    formattedTime = `${minutesStr}:${secondsStr}`;
  } else {
    formattedTime = `${hoursStr}:${minutesStr}:${secondsStr}`;
  }

  return formattedTime;
}

export function containsOnlyDigits(str: string): boolean {
  return /^\d+$/.test(str);
}

export function addCheckedKey(allOpts: ArtistOpt[], checked = true): ArtistOpt[] {
  for (const artist of allOpts) {
    for (const trackGroup of artist.track_groups) {
      trackGroup.checked = checked;
    }
  }
  return allOpts;
}

export function trackCount(allOpts: ArtistOpt[]): number {
  let count = 0;
  for (const artist of allOpts) {
    for (const trackGroup of artist.track_groups) {
      if (trackGroup.checked) count += trackGroup.links.length;
    }
  }
  return count;
}

export function isChecked(allOpts: ArtistOpt[], artist_name: string): number {
  // returns index of first checked type
  for (const artist of allOpts) {
    if (artist.artist_name !== artist_name) continue;
    for (let i = 0; i < artist.track_groups.length; i++) {
      if (artist.track_groups[i].checked) return i;
    }
  }
  return -1;
}

export function getSecondsFromTimeStamp(the_time?: string): number {
  if (!the_time) return 0;

  // get time in 10:23 format and convert to seconds
  let seconds = parseInt(the_time);
  seconds = isNaN(seconds) ? 0 : seconds;
  if (the_time.includes(':')) {
    const timeLst = the_time.split(':');
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

export function hasKeys(obj: Record<string, unknown>, keys: string[]): boolean {
  for (const key of keys) {
    if (!obj.hasOwnProperty(key)) return false;
  }
  return true;
}

export function validTrackObj(trkObj: unknown): trkObj is Track {
  const keys = ['artist', 'type', 'link'];
  if (typeof trkObj !== 'object' || !trkObj) {
    return false;
  }
  return hasKeys(trkObj as Record<string, unknown>, keys);
}

export function getObjFromUrl(link: string, allOpts: ArtistOpt[]): Track {
  for (const artist of allOpts) {
    for (let typeIdx = 0; typeIdx < artist.track_groups.length; typeIdx++) {
      const linkIdx = artist.track_groups[typeIdx].links.indexOf(link);
      if (linkIdx === -1) continue;
      return {
        artist_name: artist.artist_name,
        typeIdx,
        linkIdx,
        type: artist.track_groups[typeIdx].type,
        link: link,
      };
    }
  }
  return {} as Track;
}

export function secondsToHMS(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0'),
    ].join(':');
  } else {
    return [minutes.toString().padStart(2, '0'), secs.toString().padStart(2, '0')].join(':');
  }
}

export function getAllLinkObjs(allOpts: ArtistOpt[]): Track[] {
  const tracksLst: Track[] = [];
  for (const artist of allOpts) {
    for (let typeInd = 0; typeInd < artist.track_groups.length; typeInd++) {
      const trackGroup = artist.track_groups[typeInd];
      if (!trackGroup.checked) continue;
      for (let linkInd = 0; linkInd < trackGroup.links.length; linkInd++) {
        tracksLst.push({
          artist_name: artist.artist_name,
          typeIdx: typeInd,
          linkIdx: linkInd,
          type: artist.track_groups[typeInd].type,
          link: trackGroup.links[linkInd],
        });
      }
    }
  }
  return tracksLst;
}

export function getDateFromUnixTime(unixTimeStamp: number): string {
  const the_date = new Date(unixTimeStamp * 1000);
  return the_date.toLocaleString();
}

export function getRatio(artistTracks: TrackOption[]): string {
  let checkedTracks = 0;
  const checkedTypes = artistTracks.filter(type => type.checked);
  for (const type of checkedTypes) {
    checkedTracks += type.links.length;
  }
  const total = artistTrackCount(artistTracks);
  return `${checkedTracks}/${total}`;
}

function artistTrackCount(artistTracks: TrackOption[]): number {
  let count = 0;
  for (const type of artistTracks) {
    count += type.links.length;
  }
  return count;
}
