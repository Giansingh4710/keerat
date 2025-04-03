import {useState, useEffect, useRef} from 'react';
import toast from 'react-hot-toast';
import {Info, Album, Person, HighlightOff, FlipCameraAndroid, Delete} from '@mui/icons-material';
import {IconButton, Modal, Tooltip} from '@mui/material';
import {MdCheckBox, MdCheckBoxOutlineBlank} from 'react-icons/md';

import {ArtistOptBar} from './artistOptBar';
import {useStore, useModalStore} from '@/utils/store';
import {getNameOfTrack} from '@/utils/helper_funcs';
import {isChecked, trackCount, getRatio} from '@/utils/helper_funcs';
import {StoreState, ModalStoreState} from '@/utils/types';

interface HistoryItem {
  link: string;
  artist: string;
  type: string;
}

interface TrackObject {
  link: string;
  artist: string;
  type: string;
  description?: string;
  shabadArr?: string[];
}

interface TypeToShowLinksFor {
  type: string;
  artist: string;
}

export function ViewHistoryModal(): JSX.Element {
  const history = useStore((state: any) => state.history);
  const clearHistory = useStore((state: any) => state.clearHistory);
  const setHstIdx = useStore((state: any) => state.setHstIdx);
  const modalOpen = useModalStore((state: any) => state.viewHistory);
  const setModal = useModalStore((state: any) => state.setViewHistory);

  function TheLst(): JSX.Element[] {
    const lst = [];
    for (let i = history.length - 1; i > -1; i--) {
      const link = history[i].link;
      lst.push(
        <button
          className="text-left border-b border-solid border-white break-all"
          key={i}
          onClick={() => {
            setModal(false);
            setHstIdx(i);
          }}>
          {getNameOfTrack(link)}
        </button>,
      );
    }
    return lst;
  }

  return (
    <Modal open={modalOpen} onClose={() => setModal(false)}>
      <div className=" w-screen flex items-center overflow-y-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="m-10 flex-1 bg-primary-100  rounded-lg border border-solid border-white ">
          <div className=" text-white flex p-2 border-b border-solid border-white  ">
            <p className="flex-1 text-left text-2xl font-bold">History: {history.length} Tracks</p>
            <div>
              <IconButton onClick={() => setModal(false)}>
                <div className="text-white flex-1 flex">
                  <HighlightOff />
                </div>
              </IconButton>
            </div>
          </div>
          <div className="flex flex-col p-2 flex-auto max-h-48 overflow-auto text-white">
            <TheLst />
          </div>
          <div>
            <IconButton onClick={() => clearHistory()}>
              <p className="text-sm p-1 bg-red-500 text-white rounded-lg">
                <Delete />
                Delete History
              </p>
            </IconButton>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export function ListOfArtistsModal(): JSX.Element {
  const allOpts = useStore(state => state.allOptsTracks);
  const setCheckedArtist = useStore(state => state.setCheckedArtist);
  const title = useStore(state => state.title);
  const setCheckedForAllArtists = useStore(state => state.setCheckedForAllArtists);

  const setArtistToShowTypesFor = useModalStore(state => state.setArtistToShowTypesFor);

  const modalOpen = useModalStore(state => state.showArtists);
  const setModal = useModalStore(state => state.setShowArtists);

  const numOfTracks = trackCount(allOpts);

  const optionsDivRef = useRef<HTMLDivElement>(null);
  const scrollTo = useRef(0);

  useEffect(() => {
    if (scrollTo.current !== 0 && optionsDivRef.current) {
      optionsDivRef.current.scrollTop = scrollTo.current;
    }

    toast.success(`Total Tracks in Queue: ${numOfTracks}`, {
      duration: 1000,
    });

    const checkedTypes: Record<string, string[]> = {};
    Object.keys(allOpts).forEach(artist => {
      const lstOftypes: string[] = [];
      allOpts[artist].forEach(linksType => {
        if (linksType.checked) {
          lstOftypes.push(linksType.type);
        }
      });
      if (lstOftypes.length > 0) checkedTypes[artist] = lstOftypes;
    });

    localStorage.setItem(`Checked: ${title}`, JSON.stringify(checkedTypes));
  }, [allOpts]);

  return (
    <Modal open={modalOpen} onClose={() => setModal(false)}>
      <div className=" w-screen flex items-center overflow-y-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className=" m-10 flex-1 bg-primary-200  rounded-lg border border-solid border-white ">
          <div className="flex-1 flex gap-1">
            <p className="flex-1 align-baseline text-lg">Total Tracks in Queue: {numOfTracks}</p>
            <div className="flex-5">
              <IconButton onClick={() => setModal(false)}>
                <HighlightOff />
              </IconButton>
            </div>
          </div>

          <div ref={optionsDivRef} className="bg-secondary-200 h-72 overflow-auto text-white">
            {Object.keys(allOpts).map(artist => {
              const checked = isChecked(allOpts, artist);
              const artistTracks = allOpts[artist];
              const ratio = getRatio(artistTracks);
              return (
                <ArtistOptBar
                  key={artist}
                  checked={checked}
                  title={artist}
                  toggleCheckbox={() => {
                    toast.success(`${checked ? 'Un' : ''}selected: ${artist}`);
                    setCheckedArtist(artist, !checked);
                  }}
                  rightText={ratio}
                  onRightTextClick={() => {
                    setArtistToShowTypesFor(artist);
                  }}
                />
              );
            })}
          </div>

          <div className="flex">
            <IconButton onClick={() => setCheckedForAllArtists(true)}>
              <div className="flex bg-btn text-black p-1 items-center justify-center gap-1 font-bold text-sm rounded-lg">
                <MdCheckBox className="" />
                <p className="flex-1">Select All</p>
              </div>
            </IconButton>
            <IconButton onClick={() => setCheckedForAllArtists(false)}>
              <div className="flex bg-btn text-black p-1 items-center justify-center gap-1 font-bold text-sm rounded-lg">
                <MdCheckBoxOutlineBlank className="" />
                <p className="flex-1">Unselect All</p>
              </div>
            </IconButton>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export function ListOfTypesModal(): JSX.Element | null {
  const setCheckedType = useStore((state: any) => state.setCheckedType);
  const setCheckedArtist = useStore((state: any) => state.setCheckedArtist);
  const allOpts = useStore((state: any) => state.allOptsTracks);

  const artistToShowTypesFor = useModalStore((state: any) => state.artistToShowTypesFor);
  const setArtistToShowTypesFor = useModalStore((state: any) => state.setArtistToShowTypesFor);
  const setTypeToShowLinksFor = useModalStore((state: any) => state.setTypeToShowLinksFor);

  if (artistToShowTypesFor === '') return null;
  const tracksLst = allOpts[artistToShowTypesFor];

  return (
    <Modal open={true} onClose={() => setArtistToShowTypesFor('')}>
      <div className=" w-screen flex items-center overflow-y-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className=" m-10 flex-1 bg-primary-100  rounded-lg border border-solid border-white ">
          <div className=" text-white flex p-2 border-b border-solid border-white  ">
            <p className="flex-1 text-left text-2xl font-bold">{artistToShowTypesFor}</p>
            <IconButton onClick={() => setArtistToShowTypesFor('')}>
              <div className="text-white flex-1 flex">
                <HighlightOff />
              </div>
            </IconButton>
          </div>
          <div className="relative p-2 flex-auto max-h-48 overflow-auto text-white">
            {tracksLst.map((obj: any, idx: number) => {
              const typeName = obj.type;
              const checked = obj.checked;
              const linksLen = obj.links.length;
              const ratio = `${checked ? linksLen : 0}/${linksLen}`;
              return (
                <ArtistOptBar
                  key={typeName}
                  checked={checked}
                  title={typeName}
                  toggleCheckbox={() => setCheckedType(artistToShowTypesFor, idx, !checked)}
                  rightText={ratio}
                  onRightTextClick={() => {
                    setTypeToShowLinksFor({
                      type: typeName,
                      artist: artistToShowTypesFor,
                    });
                  }}
                />
              );
            })}
          </div>
          <p className="border-t border-white rounded-b font-semibold flex-1 text-white  p-1">
            Tracks Selected: {getRatio(tracksLst)}
          </p>
          <div className="flex items-center justify-end p-2 text-sm justify-evenly">
            <button
              className="text-red-500 active:bg-red-500 border rounded font-bold uppercase p-1"
              type="button"
              onClick={() => setCheckedArtist(artistToShowTypesFor, false)}>
              Unslect All
            </button>
            <button
              className="bg-emerald-500 text-white active:bg-emerald-600  rounded font-bold uppercase p-1"
              type="button"
              onClick={() => setCheckedArtist(artistToShowTypesFor, true)}>
              Select All
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export function ListOfTracksByType(): JSX.Element | null {
  const allOpts = useStore((state: any) => state.allOptsTracks);
  const appendHistory = useStore((state: any) => state.appendHistory);

  const typeToShowLinksFor = useModalStore((state: any) => state.typeToShowLinksFor);
  const {artist, type} = typeToShowLinksFor;
  const setTypeToShowLinksFor = useModalStore((state: any) => state.setTypeToShowLinksFor);
  const [tracksObj, setTracksObj] = useState<string[]>();

  const typeIdx = allOpts[artist]?.findIndex((obj: any) => obj.type === type);

  useEffect(() => {
    if (artist === '' || type === '') return;
    setTracksObj(allOpts[artist][typeIdx].links);
  }, [typeToShowLinksFor]);

  if (type === '') return null;
  const closeModal = () => setTypeToShowLinksFor({artist, type: ''});
  return (
    <Modal open={true} onClose={() => closeModal()}>
      <div className="flex items-center overflow-y-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className=" w-screen m-10 flex-1 bg-primary-100  rounded-lg border border-solid border-white ">
          <div className=" text-white flex p-2 border-b border-solid border-white  ">
            <p className="flex-1 text-left text-2xl font-bold">
              {artist}: {type}
            </p>
            <div>
              <IconButton
                className="h-10 w-10 "
                onClick={() => {
                  const newRes = [...tracksObj!.reverse()];
                  setTracksObj(newRes);
                }}>
                <FlipCameraAndroid className="text-white" />
              </IconButton>
              <IconButton onClick={() => closeModal()}>
                <div className="text-white flex-1 flex">
                  <HighlightOff />
                </div>
              </IconButton>
            </div>
          </div>
          <div className="flex flex-col p-2 flex-auto max-h-48 overflow-auto text-white">
            {tracksObj?.map((link, idx) => {
              const trkObj = {link, artist, type, typeIdx, linkIdx: idx};
              return (
                <button
                  className="text-left border-b border-solid border-white"
                  key={idx}
                  onClick={() => {
                    appendHistory(trkObj);
                  }}>
                  {getNameOfTrack(link)}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export function ViewTracksInQueueModal(): JSX.Element {
  const tracksInQueue = useStore((state: any) => state.tracksInQueue);
  const appendHistory = useStore((state: any) => state.appendHistory);
  const modalOpen = useModalStore((state: any) => state.viewAllTracks);
  const setModal = useModalStore((state: any) => state.setViewAllTracks);
  const [results, setResults] = useState<TrackObject[]>([]);

  useEffect(() => {
    setResults(tracksInQueue);
  }, [tracksInQueue]);

  function TheLst(): JSX.Element[] {
    return results.map((trkObj, index) => {
      return (
        <button
          key={index}
          onClick={() => appendHistory(trkObj)}
          className="flex flex-col w-full rounded-md w-full border-b border-gray-200 hover:bg-blue-100  text-xl p-2 ">
          <div className="flex text-sm w-full">
            <p className="pr-2">{index + 1}.</p>
            <div className="basis-5/6 text-xs text-left truncate break-words ">{getNameOfTrack(trkObj.link)}</div>
          </div>
          <div className="flex flex-row w-full text-xs">
            <div className="basis-3/4 text-xs text-left w-full">
              <Person className="p-1" />
              {trkObj.artist}
            </div>
            <div className="basis-1/4 text-xs text-right truncate break-words">
              <Album className="p-1" />
              {trkObj.type}
            </div>
          </div>
        </button>
      );
    });
  }

  return (
    <Modal open={modalOpen} onClose={() => setModal(false)}>
      <div className=" w-screen flex items-center overflow-y-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-[80%] m-10 flex-1 bg-primary-100  rounded-lg border border-solid border-white ">
          <div className=" text-white flex border-b border-solid border-white  ">
            <div className="flex-1 flex flex-row gap-2 justify-center p-1 ">
              <Tooltip title="These are all the tracks from the Checked Options. Tracks that aren't checked won't be here. You can check and uncheck the type of tracks in Track Options">
                <Info className="text-xs" />
              </Tooltip>
              <p className="">{results.length} Results Found</p>
            </div>
            <div className="">
              <IconButton
                className="h-10 w-10 "
                onClick={() => {
                  const newRes = [...results.reverse()];
                  setResults(newRes);
                }}>
                <FlipCameraAndroid className="text-white" />
              </IconButton>
              <IconButton onClick={() => setModal(false)}>
                <div className="text-white flex-1 flex">
                  <HighlightOff />
                </div>
              </IconButton>
            </div>
          </div>
          <div className="flex flex-col p-2 flex-auto max-h-48 overflow-x-hidden text-white">
            <TheLst />
          </div>
        </div>
      </div>
    </Modal>
  );
}
