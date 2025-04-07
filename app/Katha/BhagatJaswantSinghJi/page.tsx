import ListenPage from '@/components/ListenPage/index';
import {addCheckedKey} from '@/utils/helper_funcs';
import { getTracks } from '@/backend/getTracks';

export default async function BhagatJi() {
  const dbData = await getTracks(['BhagatJaswantSinghJi']); 
  const allTheOptions = addCheckedKey(dbData);
  return <ListenPage title="Bhagat Jaswant Singh Ji" allTheOpts={allTheOptions} />;
}
