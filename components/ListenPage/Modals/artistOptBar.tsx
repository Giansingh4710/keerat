import {MdCheckBox, MdCheckBoxOutlineBlank} from 'react-icons/md';
import {IconButton} from '@mui/material';
import Button from '../../commonComps';

interface ArtistOptBarProps {
  checked: boolean;
  title: string;
  toggleCheckbox: () => void;
  rightText: string;
  onRightTextClick?: () => void;
}

interface CheckboxProps {
  checked: boolean;
}

export function ArtistOptBar({
  checked,
  title,
  toggleCheckbox,
  rightText,
  onRightTextClick,
}: ArtistOptBarProps): JSX.Element {
  function Checkbox({checked}: CheckboxProps): JSX.Element {
    const Icon = checked ? MdCheckBox : MdCheckBoxOutlineBlank;
    return <Icon className="basis-9 text-lg" />;
  }

  return (
    <div className="flex p-1 w-full justify-start items-start border-b border-gray-200">
      <Button additionalClasses="basis-3/4 " onClick={toggleCheckbox}>
        <Checkbox checked={checked} />
        <p className="w-10 text-left truncate flex-1 text-md text-white">{title}</p>
      </Button>
      <IconButton
        onClick={() => {
          if (onRightTextClick) {
            onRightTextClick();
          }
        }}>
        <p className="basis-1/4 bg-btn text-sm p-1 rounded-lg ">{rightText}</p>
      </IconButton>
    </div>
  );
}
