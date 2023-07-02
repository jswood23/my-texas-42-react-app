import { isMobile } from 'react-device-detect';

const spacing = (n: number) => {
  const baseSize = isMobile ? 6 : 10;
  return `${n * baseSize}px`;
};

export const THEME = {
  form: {
    container: {
      width: spacing(35),
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    },
    input: {
      width: '100%',
      marginTop: spacing(3)
    },
    window: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    }
  },
  palette: {
    primary: {
      main: '#500000',
      alt: '#700000'
    },
    secondary: {
      main: '#FFFCEB',
      alt: '#FFFEF5'
    },
    domino: {
      color1: '#E31837', // red
      color2: '#006491', // blue
      color3: '#228B22', // forest green
      color4: '#9400D3', // purple
      color5: '#D24787', // pink
      color6: '#696161' // grey
    }
  },
  spacing: (n: number) => spacing(n)
};
