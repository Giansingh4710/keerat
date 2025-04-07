import ListenPage from '@/components/ListenPage/index';
import {addCheckedKey} from '@/utils/helper_funcs';
import {getTracks} from '@/backend/getTracks';

export default async function SGPC() {
  const dbData = await getTracks(['RandomRadio']);
  const allTheOptions = addCheckedKey(dbData);
  return <ListenPage title="Random Keertan" allTheOpts={allTheOptions} />;
}
