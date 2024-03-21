import {
  bhai_mohan_singhji_adi_mahraj_links,
  bhai_sarvan_singh_adi,
  PanjGranthi,
  patiala_dukh_nivaran_paath_bodh_2016_links,
  bhai_onkar_singhji_dasam_paath_links,
  kabaal_singh_dasam,
} from './TRACKS.js'
import ListenPage from '@/components/ListenPage/index.js'

export default function PaathPage() {
  const ALL_OPTS = {
    'Panj Granthi - Bhai Jaswant Singh Ji TO': {
      checked: true,
      trackLinks: PanjGranthi,
    },
    'Bhai Sarvan Singh Ji Adi Guru Granth Sahib Ji Paath': {
      checked: true,
      trackLinks: bhai_sarvan_singh_adi,
    },
    'Bhai Mohan Singh Ji AKJ Adi Guru Granth Sahib Ji Paath': {
      checked: true,
      trackLinks: bhai_mohan_singhji_adi_mahraj_links,
    },
    '2016 Gurdwara Dukh Nivaran Patiala Paath Adi Guru Granth Sahib Ji Bodh Samagam':
    {
      checked: true,
      trackLinks: patiala_dukh_nivaran_paath_bodh_2016_links,
    },
    'Bhai Onkar Singh Ji Sri Dasam Mahraj Bani': {
      checked: true,
      trackLinks: bhai_onkar_singhji_dasam_paath_links,
    },
    'Bhai Kabaal Singh Ji (Hazoor Sahib wale)': {
      checked: true,
      trackLinks: kabaal_singh_dasam,
    },
  }
  return <ListenPage title='Play Random Paath' tracksObj={ALL_OPTS}/>
}
