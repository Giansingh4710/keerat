import {create} from 'zustand';
import {
  getNextCheckedType,
  loopIncrement,
  loopDecrement,
  randItemFromArr,
  getTypeNLinkIdx,
  getAllLinkObjs,
} from './helper_funcs';
import {
  TrackOptions,
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
  allOptsTracks: {},
  setTracks: (allOpts: TrackOptions) =>
    set(() => {
      const tracksLst = getAllLinkObjs(allOpts);
      return {allOptsTracks: allOpts, tracksInQueue: tracksLst};
    }),

  setCheckedForAllArtists: (checked: boolean) =>
    set((state: StoreState) => {
      const allOpts = {...state.allOptsTracks};
      for (const artist in allOpts) {
        for (const typeInd in allOpts[artist]) {
          allOpts[artist][typeInd].checked = checked;
        }
      }
      const tracksLst = getAllLinkObjs(allOpts);
      return {allOptsTracks: allOpts, tracksInQueue: tracksLst};
    }),
  setCheckedArtist: (artist: string, checked: boolean) =>
    set((state: StoreState) => {
      const allOpts = {...state.allOptsTracks};
      for (const typeInd in allOpts[artist]) {
        allOpts[artist][typeInd].checked = checked;
      }
      const tracksLst = getAllLinkObjs(allOpts);
      return {allOptsTracks: allOpts, tracksInQueue: tracksLst};
    }),
  setCheckedType: (artist: string, typeIdx: number, checked: boolean) =>
    set((state: StoreState) => {
      const allOpts = {...state.allOptsTracks};
      allOpts[artist][typeIdx].checked = checked;
      const tracksLst = getAllLinkObjs(allOpts);
      return {allOptsTracks: allOpts, tracksInQueue: tracksLst};
    }),

  prevTrack: () =>
    set((state: StoreState) => {
      if (state.history.length === 0) return state;
      if (state.hstIdx === 0) {
        const hist = state.history;
        const allOpts = state.allOptsTracks;
        let artist = hist[state.hstIdx].artist;
        let typeIdx = hist[state.hstIdx].typeIdx;
        let linkIdx = hist[state.hstIdx].linkIdx - 1;

        if (linkIdx === -1 || !allOpts[artist][typeIdx].checked) {
          const allArtists = Object.keys(allOpts);
          const validOpts = [];
          let chosenOptFromValidOpts = 0;
          for (let i = 0; i < allArtists.length; i++) {
            const artist = allArtists[i];
            const types = allOpts[artist];
            for (let j = 0; j < types.length; j++) {
              if (types[j].checked) {
                validOpts.push({typeInd: j, artistInd: i});
                if (artist === artist && j === typeIdx) {
                  chosenOptFromValidOpts = validOpts.length - 1;
                }
              }
            }
          }

          if (validOpts.length === 0) return state;

          const newOpt = validOpts[loopDecrement(validOpts, chosenOptFromValidOpts)];
          typeIdx = newOpt.typeInd;
          const artInd = newOpt.artistInd;
          artist = allArtists[artInd];
          linkIdx = allOpts[artist][typeIdx].links.length - 1;
        }
        const trackObj = {
          artist: artist,
          typeIdx: typeIdx,
          linkIdx: linkIdx,
          type: allOpts[artist][typeIdx].type,
          link: allOpts[artist][typeIdx].links[linkIdx],
        };
        return {
          hstIdx: 0,
          history: [trackObj, ...state.history],
        };
      }
      return {hstIdx: state.hstIdx - 1};
    }),

  nextTrack: () =>
    set((state: StoreState) => {
      const nextIdx = state.hstIdx + 1;
      if (nextIdx !== state.history.length) {
        return {hstIdx: nextIdx};
      }

      let trackObj: Track = {} as Track;
      const allOpts = state.allOptsTracks;
      const artists = Object.keys(allOpts).filter(artist => {
        return allOpts[artist].some(type => type.checked);
      });

      if (artists.length === 0) return state;

      if (state.hstIdx === -1) {
        const firstArtist = artists[0];
        const typeIdx = 0;
        const linkIdx = 0;
        trackObj = {
          artist: firstArtist,
          typeIdx: typeIdx,
          linkIdx: linkIdx,
          type: allOpts[firstArtist][typeIdx].type,
          link: allOpts[firstArtist][typeIdx].links[linkIdx],
        };
      } else if (state.shuffle) {
        trackObj = randItemFromArr(state.tracksInQueue);
      } else {
        const hist = state.history;
        let artist = hist[state.hstIdx].artist;
        let {typeIdx, linkIdx} = getTypeNLinkIdx(allOpts, hist[state.hstIdx]);

        if (allOpts[artist][typeIdx].checked) {
          linkIdx = loopIncrement(allOpts[artist][typeIdx].links, linkIdx);

          if (linkIdx === 0) {
            typeIdx = loopIncrement(allOpts[artist], typeIdx);
            if (typeIdx === 0) {
              const artInd = loopIncrement(artists, artists.indexOf(artist));
              artist = artists[artInd];
            }
          }
        } else {
          linkIdx = 0;
          typeIdx = getNextCheckedType(allOpts[artist], typeIdx);
          if (typeIdx === -1) {
            const artInd = loopIncrement(artists, artists.indexOf(artist));
            artist = artists[artInd];
            typeIdx = 0;
          }
        }
        trackObj = {
          artist: artist,
          typeIdx: typeIdx,
          linkIdx: linkIdx,
          type: allOpts[artist][typeIdx].type,
          link: allOpts[artist][typeIdx].links[linkIdx],
        };
      }
      return {
        history: [...state.history, trackObj],
        hstIdx: state.history.length,
      };
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
