import { ALL_OPTS } from './TRACKS';
import ListenPage from '@/components/ListenPage';
import { addCheckedKey } from '@/utils/helper_funcs';

export default function akj() {
  const allTheOptions = addCheckedKey(ALL_OPTS)
  return <ListenPage title='Classic Akhand Keertan' allTheOpts={allTheOptions} />
}
