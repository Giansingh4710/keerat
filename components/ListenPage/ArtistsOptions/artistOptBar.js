import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import { IconButton } from "@mui/material";

export function ArtistOptBar({
  checked,
  title,
  toggleCheckbox,
  rightText,
  onRightTextClick,
}) {
  return (
    <div className="flex border-b border-gray-200 text-xs py-1 px-2  w-full gap-10">
      <IconButton onClick={toggleCheckbox}>
        <div className="flex-1 flex flex-row w-48 text-xs text-white">
          <Checkbox checked={checked} />
          <p>{title}</p>
        </div>
      </IconButton>
      <IconButton
        onClick={() => {
          if (onRightTextClick) {
            onRightTextClick();
          }
        }}
      >
        <div className="flex-1  ">
          <p className="bg-btn text-sm p-1 rounded-lg ">{rightText}</p>
        </div>
      </IconButton>
    </div>
  );
}

function Checkbox({ checked }) {
  const Icon = checked ? MdCheckBox : MdCheckBoxOutlineBlank;
  return <Icon className="basis-9 text-lg" />;
}
