interface Theme {
  text2: string;
  text1: string;
  primary: string;
  secondary: string;
  third: string;
  fourth: string;
  five: string;
}

interface AllThemes {
  theme1: Theme;
}

const ALL_THEMES: AllThemes = {
  theme1: {
    text2: 'white',
    text1: 'black',
    primary: '#001f3f',
    secondary: '#F58F29',
    third: '#FFA500',
    fourth: '#466995',
    five: '#7D4600',
  },
};

export default ALL_THEMES;
