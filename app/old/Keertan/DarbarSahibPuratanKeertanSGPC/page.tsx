import ListenPage from '@/components/ListenPage/index';
import {addCheckedKey} from '@/utils/helper_funcs';
import {getTracks} from '@/backend/getDbData';

export default async function SGPC() {
  const dbData = await getTracks(['DarbarSahibPuratanKeertanSGPC']);
  const allTheOptions = addCheckedKey(dbData);
  return <ListenPage title="Darbar Sahib SGPC Keertan" allTheOpts={allTheOptions} />;
}
