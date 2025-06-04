import React from 'react';
import NavBar from './NavBar';
import {PageDocument} from '@/utils/types';
import Link from 'next/link';

interface OptionsPageProps {
  opts: PageDocument[];
  children?: PageDocument[];
}

export default function OptionsPage({opts, children}: OptionsPageProps): JSX.Element {
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
                {(children || opts).map((pageItem: PageDocument) => {
                  const str = pageItem.page_name;
                  const href = str.replaceAll(' ', '');
                  return (
                    <a
                      key={href}
                      href={href}
                      className="block py-3 px-4 rounded-md text-center font-medium text-primary-100 bg-btn hover:bg-five transition duration-150 ease-in-out">
                      {str}
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
