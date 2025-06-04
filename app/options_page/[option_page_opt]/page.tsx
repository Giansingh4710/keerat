// import { useRouter } from 'next/router';
import NavBar from '../../../components/NavBar';
import Link from 'next/link';
import {getAppStruct} from '@/backend/getDbData';

export default async function SectionPage ({ params, }: { params: Promise<{ option_page_opt: string }> }){
  // const router = useRouter();
  // if (router.isFallback) { return <div>Loading...</div> }

  const { option_page_opt } = await params

  console.log({option_page_opt});
  const a = await getAppStruct(option_page_opt);
  const children = a[0].childern;

  return (
    <div className="min-h-screen bg-primary-100 flex flex-col">
      <NavBar title={`Keerat - ${option_page_opt}`} />
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">{option_page_opt}</h1>

          <div className="rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {children?.map((childItem) => {
                  // Skip hidden items
                  if (childItem.hide) return null;

                  const childHref = childItem.page_name.replaceAll(' ', '');
                  return (
                    <Link
                      key={childHref}
                      href={`/${option_page_opt}/${childHref}`}
                      className="block py-3 px-4 rounded-md text-center font-medium text-primary-100 bg-btn hover:bg-five transition duration-150 ease-in-out">
                      {childItem.page_name}
                    </Link>
                  );
                })}

                {/* If no children, this could be a option_page_opt with direct content */}
                {!children && (
                  <div className="text-white">
                    <p>Content for {option_page_opt} will be displayed here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
