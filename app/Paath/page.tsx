import {ALL_OPTS} from './TRACKS';
import ListenPage from '@/components/ListenPage/index';
import {addCheckedKey} from '@/utils/helper_funcs';
import { getTracks } from '../backend/getTracks';

export default async function PaathPage() {
  // const allTheOptions = addCheckedKey(ALL_OPTS);
  const dbData = await getTracks('Paath'); 
  const allTheOptions = addCheckedKey(dbData);
  console.log({allTheOptions})
  return <ListenPage title="Play Random Paath" allTheOpts={allTheOptions} />;
}
