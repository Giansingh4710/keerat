import ListenPage from '@/components/ListenPage/index';
import {addCheckedKey} from '@/utils/helper_funcs';
import {getTracks} from '@/backend/getTracks';

export default async function TimeBased() {
  const dbData = await getTracks(['TimeBasedRaagKeertan']);
  const allTheOptions = addCheckedKey(dbData);
  return <ListenPage title="Time Based Raag Keertan" allTheOpts={allTheOptions} />;
}
