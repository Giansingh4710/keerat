import { IconButton } from "@mui/material";
import React, { Children, useState } from "react";

function titleFromLink(link) {
  const lst = link.split("/");
  const lastPart = lst[lst.length - 1]
    ? lst[lst.length - 1]
    : lst[lst.length - 2];
  const firstChar = lastPart[0].toUpperCase();
  const idxWhereNewWord = [];
  for (let i = 1; i < lastPart.length; i++) {
    if (lastPart[i] === lastPart[i].toUpperCase()) {
      idxWhereNewWord.push(i);
    }
  }

  let finalTitle = firstChar + lastPart.slice(1, idxWhereNewWord[0]) + " ";
  for (let i = 0; i < idxWhereNewWord.length; i++) {
    const theIdx = idxWhereNewWord[i];
    let nextIdx = idxWhereNewWord[i + 1];
    if (i === idxWhereNewWord.length - 1) {
      nextIdx = lastPart.length;
    }
    const theWord = lastPart.slice(theIdx, nextIdx) + " ";
    finalTitle += theWord;
  }

  return finalTitle;
}

function LinkTag({ href, absLink }) {
  const hrefToLink = href ? href : absLink;
  const displayText = titleFromLink(hrefToLink);

  return (
    <IconButton>
      <a
        href={hrefToLink}
        className=" text-white text-xs underline "
      >
        {displayText}
      </a>
    </IconButton>
  );
}

function LeftHome({ main }) {
  if (main) {
    return (
      <a href={"/"} className="p-2 rounded-l  bg-primary-200  underline ">
        Home
      </a>
    );
  }
  return <></>;
}

function BarRow({ name, main, children }) {
  const [showChildren, setShowChildren] = useState(false);

  function TheChildern() {
    if (showChildren === false || children === undefined) {
      return <></>;
    }

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#333",
          alignItems: "flex-start",
        }}
      >
        {Children.map(children, (childAtag) => {
          return (
            <div
              style={{
                flex: 1,
                width: "97%",
                display: "flex",
                paddingLeft: "10px",
              }}
            >
              {childAtag}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="w-full border border-gray-200 rounded">
      <div className="flex h-10 bg-gray-800">
        <LeftHome main={main} />
        <h1 className="flex-1 flex items-center justify-center text-white">{name}</h1>
        <button
          className="flex-1 bg-primary-200 rounded  max-w-10"
          onClick={() => setShowChildren(!showChildren)}
        >
          <p className="text-3xl"> ☰ </p>
        </button>
      </div>
      <TheChildern />
    </div>
  );
}

export default function NavBar({ title }) {
  return (
    <nav>
      <BarRow name={title} main={true}>
        <BarRow name={"Keertan"}>
          <LinkTag href="/Keertan/AkhandKeertan" />
          <LinkTag href="/Keertan/DarbarSahibPuratanKeertanSGPC" />
          <LinkTag href="/Keertan/TimeBasedRaagKeertan" />
          <LinkTag href="/Keertan/AllKeertan" />
        </BarRow>
        <LinkTag href="/Paath/" />
        <LinkTag href="/SantGianiGurbachanSinghJiSGGSKatha/" />
        <LinkTag href="/BhagatJaswantSinghJi/" />
        <LinkTag href="/GianiSherSinghJi/" />
        <LinkTag href="/MiscellaneousTopics" />
        <LinkTag href="/RimmyRadio" />
        <LinkTag href="/TrackIndex" />
        {/* 
          <LinkTag absLink="http://45.76.2.28/trackIndex" />
        */}
      </BarRow>
    </nav>
  );
}
