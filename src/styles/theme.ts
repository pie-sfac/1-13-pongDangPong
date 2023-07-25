import { DefaultTheme } from 'styled-components';

const colors = {
  pri: {
    900: '#ebf1ff', // bgc 50
    800: '#bfd1ff', // bgc 100
    700: '#92b1ff',
    600: '#6691ff',
    500: '#4679fc', // basic
    400: '#2d62ea',
    300: '#1546c2',
    200: '#00247e',
    100: '#0833a0',
    50: '#001a5c',
  },
  gray: {
    900: '#fbfbfb',
    800: '#f4f4f4', // bg 100
    700: '#e7e7e7', // border-line 200
    600: '#cfcfcf', // border-line 300
    500: '#aeaeae', // text 400
    400: '#808080',
    300: '#737373',
    200: '#505050', // text 700
    100: '#323232',
    50: '#1d1d1d', // text 900
  },

  'Pri-900': '#ebf1ff',
  'Pri-800': '#bfd1ff',
  'Pri-700': '#92b1ff',
  'Pri-600': '#6691ff',
  'Pri-500': '#4679fc',
  'Pri-400': '#2d62ea',
  'Pri-300': '#1546c2',
  'Pri-200': '#00247e',
  'Pri-100': '#0833a0',
  'Pri-50': '#001a5c',
  'Gray-900': '#fbfbfb',
  'Gray-800': '#f4f4f4',
  'Gray-700': '#e7e7e7',
  'Gray-600': '#cfcfcf',
  'Gray-500': '#aeaeae',
  'Gray-400': '#808080',
  'Gray-300': '#737373',
  'Gray-200': '#505050',
  'Gray-100': '#323232',
  'Gray-50': '#1d1d1d',

  Black: '#141212',
  Dim: '40, 40, 40',
  White: '#ffffff',
  Error: '#df291d',
  Positive: '#1fb881',
};

const fontSize = {
  mainTitle: 28,
  title: 24,
  subTitle: 18,
  bodyText: 16,
  details: 14,
  smallestText: 12,
};

const fontSize_ = {
  28: `1.75rem`,
  24: '1.5rem',
  18: '1.125rem',
  16: '1rem',
  14: '.875rem',
  12: '.75remx',
};

export type ColorsTypes = typeof colors;
export type FontSizeTypes = typeof fontSize;
export type FontSize_Types = typeof fontSize_;

export interface ThemeTypes {
  colors: ColorsTypes;
  fontSize: FontSizeTypes;
  fontSize_: FontSize_Types;
}

export const theme: DefaultTheme = {
  colors,
  fontSize,
  fontSize_,
};

export default theme;
