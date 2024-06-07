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
    <div className="flex justify-start items-center border-b border-gray-200">
      <Checkbox checked={checked} />
      <IconButton onClick={toggleCheckbox}>
        <p className="flex-1 text-xs text-white">{title}</p>
      </IconButton>
      <IconButton
        onClick={() => {
          if (onRightTextClick) {
            onRightTextClick();
          }
        }}
      >
        <div className="">
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
