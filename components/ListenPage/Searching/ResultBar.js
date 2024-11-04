export default function ResultBar({onClick, liNum, title, bottomLeftTxt, bottomRightTxt}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col rounded-md w-full border-b border-gray-200 hover:bg-blue-100  text-xl p-2 ">
      <div className="flex w-full text-sm">
        {/* <p className="pl-2 pr-2">{index + 1}.</p> */}
        <p className="pl-2 pr-2">{liNum}.</p>
        <p className="flex-1 text-left w-5/6 truncate break-words">{title}</p>
      </div>
      <div className="flex flex-row w-full text-xs">
        <div className="basis-3/4 text-xs text-left w-full">
          {/* <PersonIcon className="p-1" /> */}
          {bottomLeftTxt}
        </div>
        <div className="basis-1/4 text-xs text-right truncate break-words">
          {/* <AlbumIcon className="p-1" /> */}
          {bottomRightTxt}
        </div>
      </div>
    </button>
  );
}
