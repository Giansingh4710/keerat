import ALL_THEMES from '@/utils/themes'
import { List } from 'flowbite-react'
import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md'

export function ArtistOptBar({ artist, checked, onClick }) {
  return (
    <List.Item
      icon={checked ? MdCheckBox : MdCheckBoxOutlineBlank}
      onClick={onClick}
      className='flex border-b border-gray-200 hover:bg-gray-100 cursor-pointer '
    >
      <p className='flex-1 text-left'>{artist}</p>
      <p className='flex-1'>1/203</p>
    </List.Item>
  )
}
