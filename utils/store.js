import { create } from 'zustand'
import {
  getRandomKey,
  loopIncrement,
  randIdx,
  randItemFromArr,
} from './helper_funcs'

export const useStore = create((set) => ({
  hstIdx: -1,
  history: [],
  setHistory: (value) => set({ history: value }),

  allOptsTracks: {},
  setTracks: (value) => set({ allOptsTracks: value }),

  setCheckedArtist: (artist,checked) =>
    set((state) => {
      const allOpts = state.allOptsTracks
      for(const typeInd in allOpts[artist]){
        allOpts[artist][typeInd].checked = checked
      }
      set({ allOptsTracks: allOpts })
    }),

  prevTrack: () =>
    set((state) => {
      if (state.history.length === 0) return {}
      if (state.hstIdx === 0) {
        const hist = state.history
        const allOpts = state.allOptsTracks
        let artist = hist[state.hstIdx].artist
        let typeIdx = hist[state.hstIdx].typeIdx
        let linkIdx = hist[state.hstIdx].linkIdx - 1
        const artists = Object.keys(allOpts)

        if (linkIdx === -1) {
          typeIdx -= 1
          if (typeIdx === -1) {
            let artInd = artists.indexOf(artist) - 1
            artInd = artInd === -1 ? artists.length - 1 : artInd
            artist = artists[artInd]
            typeIdx = allOpts[artist].length - 1
          }
          linkIdx = allOpts[artist][typeIdx].links.length - 1
        }
        const value = {
          artist: artist,
          typeIdx: typeIdx,
          linkIdx: linkIdx,

          type: allOpts[artist][typeIdx].type,
          link: allOpts[artist][typeIdx].links[linkIdx],
        }
        return {
          hstIdx: 0,
          history: [value, ...state.history],
        }
      }
      return { hstIdx: state.hstIdx - 1 }
    }),

  nextTrack: () =>
    set((state) => {
      const nextIdx = state.hstIdx + 1
      if (nextIdx !== state.history.length) {
        return { hstIdx: nextIdx } // if not at end of history
      }

      let value = {}
      const allOpts = state.allOptsTracks
      const artists = Object.keys(allOpts)

      if (state.hstIdx === -1) {
        const firstArtist = artists[0]
        const typeIdx = 0
        const linkIdx = 0
        value = {
          artist: firstArtist,
          typeIdx: typeIdx,
          linkIdx: linkIdx,

          type: allOpts[firstArtist][typeIdx].type,
          link: allOpts[firstArtist][typeIdx].links[linkIdx],
        }
      } else if (state.shuffle) {
        const randArtist = getRandomKey(allOpts)
        const randTypeIdx = randIdx(allOpts[randArtist])
        const randType = allOpts[randArtist][randTypeIdx].type
        const randLinkIdx = randIdx(allOpts[randArtist][randTypeIdx].links)
        value = {
          artist: randArtist,
          typeIdx: randTypeIdx,
          linkIdx: randLinkIdx,

          type: randType,
          link: allOpts[randArtist][randTypeIdx].links[randLinkIdx],
        }
      } else {
        const hist = state.history
        let artist = hist[state.hstIdx].artist
        let typeIdx = hist[state.hstIdx].typeIdx
        let linkIdx = loopIncrement(
          allOpts[artist][typeIdx].links,
          hist[state.hstIdx].linkIdx,
        )

        if (linkIdx === 0) {
          typeIdx = loopIncrement(allOpts[artist], typeIdx)
          if (typeIdx === 0) {
            const artInd = loopIncrement(artists, artists.indexOf(artist))
            artist = artists[artInd]
          }
        }
        value = {
          artist: artist,
          typeIdx: typeIdx,
          linkIdx: linkIdx,

          type: allOpts[artist][typeIdx].type,
          link: allOpts[artist][typeIdx].links[linkIdx],
        }
      }

      return {
        hstIdx: state.history.length,
        history: [...state.history, value],
      }
    }),

  shuffle: false,
  setShuffle: (value) => set({ shuffle: value }),
}))
