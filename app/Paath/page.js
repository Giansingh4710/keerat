import { ALL_OPTS } from './TRACKS.js'
import ListenPage from '@/components/ListenPage/index.js'
import { addCheckedKey } from '@/utils/helper_funcs.js'
import { getTracks } from '../backend/getTracks.js'

export default function PaathPage() {
  const allTheOptions = addCheckedKey(ALL_OPTS)
  console.log('allTheOptions: ', allTheOptions)
  // getTracks('Paath')
  return <ListenPage title='Play Random Paath' allTheOpts={allTheOptions} />
}
