import { ALL_OPTS } from './TRACKS.js'
import ListenPage from '@/components/ListenPage/index.js'
import { addCheckedKey } from '@/utils/helper_funcs.js'

export default function PaathPage() {
  const allTheOptions = addCheckedKey(ALL_OPTS)
  return <ListenPage title='Giani Sher Singh Ji' allTheOpts={allTheOptions} />
}
