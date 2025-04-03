import OptsPage from '@/components/OptionsPage';

export default function Home() {
  const allOpts: string[] = ['Keertan', 'Katha', 'Paath', 'Track Index'];
  return <OptsPage opts={allOpts} />;
}
