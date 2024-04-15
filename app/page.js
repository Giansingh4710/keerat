import OptsPage from '@/components/OptionsPage/index.js'

export default function Home() {
  const allOpts = [
    'Keertan',
    'Paath',
    'Sant Giani Gurbachan Singh Ji SGGS Katha',
    'Bhagat Jaswant Singh Ji',
    'Giani Sher Singh Ji',
    // 'Miscellaneous Topics',
    'Tracks Index',
  ]
  return <OptsPage opts={allOpts} />
}

