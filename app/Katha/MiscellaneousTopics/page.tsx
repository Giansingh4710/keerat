import { ALL_OPTS } from './TRACKS'
import ListenPage from '@/components/ListenPage'
import { addCheckedKey } from '@/utils/helper_funcs'

export default function HinduStuff() {
  const allTheOptions = addCheckedKey(ALL_OPTS)
  return <ListenPage title='Misellaneous Topics' allTheOpts={allTheOptions} />
}
