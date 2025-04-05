import {ALL_OPTS as opt1} from '../Keertan/TimeBasedRaagKeertan/TRACKS';
import {ALL_OPTS as opt2} from '../Keertan/DarbarSahibPuratanKeertanSGPC/TRACKS';
import {ALL_OPTS as opt3} from '../Keertan/AkhandKeertan/TRACKS';
import {ALL_OPTS as opt7} from '../Keertan/RandomRadio/TRACKS';

import {ALL_OPTS as opt4} from '../Katha/GianiSherSinghJi/TRACKS';
import {ALL_OPTS as opt6} from '../Katha/MiscellaneousTopics/TRACKS';
import {ALL_OPTS as opt8} from '../Katha/SantGianiGurbachanSinghJiSGGSKatha/TRACKS';
import {ALL_OPTS as opt9} from '../Katha/BhagatJaswantSinghJi/TRACKS';
import {ALL_OPTS as opt10} from '../Katha/SantWaryamSinghJi/TRACKS';

import {ALL_OPTS as opt5} from '../Paath/TRACKS';
import {TrackOptions} from '@/utils/types';

export function getLinkToKeerat(link: string, timestampInSecs: number): string | undefined {
  const theOpts: TrackOptions[] = [opt1, opt2, opt3, opt4, opt5, opt6, opt7, opt8, opt9, opt10];
  const theFiles = [
    '/Keertan/TimeBasedRaagKeertan',
    '/Keertan/DarbarSahibPuratanKeertanSGPC',
    '/Keertan/AkhandKeertan',
    '/Keertan/RandomRadio',

    '/Katha/GianiSherSinghJi',
    '/Katha/MiscellaneousTopics',
    '/Katha/SantGianiGurbachanSinghJiSGGSKatha',
    '/Katha/BhagatJaswantSinghJi',
    '/Katha/SantWaryamSinghJi',

    '/Paath',
  ];

  for (let i = 0; i < theOpts.length; i++) {
    if (linkInOpt(link, theOpts[i])) {
      const localLink = 'https://keerat.xyz' + theFiles[i];
      const theUrl = new URL(localLink);
      theUrl.searchParams.append('url', link);
      theUrl.searchParams.append('time', timestampInSecs.toString());
      return theUrl.href;
    }
  }
  return undefined;
}

function linkInOpt(link: string, opts: TrackOptions): boolean {
  for (const opt of Object.values(opts)) {
    for (const typee of opt) {
      if (typee.links.some(l => l === link)) {
        return true;
      }
    }
  }
  return false;
}
