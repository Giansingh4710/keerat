import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md'
import { useStore } from '@/utils/store.js'

export function ArtistOptBar({ artist, checked, onClick }) {
  const artistTracks = useStore((state) => state.allOptsTracks[artist])
  const ratio = getRatio(artistTracks)
  return (
    <div
      onClick={onClick}
      className='flex border-b border-gray-200 hover:bg-gray-100 cursor-pointer text-sm py-1 px-2'
    >
      <Checkbox checked={checked}/>
      <p className='flex-3 text-left'>{artist}</p>
      <p className='flex-1 text-right'>{ratio}</p>
    </div>
  )
}

function Checkbox({ checked }) {
  const Icon = checked ? MdCheckBox : MdCheckBoxOutlineBlank
  return <Icon className='basis-9 text-lg' />
}

function getRatio(artistTracks) {
  let checkedTracks = 0
  const checkedTypes = artistTracks.filter((type) => type.checked)
  for (const type of checkedTypes) {
    checkedTracks += type.links.length
  }
  const total = artistTrackCount(artistTracks)
  return `${checkedTracks}/${total}`
}

function artistTrackCount(artistTracks) {
  let count = 0
  for (const type of artistTracks) {
    count += type.links.length
  }
  return count
}
