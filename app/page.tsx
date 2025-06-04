import OptsPage from '@/components/OptionsPage';
import {getAppStruct} from '@/backend/getDbData';

// export default async function Home() {
//   const appStruct = await getAppStruct();
//   return <OptsPage opts={appStruct} />;
// }

import NavBar from '../components/NavBar';
export default async function Home() {
  const appStructure = await getAppStruct();
  return (
    <div className="min-h-screen bg-primary-100 flex flex-col">
      <NavBar title="Keerat" />
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm sm:text-base text-center text-white">
            Discover the essence of Sikhism through our curated collection of Keertan (devotional hymns), Katha
            (spiritual discourses), and Paath (scripture recitations). Immerse yourself in the timeless wisdom and
            beauty of Sikh traditions.
          </p>
          <div className="rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {appStructure.map((pageItem) => {
                  const pre = pageItem.childern ? "options_page" : "listen_page";
                  const href = `${pre}/${pageItem.page_name.replaceAll(' ', '')}`;
                  console.log({href});
                  return (
                    <a
                      key={href}
                      href={href}
                      className="block py-3 px-4 rounded-md text-center font-medium text-primary-100 bg-btn hover:bg-five transition duration-150 ease-in-out">
                      {pageItem.page_name}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
