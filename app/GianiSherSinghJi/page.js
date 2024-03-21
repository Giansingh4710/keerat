import { ardaasa101, p10, p6, vaarag_shatak } from './TRACKS.js'
import ListenPage from '@/components/ListenPage/index.js'

export default function PaathPage() {
  const ALL_OPTS = {
    'P:6 Dhan Sri Guru Hargobind Sahib Ji': {
      checked: true,
      trackLinks: p6,
    },
    'P:10 Dhan Sri Guru Gobind Singh Sahib': {
      checked: true,
      trackLinks: p10,
    },
    'Vaarag Shatak': {
      checked: true,
      trackLinks: vaarag_shatak,
    },
    '101 Ardaasa': {
      checked: true,
      trackLinks: ardaasa101,
    },
  }
  return <ListenPage title='Giani Sher Singh Ji' tracksObj={ALL_OPTS} />
}
