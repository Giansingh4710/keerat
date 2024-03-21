import { ALL_OPTS } from './TRACKS.js'
import ListenPage from '@/components/ListenPage/index.js'

export default function ALL() {
  return <ListenPage title='All Keertan' tracksObj={ALL_OPTS} />
}
