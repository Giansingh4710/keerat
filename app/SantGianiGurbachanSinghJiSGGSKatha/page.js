import {allKathas} from './TRACKS.js'
import ListenPage from '@/components/ListenPage/index.js'

export default function PaathPage() {
  const ALL_OPTS = {
    'Sri Guru Granth Sahib Ji Kathas': {
      checked: true,
      trackLinks: allKathas,
    },
  }
  return <ListenPage title='Vadde Mahapurk SGGS Katha' tracksObj={ALL_OPTS} />
}
