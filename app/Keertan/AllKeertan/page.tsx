import ListenPage from '@/components/ListenPage/index';
import {addCheckedKey} from '@/utils/helper_funcs';
import {getTracks} from '@/backend/getTracks';

export default async function AllKeertan() {
  const dbData = await getTracks([
    'AkhandKeertan',
    'DarbarSahibPuratanKeertanSGPC',
    'RandomRadio',
    'TimeBasedRaagKeertan',
  ]);
  const allTheOptions = addCheckedKey(dbData);
  return <ListenPage title="All Keertan" allTheOpts={allTheOptions} />;
}
