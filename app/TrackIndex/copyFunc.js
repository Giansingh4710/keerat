import { ALL_OPTS as opt1 } from "../Keertan/TimeBasedRaagKeertan/TRACKS.js";
import { ALL_OPTS as opt2 } from "../Keertan/DarbarSahibPuratanKeertanSGPC/TRACKS.js";
import { ALL_OPTS as opt3 } from "../Keertan/AkhandKeertan/TRACKS.js";
import { ALL_OPTS as opt4 } from "../GianiSherSinghJi/TRACKS.js";
import { ALL_OPTS as opt5 } from "../Paath/TRACKS.js";
import { ALL_OPTS as opt6 } from "../MiscellaneousTopics/TRACKS.js";
import { ALL_OPTS as opt7 } from "../RandomRadio/TRACKS.js";
import { ALL_OPTS as opt8 } from "../SantGianiGurbachanSinghJiSGGSKatha/TRACKS.js";
import { ALL_OPTS as opt9 } from "../BhagatJaswantSinghJi/TRACKS.js";
import { ALL_OPTS as opt10 } from "../SantWaryamSinghJi/TRACKS.js";

export function getLinkToKeerat(link, timestampInSecs) {
  const theOpts = [opt1, opt2, opt3, opt4, opt5, opt6, opt7, opt8, opt9, opt10];
  const theFiles = [
    "/Keertan/TimeBasedRaagKeertan",
    "/Keertan/DarbarSahibPuratanKeertanSGPC",
    "/Keertan/AkhandKeertan",
    "/GianiSherSinghJi",
    "/Paath",
    "/MiscellaneousTopics",
    "/RandomRadio",
    "/SantGianiGurbachanSinghJiSGGSKatha",
    "/BhagatJaswantSinghJi",
    "/SantWaryamSinghJi",
  ];

  for (let i = 0; i < theOpts.length; i++) {
    if (linkInOpt(link, theOpts[i])) {
      const localLink = "https://keerat.xyz" + theFiles[i];
      const theUrl = new URL(localLink);
      theUrl.searchParams.append("url", link);
      theUrl.searchParams.append("time", timestampInSecs);
      return theUrl.href;
    }
  }
}

function linkInOpt(link, opts) {
  for (const opt of Object.values(opts)) {
    for (const typee of opt) {
      if (typee.links.some((l) => l === link)) {
        console.log(typee);
        return true;
      }
    }
  }
  return false;
}
