import pallete from './pallete';

// JS reimplementation of Style Closet scales for use in styled-components

// const breakpoints = ['31.25em', '43.75em', '46.875em'];
const fontSize = {
  lg: '70',
  md: '42',
  mdTwo: '40',
  smTwo: '30',
  smThree: '35',
  sm: '26',
  smOne: '24',
  xsm: '20',
  xxsm: '18'
};
const fontWeight = { bold: '600', regular: '500', black: '700' };
const fontFamily = { montserrat: 'Montserrat-SemiBold' };

const theme = {
  // breakpoints,
  fontSize,
  fontWeight,
  fontFamily,
  pallete
};

export { theme };
