interface TrackOption {
  type: string;
  links: string[];
  checked?: boolean;
}

export interface TrackOptions {
  [key: string]: TrackOption[];
}

export interface ArtistOpt {
  artist_name: string;
  track_groups: TrackOption[];
}

// ---------------- for store.ts
export interface StoreState {
  title: string;
  setTitle: (value: string) => void;
  hstIdx: number;
  history: Track[];
  setHistory: (lst: Track[]) => void;
  clearHistory: () => void;
  setHstIdx: (value: number) => void;
  appendHistory: (trackObj: Track) => void;
  getCurrentTrack: () => Track;
  tracksInQueue: Track[];
  allOptsTracks: ArtistOpt[];
  setTracks: (allOpts: ArtistOpt[]) => void;
  setCheckedForAllArtists: (checked: boolean) => void;
  setCheckedArtist: (artist: string, checked: boolean) => void;
  setCheckedType: (artist: string, typeIdx: number, checked: boolean) => void;
  prevTrack: () => void;
  nextTrack: () => void;
  shuffle: boolean;
  setShuffle: (value: boolean) => void;
  skipTime: number;
  setSkipTime: (value: number) => void;
  timeToGoTo: number;
  setTimeToGoTo: (value: number) => void;
  playBackSpeed: number;
  setPlayBackSpeed: (value: number) => void;
  paused: boolean;
  setPaused: (value: boolean) => void;
  indexTracks: IndexedTracks;
  setIndexTracks: (value: IndexedTracks) => void;
  appendIndexObj: (trackObj: IndexedTrack) => void;
}

export interface Track {
  artist_name: string;
  typeIdx: number;
  linkIdx: number;
  type: string;
  link: string;
  description?: string;
  timestamp?: string;
  shabadArr?: string[];
}

interface IndexedTrack {
  created: string;
  type: string;
  artist: string;
  timestamp: string;
  shabadID: string;
  shabadArr?: string[];
  description: string;
  link: string;
  ID?: number;
}

export interface IndexedTracks {
  [link: string]: IndexedTrack[];
}

export interface SearchStoreState {
  searchInput: string;
  setSearchInput: (value: string) => void;
}

export interface SavedTracksStoreState {
  localStorageKey: string;
  setLocalStorageKey: (value: string) => void;
  savedTracks: Track[];
  setSavedTracks: (value: Track[]) => void;
  appendSavedTrack: (trackObj: Track) => void;
}

export interface ModalStoreState {
  viewHistory: boolean;
  setViewHistory: (value: boolean) => void;
  showArtists: boolean;
  setShowArtists: (value: boolean) => void;
  viewAllTracks: boolean;
  setViewAllTracks: (value: boolean) => void;
  artistToShowTypesFor: string;
  setArtistToShowTypesFor: (value: string) => void;
  typeToShowLinksFor: {artist: string; type: string};
  setTypeToShowLinksFor: (value: {artist: string; type: string}) => void;
}
