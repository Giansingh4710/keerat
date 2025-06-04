// import ListenPage from '@/components/ListenPage/index';
import {addCheckedKey} from '@/utils/helper_funcs';
import { getTracks } from '@/backend/getDbData';

export default async function ListenPage ({ params }: { params: Promise<{ listen_page_opt: string }> }){
  const { listen_page_opt } = await params
  // const dbData = await getTracks(['Paath']); 
  // const allTheOptions = addCheckedKey(dbData);
  // return <ListenPage title="Play Random Paath" allTheOpts={allTheOptions} />;
  return <div>{JSON.stringify(listen_page_opt)}</div>
}
