import ListenPage from '@/components/ListenPage/index';
import {addCheckedKey} from '@/utils/helper_funcs';
import { getTracks } from '@/backend/getDbData';

export default async function Taskaala() {
  const dbData = await getTracks(['SantGianiGurbachanSinghJiSGGSKatha']); 
  const allTheOptions = addCheckedKey(dbData);
  return <ListenPage title="Vadde Mahapurk SGGS Katha" allTheOpts={allTheOptions} />;
}
