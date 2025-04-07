import ListenPage from '@/components/ListenPage/index';
import {addCheckedKey} from '@/utils/helper_funcs';
import { getTracks } from '@/backend/getTracks';

export default async function SantWJ() {
  const dbData = await getTracks(['SantWaryamSinghJi']); 
  const allTheOptions = addCheckedKey(dbData);
  return <ListenPage title="Sant Waryam Singh Ji" allTheOpts={allTheOptions} />;
}
