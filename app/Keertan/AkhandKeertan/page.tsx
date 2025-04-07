import ListenPage from '@/components/ListenPage/index';
import {addCheckedKey} from '@/utils/helper_funcs';
import { getTracks } from '@/backend/getTracks';

export default async function AKJ() {
  const dbData = await getTracks(['AkhandKeertan']); 
  const allTheOptions = addCheckedKey(dbData);
  return <ListenPage title="Classic Akhand Keertan" allTheOpts={allTheOptions} />;
}
