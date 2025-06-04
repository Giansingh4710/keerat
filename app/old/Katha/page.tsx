import OptsPage from '@/components/OptionsPage';
import {getAppStruct} from '@/backend/getDbData';

export default async function Katha() {
  const appStruct = await getAppStruct('Katha');
  const opts = appStruct[0].childern;
  if (!opts) {
    return <div>Failed to fetch tracks</div>;
  }
  return <OptsPage opts={appStruct} children={opts} />;
}
