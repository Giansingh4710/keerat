import { ALL_OPTS } from './TRACKS.js'
import ListenPage from '@/components/ListenPage/index.js'
import { addCheckedKey } from '@/utils/helper_funcs.js'

export default function BhagatJi() {
  const allTheOptions = addCheckedKey(ALL_OPTS)
  return <ListenPage title='Bhai Sukha Singh' allTheOpts={allTheOptions} />
}
