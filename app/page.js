import OptsPage from '@/components/OptionsPage/index.js'

export default function Home() {
  const allOpts = [
    'Keertan',
    'Paath',
    'Sant Giani Gurbachan Singh Ji SGGS Katha',
    'Bhagat Jaswant Singh Ji',
    'Giani Sher Singh Ji',
    'Sant Waryam Singh Ji',
    // 'Miscellaneous Topics',
    'Track Index',
  ]
  return <OptsPage opts={allOpts} />
}

