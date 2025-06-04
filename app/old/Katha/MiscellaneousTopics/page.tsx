import ListenPage from '@/components/ListenPage/index';
import {addCheckedKey} from '@/utils/helper_funcs';
import {getTracks} from '@/backend/getDbData';

export default async function MT() {
  const dbData = await getTracks(['MiscellaneousTopics']);
  const allTheOptions = addCheckedKey(dbData);
  return <ListenPage title="Misellaneous Topics" allTheOpts={allTheOptions} />;
}
