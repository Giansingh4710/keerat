import OptsPage from '@/components/OptionsPage';

export default function Keertan() {
  const allOpts = [
    'Akhand Keertan',
    'Darbar Sahib Puratan Keertan SGPC',
    'Time Based Raag Keertan',
    'Random Radio',
    'All Keertan',
  ];
  return <OptsPage opts={allOpts} />;
}
