import { useRouter } from 'next/router';
import NavBar from '../../components/NavBar';
import Link from 'next/link';

export default function SectionPage({ section, children }) {
  const router = useRouter();
  
  // If the page is not yet generated, show a loading state
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-primary-100 flex flex-col">
      <NavBar title={`Keerat - ${section}`} />
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">{section}</h1>
          
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
                      href={`/${section}/${childHref}`}
                      className="block py-3 px-4 rounded-md text-center font-medium text-primary-100 bg-btn hover:bg-five transition duration-150 ease-in-out">
                      {childItem.page_name}
                    </Link>
                  );
                })}
                
                {/* If no children, this could be a section with direct content */}
                {!children && (
                  <div className="text-white">
                    <p>Content for {section} will be displayed here.</p>
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
