import OptsPage from '@/components/OptionsPage.js'

export default function Home() {
  const allOpts = [
    'Katha',
    'Keertan',
    'Paath',
    'Track Index',
  ]
  return <OptsPage opts={allOpts} />
}

