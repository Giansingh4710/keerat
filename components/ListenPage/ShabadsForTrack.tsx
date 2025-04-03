import React, {useEffect, useState} from 'react';
import {useStore} from '@/utils/store';
import {IconButton, Modal} from '@mui/material';
import {getSecondsFromTimeStamp, getDateFromUnixTime} from '@/utils/helper_funcs';

interface ShabadsDisplayProps {
  audioRef: React.RefObject<HTMLAudioElement>;
}

interface DisplayShabadsProps {
  indexLst: any[];
  audioRef: React.RefObject<HTMLAudioElement>;
}

interface DetailsModalProps {
  modalOpen: boolean;
  setModal: (open: boolean) => void;
  indexedObj: any;
}

interface ShabadBoxProps {
  indexData: any;
  audioRef: React.RefObject<HTMLAudioElement>;
  onClick: () => void;
  index: number;
}

interface ShabadDetailsProps {
  shabadArray: string[];
}

export default function ShabadsDisplay({audioRef}: ShabadsDisplayProps): JSX.Element {
  const indexTracks = useStore((state: any) => state.indexTracks);
  const getCurrentTrack = useStore((state: any) => state.getCurrentTrack);
  const hstIdx = useStore((state: any) => state.hstIdx);
  const [indexLst, setIndexLst] = useState<any[]>([]);

  useEffect(() => {
    const currentTrk = getCurrentTrack();
    setIndexLst(indexTracks[currentTrk.link]);
  }, [hstIdx, indexTracks]);

  return (
    <div className="m-3 border-2 border-sky-500 rounded text-white">
      <DisplayShabads indexLst={indexLst} audioRef={audioRef} />
    </div>
  );
}

function DisplayShabads({indexLst, audioRef}: DisplayShabadsProps): JSX.Element {
  const [modalOpen, setModal] = useState(false);
  const [indexedObj, setIndexedObj] = useState<any>({});

  if (!indexLst) {
    return <></>;
  }
  return (
    <div>
      <h1 className="border-b">{indexLst.length}: Indexed Shabads</h1>
      <div className="overflow-y-auto h-48">
        {indexLst.map((indexData, i) => {
          return (
            <ShabadBox
              key={i}
              index={i}
              indexData={indexData}
              audioRef={audioRef}
              onClick={() => {
                setIndexedObj(indexData);
                setModal(true);
              }}
            />
          );
        })}
      </div>
      <DetailsModal modalOpen={modalOpen} setModal={setModal} indexedObj={indexedObj} />
    </div>
  );
}

function DetailsModal({modalOpen, setModal, indexedObj}: DetailsModalProps): JSX.Element {
  const {created, type, artist, timestamp, shabadID, shabadArr, description} = indexedObj;
  return (
    <Modal open={modalOpen} onClose={() => setModal(false)}>
      <div className="w-[90vw] p-1 bg-primary-100 text-white p-8 rounded-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4">
        <div className="flex flex-col">
          <p className="flex">Created: {getDateFromUnixTime(created)}</p>
          <p className="flex">Type: {type}</p>
          <p className="flex">Artist: {artist}</p>
          <p className="flex">Timestamp: {timestamp}</p>
          <div className="flex flex-col">
            <p className="flex">Description: </p>
            <div className="flex h-[20vh] overflow-auto border-2 border-sky-500 rounded ">
              {description ? description : 'N/A'}
            </div>
          </div>
        </div>
        <div className="h-[20vh] my-5 p-2  overflow-auto border-2 border-sky-500 rounded">
          <p className="flex">Shabad ID: {shabadID ? shabadID : 'N/A'}</p>
          <ShabadDetails shabadArray={shabadArr} />
        </div>

        <IconButton onClick={() => setModal(false)}>
          <p className="text-sm p-1 bg-red-500 text-white rounded-lg">Close</p>
        </IconButton>
      </div>
    </Modal>
  );
}

function ShabadBox({indexData, audioRef, onClick, index}: ShabadBoxProps): JSX.Element {
  const {created, type, artist, timestamp, shabadID, shabadArr, description, link} = indexData;

  return (
    <div className="flex flex-col rounded-md w-full border-b border-gray-200  text-xl p-2 ">
      <div className="flex w-full text-sm">
        <p className="pr-2">{index + 1}.</p>
        <p className="underline flex-1 text-left w-5/6 truncate break-words" onClick={onClick}>
          {description}
        </p>
      </div>
      <div className="text-left flex flex-row w-full text-xs">
        <div
          className="underline text-xs text-right truncate break-words"
          onClick={() => {
            if (audioRef.current) {
              audioRef.current.currentTime = getSecondsFromTimeStamp(timestamp);
            }
          }}>
          {timestamp}
        </div>
      </div>
    </div>
  );
}

function ShabadDetails({shabadArray}: ShabadDetailsProps): JSX.Element {
  const gurbaniStyle = {
    gurmukhi: {
      fontSize: '1rem',
      padding: '0',
      margin: '0',
    },
    roman: {
      fontSize: '0.5rem',
      padding: '0',
      margin: '0',
    },
    trans: {
      fontSize: '0.7rem',
      padding: '0',
      margin: '0',
    },
  };

  if (!shabadArray) return <></>;
  if (shabadArray.length === 0) return <></>;
  const lst = shabadArray.map((line, ind) => {
    let style;
    if (ind % 3 === 0) {
      style = gurbaniStyle.gurmukhi;
    } else if (ind % 3 === 1) {
      style = gurbaniStyle.roman;
    } else {
      style = gurbaniStyle.trans;
    }
    return (
      <p style={style} key={ind}>
        {line}
      </p>
    );
  });
  return <>{lst}</>;
}
