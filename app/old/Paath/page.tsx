import ListenPage from '@/components/ListenPage/index';
import {addCheckedKey} from '@/utils/helper_funcs';
import { getTracks } from '@/backend/getDbData';

export default async function PaathPage() {
  const dbData = await getTracks(['Paath']); 
  const allTheOptions = addCheckedKey(dbData);
  return <ListenPage title="Play Random Paath" allTheOpts={allTheOptions} />;
}
