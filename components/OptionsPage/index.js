import ALL_THEMES from "@/utils/themes"

export default function OptsPage({ opts }) {
  const atags = opts.map((str) => {
    const href = str.replaceAll(' ', '')
    return (
      <a href={href} key={href} style={styles.opt}>
        {str}
      </a>
    )
  })

  return (
    <body style={styles.body}>
      <div style={styles.header}>
        ਸੁਣਿਐਦੂਖਪਾਪਕਾਨਾਸੁ॥੮॥
        <div id='GurbaniLine'></div>
        <div id='GurbaniTrans'>Listening, pain and sin are erased</div>
      </div>
      <div style={styles.optsParent}>{atags}</div>
    </body>
  )
}

const styles = {
  body:{
    backgroundColor: ALL_THEMES.theme1.primary,
  },
  header: {
    fontWeight: 'bold',
    textAlign: 'center',
    padding: '20px',
    fontSize: '1em',
    borderRadius: '1em',
    backgroundColor: ALL_THEMES.theme1.secondary,
    color: ALL_THEMES.theme1.text1,
  },
  optsParent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  opt: {
    flex: 1,
    width: '20em',
    padding: '1em',
    margin: '1em',
    height: '7em',
    textAlign: 'center',
    borderRadius: '1em',
    backgroundColor: ALL_THEMES.theme1.third,
    color: ALL_THEMES.theme1.text2,
  },
}
