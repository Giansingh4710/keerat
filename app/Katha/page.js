import OptsPage from '@/components/OptionsPage.js'

export default function Katha() {
  const allOpts = [
    "Bhagat Jaswant Singh Ji",
    "Giani Sher Singh Ji",
    "Miscellaneous Topics",
    "Sant Giani Gurbachan Singh Ji SGGS Katha",
    "Sant Waryam Singh Ji",
  ]
  return <OptsPage opts={allOpts} />
}
