import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";

export function ArtistOptBar({
  checked,
  title,
  toggleCheckbox,
  rightText,
  onRightTextClick,
}) {
  return (
    <div className="flex border-b border-gray-200 text-xs py-1 px-2 ">
      <div onClick={toggleCheckbox} className="flex-1 flex flex-row">
        <div className="">
          <Checkbox checked={checked} />
        </div>
        <p className="px-1 py-1 text-left">{title}</p>
      </div>
      <div>
        <button
          // onClick={openModal}
          onClick={() => {
            if (onRightTextClick) {
              onRightTextClick();
            }
          }}
          className="bg-btn place-content-center font-bold rounded p-1"
        >
          <p className="flex-1 text-right">{rightText}</p>
        </button>
      </div>
    </div>
  );
}

function Checkbox({ checked }) {
  const Icon = checked ? MdCheckBox : MdCheckBoxOutlineBlank;
  return <Icon className="basis-9 text-lg" />;
}
