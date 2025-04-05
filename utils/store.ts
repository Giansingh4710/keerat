import {create} from 'zustand';
import {getAllLinkObjs, getNextTrackInLst, getPrevTrackInLst} from './helper_funcs';
import {
  ArtistOpt,
  StoreState,
  Track,
  IndexedTracks,
  SearchStoreState,
  SavedTracksStoreState,
  ModalStoreState,
  IndexedTrack,
} from './types';

export const useStore = create<StoreState>()((set, get) => ({
  title: '',
  setTitle: (value: string) => set({title: value}),

  hstIdx: -1,
  history: [],
  setHistory: (lst: Track[]) => set({history: lst, hstIdx: lst.length - 1}),
  clearHistory: () =>
    set((state: StoreState) => {
      const currentTrack = state.history[state.hstIdx];
      return {
        history: [currentTrack],
        hstIdx: 0,
      };
    }),
  setHstIdx: (value: number) => set({hstIdx: value}),
  appendHistory: (trackObj: Track) =>
    set((state: StoreState) => {
      const currTrack = state.history[state.hstIdx];
      if (currTrack && currTrack.link === trackObj.link) return state;
      return {
        history: [...state.history, trackObj],
        hstIdx: state.history.length,
      };
    }),
  getCurrentTrack: () => {
    const state = get();
    if (state.hstIdx === -1) return {} as Track;
    return state.history[state.hstIdx];
  },

  tracksInQueue: [],
  allOptsTracks: [],
  setTracks: (allOpts: ArtistOpt[]) =>
    set(() => {
      const tracksLst = getAllLinkObjs(allOpts);
      return {allOptsTracks: allOpts, tracksInQueue: tracksLst};
    }),

  setCheckedForAllArtists: (checked: boolean) =>
    set((state: StoreState) => {
      const allOpts = [...state.allOptsTracks];
      for (const artist of allOpts) {
        for (const trackGroup of artist.track_groups) {
          trackGroup.checked = checked;
        }
      }
      const tracksLst = getAllLinkObjs(allOpts);
      return {allOptsTracks: allOpts, tracksInQueue: tracksLst};
    }),
  setCheckedArtist: (artist_name: string, checked: boolean) =>
    set((state: StoreState) => {
      const allOpts = [...state.allOptsTracks];
      for (const artist of allOpts) {
        if (artist.artist_name !== artist_name) continue;
        for (const trackGroup of artist.track_groups) {
          trackGroup.checked = checked;
        }
      }
      const tracksLst = getAllLinkObjs(allOpts);
      return {allOptsTracks: allOpts, tracksInQueue: tracksLst};
    }),
  setCheckedType: (artist_name: string, typeIdx: number, checked: boolean) =>
    set((state: StoreState) => {
      const allOpts = [...state.allOptsTracks];
      for (const artist of allOpts) {
        if (artist.artist_name === artist_name) {
          artist.track_groups[typeIdx].checked = checked;
        }
      }
      const tracksLst = getAllLinkObjs(allOpts);
      return {allOptsTracks: allOpts, tracksInQueue: tracksLst};
    }),

  prevTrack: () =>
    set((state: StoreState) => {
      if (state.history.length === 0) return {history: [state.tracksInQueue[0]], hstIdx: 0};
      if (state.hstIdx === 0) {
        const trackObj = getPrevTrackInLst(state.tracksInQueue, state.history[0]);
        return {
          hstIdx: 0,
          history: [trackObj, ...state.history],
        };
      }
      return {hstIdx: state.hstIdx - 1};
    }),

  nextTrack: () =>
    set((state: StoreState) => {
      if (state.history.length === 0) return {history: [state.tracksInQueue[0]], hstIdx: 0};

      const nextIdx = state.hstIdx + 1;
      if (nextIdx === state.history.length) {
        const trackObj = getNextTrackInLst(state.tracksInQueue, state.history[state.hstIdx]);
        return {
          history: [...state.history, trackObj],
          hstIdx: state.history.length,
        };
      }
      return {hstIdx: nextIdx};
    }),

  shuffle: false,
  setShuffle: (value: boolean) => set({shuffle: value}),

  skipTime: 0,
  setSkipTime: (value: number) => set({skipTime: value}),

  timeToGoTo: 0,
  setTimeToGoTo: (value: number) => set({timeToGoTo: value}),

  playBackSpeed: 1,
  setPlayBackSpeed: (value: number) => set({playBackSpeed: value}),

  paused: true,
  setPaused: (value: boolean) => set({paused: value}),

  indexTracks: {},
  setIndexTracks: (value: IndexedTracks) => set({indexTracks: value}),
  appendIndexObj: (trackObj: IndexedTrack) =>
    set((state: StoreState) => {
      const indexTracks = {...state.indexTracks};
      if (!indexTracks[trackObj.link]) {
        indexTracks[trackObj.link] = [];
      }
      indexTracks[trackObj.link].push(trackObj);
      return {indexTracks};
    }),
}));

export const useSearchStore = create<SearchStoreState>()(set => ({
  searchInput: '',
  setSearchInput: (value: string) => set({searchInput: value}),
}));

export const useSavedTracksStore = create<SavedTracksStoreState>()(set => ({
  localStorageKey: '',
  setLocalStorageKey: (value: string) => set({localStorageKey: value}),
  savedTracks: [],
  setSavedTracks: (value: Track[]) => set({savedTracks: value}),
  appendSavedTrack: (trackObj: Track) =>
    set((state: SavedTracksStoreState) => ({
      savedTracks: [...state.savedTracks, trackObj],
    })),
}));

export const useModalStore = create<ModalStoreState>()(set => ({
  viewHistory: false,
  setViewHistory: (value: boolean) => set({viewHistory: value}),
  showArtists: false,
  setShowArtists: (value: boolean) => set({showArtists: value}),
  viewAllTracks: false,
  setViewAllTracks: (value: boolean) => set({viewAllTracks: value}),
  artistToShowTypesFor: '',
  setArtistToShowTypesFor: (value: string) => set({artistToShowTypesFor: value}),
  typeToShowLinksFor: {artist: '', type: ''},
  setTypeToShowLinksFor: (value: {artist: string; type: string}) => set({typeToShowLinksFor: value}),
}));
