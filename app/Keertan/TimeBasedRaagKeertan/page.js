'use client'
import { ALL_OPTS } from './TRACKS.js'
import ListenPage from '@/components/ListenPage/index.js'
import { addCheckedKey } from '@/utils/helper_funcs.js'

export default function timeBased() {

  const allTheOptions = addCheckedKey(ALL_OPTS)

  function checkTracksOfTimeRn() {
    const today = new Date()
    const time = today.getHours() * 60 + today.getMinutes()

    console.log('Minutes Passed in the Day: ', time)
    if (time < 181) {
      ALL_OPTS['12am to 3am'].checked = true
    } else if (time < 361) {
      ALL_OPTS['3am to 6am'].checked = true
    } else if (time < 541) {
      ALL_OPTS['6am to 9 am'].checked = true
    } else if (time < 721) {
      ALL_OPTS['9am to 12pm'].checked = true
    } else if (time < 901) {
      ALL_OPTS['12pm to 3pm'].checked = true
    } else if (time < 1081) {
      ALL_OPTS['3pm to 6pm'].checked = true
    } else if (time < 1261) {
      ALL_OPTS['6pm to 9pm'].checked = true
    } else if (time < 1441) {
      ALL_OPTS['9pm to 12am'].checked = true
    } else {
      alert('SOMETHING WRONG. Time Calculated WRONG')
    }
  }

  return <ListenPage title='Time Based Keertan' allTheOpts={allTheOptions} changesOpts={checkTracksOfTimeRn}/>
}
