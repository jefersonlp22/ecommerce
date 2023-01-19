const size = {
  mobileS: '320px',
  mobileM: '375px',
  mobileL: '425px',
  tablet: '768px',
  laptop: '1024px',
  laptopL: '1440px',
  desktop: '2560px'
}
const device = {
  mobileS: `(min-width: ${size.mobileS})`,
  mobileM: `(min-width: ${size.mobileM})`,
  mobileL: `(min-width: ${size.mobileL})`,
  tablet: `(min-width: ${size.tablet})`,
  laptop: `(min-width: ${size.laptop})`,
  laptopL: `(min-width: ${size.laptopL})`,
  desktop: `(min-width: ${size.desktop})`,
  desktopL: `(min-width: ${size.desktop})`
};
export default {
    title: 'Main',

    colors:{
        primary: '#0489cc',
        secundary: 'red',
        text: '#b2b2b3',
        title: '#4d4d4d',
        silver: '#aeaeae',
    },

    fonts:{
      family: 'CircularStd',
      sizes:{
        xl: '30px',
        lg: '24px',
        md: '16px',
        sm: '14px',
        xs: '12px'
      }
    },


    sizes: {
      contentNumeric: 1230,
      content: '1230px',
      gapNumeric: 30,
      gap: '30px',
    },

    media: device

};
