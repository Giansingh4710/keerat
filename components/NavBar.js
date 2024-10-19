import React, { useState } from "react";
import { IconButton, Menu, MenuItem, Popover } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import HomeIcon from "@mui/icons-material/Home";

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

function LinkTag({ href, absLink, children }) {
  const hrefToLink = href || absLink;
  const displayText = titleFromLink(hrefToLink);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    if (children) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="relative">
      <a
        href={children ? "#" : hrefToLink}
        onClick={handleClick}
        className="text-primary-100 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out flex items-center"
      >
        {displayText}
        {children && <ArrowDropDownIcon />}
      </a>
      {children && (
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <div className="py-1 bg-white">
            {React.Children.map(children, (child) => (
              <MenuItem onClick={handleClose}>{child}</MenuItem>
            ))}
          </div>
        </Popover>
      )}
    </div>
  );
}

function NavMenu({ children }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={handleClick}
        className="text-primary-100 "
      >
        <MenuIcon className="text-primary-100" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {children}
      </Menu>
    </>
  );
}

export default function NavBar({ title }) {
  const Links = () => (
    <>
      <LinkTag href="/Keertan/">
        <LinkTag href="/Keertan/AkhandKeertan" />
        <LinkTag href="/Keertan/DarbarSahibPuratanKeertanSGPC" />
        <LinkTag href="/Keertan/TimeBasedRaagKeertan" />
        <LinkTag href="/Keertan/RandomRadio" />
        <LinkTag href="/Keertan/AllKeertan" />
      </LinkTag>
      <LinkTag href="/Katha/">
        <LinkTag href="/Katha/BhagatJaswantSinghJi/" />
        <LinkTag href="/Katha/GianiSherSinghJi/" />
        <LinkTag href="/Katha/MiscellaneousTopics" />
        <LinkTag href="/Katha/SantGianiGurbachanSinghJiSGGSKatha/" />
        <LinkTag href="/Katha/SantWaryamSinghJi/" />
      </LinkTag>
      <LinkTag href="/Paath/" />
      <LinkTag href="/TrackIndex" />
    </>
  );

  return (
    <nav className="bg-primary-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <a href="/" className="text-primary-100 ">
              <HomeIcon />
            </a>
            <span className="text-primary-100 font-bold text-xl">
              {title}
            </span>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Links />
            </div>
          </div>
          <div className="md:hidden">
            <NavMenu>
              <Links />
            </NavMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
