import ListenPage from '@/components/ListenPage/index';
import {addCheckedKey} from '@/utils/helper_funcs';
import { getTracks } from '@/backend/getTracks';

export default async function GSSJ() {
  const dbData = await getTracks(['GianiSherSinghJi']); 
  const allTheOptions = addCheckedKey(dbData);
  return <ListenPage title="Giani Sher Singh Ji" allTheOpts={allTheOptions} />;
}
