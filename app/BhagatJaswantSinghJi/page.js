import {
  BalUpdesh_Mp3_FinalLinks,
  BansavliLinks,
  CharacterPothi,
  GareebiLinks,
  GuruGranthJiLinks,
  Nitnem,
  QuestionLinks,
  SalokPothi,
  SanskaarLinks,
  SehajPaat,
  SukhmaniLinks,
  VishramLinks,
} from './TRACKS.js'
import ListenPage from '@/components/ListenPage/index.js'

export default function PaathPage() {
  const ALL_OPTS = {
    'Sehaj Paath': {
      checked: true,
      trackLinks: SehajPaat,
    },
    Nitnem: {
      checked: true,
      trackLinks: Nitnem,
    },
    'Gareebi Pothi': {
      checked: true,
      trackLinks: GareebiLinks,
    },
    'Bal Updesh': {
      checked: true,
      trackLinks: BalUpdesh_Mp3_FinalLinks,
    },
    'Bansavli Pothi': {
      checked: true,
      trackLinks: BansavliLinks,
    },
    'Sukhmani Sahib Steek ': {
      checked: true,
      trackLinks: SukhmaniLinks,
    },
    'Guru Granth Sahib Ithaas': {
      checked: true,
      trackLinks: GuruGranthJiLinks,
    },
    'Panj Sanskaar Pothi': {
      checked: true,
      trackLinks: SanskaarLinks,
    },
    'Question Answer Pothi': {
      checked: true,
      trackLinks: QuestionLinks,
    },
    'Vishram Pothi': {
      checked: true,
      trackLinks: VishramLinks,
    },
    'Character Pothi': {
      checked: true,
      trackLinks: CharacterPothi,
    },
    'Salok Bhagat Kabeer Fareed Sahib Ji': {
      checked: true,
      trackLinks: SalokPothi,
    },
  }
  return <ListenPage title='Bhagat Jaswant Singh Ji' tracksObj={ALL_OPTS} />
}
