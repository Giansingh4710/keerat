import {ALL_OPTS} from './TRACKS';
import ListenPage from '@/components/ListenPage/index';
import {addCheckedKey} from '@/utils/helper_funcs';
import { getTracks } from '../backend/getTracks';

export default function PaathPage() {
  const allTheOptions = addCheckedKey(ALL_OPTS);
  getTracks('Paath'); 
  return <ListenPage title="Play Random Paath" allTheOpts={allTheOptions} />;
}
