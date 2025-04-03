import { ALL_OPTS } from './TRACKS';
import ListenPage from '@/components/ListenPage';
import { addCheckedKey } from '@/utils/helper_funcs';

export default function SGGS() {
  const allTheOptions = addCheckedKey(ALL_OPTS)
  return <ListenPage title='Vadde Mahapurk SGGS Katha' allTheOpts={allTheOptions} />
}
