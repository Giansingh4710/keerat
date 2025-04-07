import ListenPage from '@/components/ListenPage';
import { addCheckedKey } from '@/utils/helper_funcs';
import { getTracks } from '@/backend/getTracks';

export default async function BSS() {
  const dbData = await getTracks(['BhSukhaS']); 
  const allTheOptions = addCheckedKey(dbData);
  return <ListenPage title='Bhai Sukha Singh' allTheOpts={allTheOptions} />
}
