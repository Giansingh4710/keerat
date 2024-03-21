import {
  Sri_Hit_Premanand_Govind_Sharan_Ji,
  Swami_Parmanada,
  yog_vashishth,
} from './TRACKS.js'
import ListenPage from '@/components/ListenPage/index.js'

export default function PaathPage() {
  const ALL_OPTS = {
    'Sri Hit Premanand Govind Sharan Ji': {
      checked: true,
      trackLinks: Sri_Hit_Premanand_Govind_Sharan_Ji,
    },
    'Swami Parmanada Ji': {
      checked: true,
      trackLinks: Swami_Parmanada,
    },
    'Yog Vashishth': {
      checked: true,
      trackLinks: yog_vashishth,
    },
  }
  return <ListenPage title='Play Random Paath' tracksObj={ALL_OPTS} />
}
