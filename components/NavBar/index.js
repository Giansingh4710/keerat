import React, { Children, useEffect, useState } from 'react'
import { getPrefixForProd } from '@/utils/helper_funcs'

function LinkTag({ href, absLink }) {
  const [prefix, setPrefix] = useState('')
  useEffect(() => {
    setPrefix(getPrefixForProd())
  }, [])

  const hrefToLink = href ? prefix + href : absLink

  const linksLst = hrefToLink.split('/')
  const lastPart = linksLst[linksLst.length - 1]
    ? linksLst[linksLst.length - 1]
    : linksLst[linksLst.length - 2]

  return (
    <a
      href={hrefToLink}
      style={{
        color: 'white',
        textDecoration: 'underline',
      }}
    >
      {lastPart}
    </a>
  )
}

function LeftHome({ main }) {
  const [prefix, setPrefix] = useState('')
  useEffect(() => {
    setPrefix(getPrefixForProd())
  }, [])

  if (main) {
    return (
      <h1 style={styles.home}>
        <a href={`${prefix}/`} className='active'>
          Home
        </a>
      </h1>
    )
  }
  return <></>
}

function BarRow({ name, main, children }) {
  const [showChildren, setShowChildren] = useState(false)

  function TheChildern() {
    if (showChildren === false || children === undefined) {
      return <></>
    }

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#333',
          gap: '10px',
          alignItems: 'flex-start',
        }}
      >
        {Children.map(children, (childAtag) => {
          return (
            <div
              style={{
                flex: 1,
                width: '97%',
                display: 'flex',
                paddingLeft: '10px',
              }}
            >
              {childAtag}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div style={styles.cont}>
      <div style={styles.topRow}>
        <LeftHome main={main} />
        <h1 style={styles.title}>{name}</h1>
        <button
          style={styles.burgerIcon}
          className='icon'
          onClick={() => setShowChildren(!showChildren)}
        >
          ☰
        </button>
      </div>
      <TheChildern />
    </div>
  )
}

const styles = {
  cont: {
    width: '100%',
    height: '100%',
    // backgroundColor: '#333',
    borderRadius: '1em',
    border: '1px solid black',
  },
  topRow: {
    height: '40px',
    backgroundColor: '#333',
    borderRadius: '1em',
    display: 'flex',
    alignItems: 'center',
  },
  home: {
    flex: 0.5,
    height: '95%',
    paddingLeft: '15px',
    paddingRight: '15px',
    fontSize: '1em',
    borderRadius: '10px',
    backgroundColor: '#eddf6a',

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 4,
    alignSelf: 'center',
    alignItems: 'center',
    color: 'white',
    fontSize: '1em',
  },
  burgerIcon: {
    flex: 0.5,
    height: '95%',
    paddingLeft: '15px',
    paddingRight: '15px',
    fontSize: '2em',
    borderRadius: '10px',
    // backgroundColor: '#eddf6a',

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}

export default function NavBar({ title }) {
  return (
    <nav>
      <BarRow name={title} main={true}>
        <BarRow name={'Keertan'}>
          <LinkTag href='/Keertan/AkhandKeertan' />
          <LinkTag href='/Keertan/DarbarSahibPuratanKeertanSGPC' />
          <LinkTag href='/Keertan/TimeBasedRaagKeertan' />
          <LinkTag href='/Keertan/AllKeertan' />
        </BarRow>
        <LinkTag href='/Paath/' />
        <LinkTag href='/SantGianiGurbachanSinghJiSGGSKatha/' />
        <LinkTag href='/BhagatJaswantSinghJi/' />
        <LinkTag href='/GianiSherSinghJi/' />
        <LinkTag href='/MiscellaneousTopics' />
        <LinkTag absLink='http://45.76.2.28/trackIndex' />
      </BarRow>
    </nav>
  )
}
