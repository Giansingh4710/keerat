import { create } from "zustand";
import {
  getNextCheckedType,
  loopIncrement,
  loopDecrement,
  randItemFromArr,
  getTypeNLinkIdx,
  getAllLinkObjs,
} from "./helper_funcs.js";

export const useStore = create((set) => ({
  title: "",
  setTitle: (value) => set({ title: value }),

  hstIdx: -1,
  history: [],
  setHistory: (lst) => set({ history: lst, hstIdx: lst.length - 1 }),
  clearHistory: () =>
    set((state) => {
      const currentTrack = state.history[state.hstIdx];
      return {
        history: [currentTrack],
        hstIdx: 0,
      };
    }),
  setHstIdx: (value) => set({ hstIdx: value }),
  appendHistory: (trackObj) =>
    set((state) => {
      const currTrack = state.history[state.hstIdx];
      if (currTrack && currTrack.link === trackObj.link) return {};
      // trackObj = {artist, typeIdx, linkIdx, type, link}

      return {
        history: [...state.history, trackObj],
        hstIdx: state.history.length,
      };
    }),
  getCurrentTrack: () => {
    const state = useStore.getState();
    if (state.hstIdx === -1) return {};
    return state.history[state.hstIdx];
  },

  tracksInQueue: [],
  allOptsTracks: {},
  setTracks: (allOpts) =>
    set(() => {
      const tracksLst = getAllLinkObjs(allOpts);
      return { allOptsTracks: allOpts, tracksInQueue: tracksLst };
    }),

  setCheckedForAllArtists: (checked) =>
    set((state) => {
      const allOpts = { ...state.allOptsTracks };
      for (const artist in allOpts) {
        for (const typeInd in allOpts[artist]) {
          allOpts[artist][typeInd].checked = checked;
        }
      }
      const tracksLst = getAllLinkObjs(allOpts);
      return { allOptsTracks: allOpts, tracksInQueue: tracksLst };
    }),
  setCheckedArtist: (artist, checked) =>
    set((state) => {
      const allOpts = { ...state.allOptsTracks }; // to change address and make new obj so it can rerender
      for (const typeInd in allOpts[artist]) {
        allOpts[artist][typeInd].checked = checked;
      }
      const tracksLst = getAllLinkObjs(allOpts);
      return { allOptsTracks: allOpts, tracksInQueue: tracksLst };
    }),
  setCheckedType: (artist, typeIdx, checked) =>
    set((state) => {
      const allOpts = { ...state.allOptsTracks };
      allOpts[artist][typeIdx].checked = checked;
      const tracksLst = getAllLinkObjs(allOpts);
      return { allOptsTracks: allOpts, tracksInQueue: tracksLst };
    }),

  prevTrack: () =>
    set((state) => {
      if (state.history.length === 0) return {};
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
                validOpts.push({ typeInd: j, artistInd: i });
                if (artist === artist && j === typeIdx) {
                  // if we never get to this, default is 0
                  chosenOptFromValidOpts = validOpts.length - 1;
                }
              }
            }
          }

          if (validOpts.length === 0) return {};

          const newOpt =
            validOpts[loopDecrement(validOpts, chosenOptFromValidOpts)];
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
      return { hstIdx: state.hstIdx - 1 };
    }),

  nextTrack: () =>
    set((state) => {
      const nextIdx = state.hstIdx + 1;
      if (nextIdx !== state.history.length) {
        return { hstIdx: nextIdx }; // if not at end of history
      }

      let trackObj = {};
      const allOpts = state.allOptsTracks;
      const artists = Object.keys(allOpts).filter((artist) => {
        return allOpts[artist].some((type) => type.checked);
      });

      if (artists.length === 0) return {};

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
        console.log(hist[state.hstIdx]);
        let { typeIdx, linkIdx } = getTypeNLinkIdx(allOpts, hist[state.hstIdx]);

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
            // will happend when listening to artist and uncheck that artist
            const artInd = loopIncrement(
              artists,
              artists.indexOf(artist),
              allOpts,
            );
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
        hstIdx: state.history.length,
        history: [...state.history, trackObj],
      };
    }),

  shuffle: false,
  setShuffle: (value) => set({ shuffle: value }),

  skipTime: 10,
  setSkipTime: (value) => set({ skipTime: value }),

  timeToGoTo: 0,
  setTimeToGoTo: (value) => set({ timeToGoTo: value }),

  playBackSpeed: 1,
  setPlayBackSpeed: (value) => set({ playBackSpeed: value }),

  paused: true,
  setPaused: (value) => set({ paused: value }),

  indexTracks: {},
  setIndexTracks: (value) => set({ indexTracks: value }),
  appendIndexObj: (trackObj) =>
    set((state) => {
      if (state.indexTracks[trackObj.link] === undefined)
        state.indexTracks[trackObj.link] = [];
      state.indexTracks[trackObj.link].push(trackObj);
      const newObj = { ...state.indexTracks };
      return { indexTracks: newObj };
    }),
}));

export const useSearchStore = create((set) => ({
  searchInput: "",
  setSearchInput: (value) => set({ searchInput: value }),
}));

export const useSavedTracksStore = create((set) => ({
  localStorageKey: "",
  setLocalStorageKey: (value) => set({ localStorageKey: value }),

  savedTracks: [],
  setSavedTracks: (value) => set({ savedTracks: value }),
  appendSavedTrack: (trackObj) =>
    set((state) => {
      const newLst = [...state.savedTracks, trackObj];
      if (typeof localStorage !== "undefined")
        localStorage.setItem(state.localStorageKey, JSON.stringify(newLst));
      return { savedTracks: newLst };
    }),
  deleteFromSavedTracks: (index) =>
    set((state) => {
      const newLst = state.savedTracks.filter((_, idx) => idx !== index);
      localStorage.setItem(state.localStorageKey, JSON.stringify(newLst));
      return {
        savedTracks: newLst,
      };
    }),

  modalOpened: false,
  setModalOpened: (value) => set({ modalOpened: value }),

  showTracks: false,
  setShowing: (value) => set({ showTracks: value }),

  note: "",
  setNote: (value) => set({ note: value }),
}));

export const useModalStore = create((set) => ({
  viewHistory: false,
  setViewHistory: (value) => set({ viewHistory: value }),

  viewAllTracks: false,
  setViewAllTracks: (value) => set({ viewAllTracks: value }),

  showArtists: false,
  setShowArtists: (value) => set({ showArtists: value }),

  artistToShowTypesFor: "", // "", [artist]
  setArtistToShowTypesFor: (value) => set({ artistToShowTypesFor: value }),

  typeToShowLinksFor: { artist: "", type: "" },
  setTypeToShowLinksFor: (value) => set({ typeToShowLinksFor: value }),
}));
