import OptsPage from '@/components/OptionsPage.js'

export default function Home() {
  const allOpts = [
    'Keertan',
    'Katha',
    'Paath',
    'Track Index',
  ]
  return <OptsPage opts={allOpts} />
}

