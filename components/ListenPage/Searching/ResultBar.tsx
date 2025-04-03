interface ResultBarProps {
  onClick: () => void;
  liNum: number;
  title: string;
  bottomLeftTxt: string;
  bottomRightTxt?: string;
}

export default function ResultBar({onClick, liNum, title, bottomLeftTxt, bottomRightTxt}: ResultBarProps): JSX.Element {
  return (
    <button
      onClick={onClick}
      className="flex flex-col rounded-md w-full border-b border-gray-200 hover:bg-blue-100  text-xl p-2 ">
      <div className="flex w-full text-sm">
        <p className="pl-2 pr-2">{liNum}.</p>
        <p className="flex-1 text-left w-5/6 truncate break-words">{title}</p>
      </div>
      <div className="flex flex-row w-full text-xs">
        <div className="basis-3/4 text-xs text-left w-full">{bottomLeftTxt}</div>
        <div className="basis-1/4 text-xs text-right truncate break-words">{bottomRightTxt}</div>
      </div>
    </button>
  );
}
