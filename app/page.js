import OptsPage from '@/components/OptionsPage/index.js'

export default function Home() {
  const allOpts = [
    'Keertan',
    'Paath',
    'Sant Giani Gurbachan Singh Ji SGGS Katha',
    'Bhagat Jaswant Singh Ji',
    'Giani Sher Singh Ji',
    // 'Tracks Index',
    // 'Miscellaneous Topics',
  ]
  return <OptsPage opts={allOpts} />
}

