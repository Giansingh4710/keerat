export function getPrefixForProd() {
  try {
    const isLocal = require('./local.js').default
    if (isLocal) return ''
    return ''
    return '/keerat_test'
  } catch (e) {
    return ''
    return '/keerat_test'
  }
}

export function getNameOfTrack(link) {
  const title = link.split('/').slice(-1)[0]
  return decodeURIComponent(decodeURIComponent(title))
}

export function getTrackLinks(tracksObj) {
  const links = []
  Object.keys(tracksObj).forEach((artist) => {
    if (tracksObj[artist].checked) {
      links.push(...tracksObj[artist].trackLinks)
    }
  })
  return links
}

export function formatTime(timeInSeconds) {
  if (!timeInSeconds) return ''
  function str_pad_left(string, pad, length) {
    return (new Array(length + 1).join(pad) + string).slice(-length)
  }

  let hours = Math.floor(timeInSeconds / 3600)
  let minutes = Math.floor((timeInSeconds % 3600) / 60)
  let seconds = Math.floor(timeInSeconds % 60)

  hours = str_pad_left(hours, '0', 2)
  minutes = str_pad_left(minutes, '0', 2)
  seconds = str_pad_left(seconds, '0', 2)

  let formattedTime = ''
  if (hours === '00') {
    formattedTime = `${minutes}:${seconds}`
  } else {
    formattedTime = `${hours}:${minutes}:${seconds}`
  }

  return formattedTime
}

export function containsOnlyDigits(str) {
    return /^\d+$/.test(str);
}
