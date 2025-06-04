import OptsPage from '@/components/OptionsPage';
import {getAppStruct} from '@/backend/getDbData';

export default async function Keertan() {
  const appStruct = await getAppStruct('Keertan');
  const opts = appStruct[0].childern;
  if (!opts) {
    return <div>Failed to fetch tracks</div>;
  }
  return <OptsPage opts={opts} />;
}
