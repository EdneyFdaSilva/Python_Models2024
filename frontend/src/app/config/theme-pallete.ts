import hpPallete from './hp-palette';

export interface IPallete {
  primary: string;
  primaryVariant: string;
  secundary: string;
  tertiary: string;
  disabled: string;
  paperColor: string;
  paperDarkColor: string;
}

export const lightPallete: IPallete = {
  primary: '#0096d6',
  primaryVariant: '#0171ad',
  secundary: '#000000',
  tertiary: '#5a5a5a',
  disabled: 'rgba(0, 0, 0, 0.3)',
  paperColor: '#ffffff',
  paperDarkColor: '#F9F9F9'
};

export const darkPallete: IPallete = {
  primary: '#0096d6',
  primaryVariant: '#0096d6', // TODO: search a new primary variant
  secundary: '#ffffff',
  tertiary: 'rgba(255, 255, 255, 0.7)',
  disabled: 'rgba(255, 255, 255, 0.3)',
  paperColor: '#1f1f1f',
  paperDarkColor: '#F9F9F9'
};

export const lightChartColors = [
  hpPallete.primary.hpBlueWebAcc,
  hpPallete.primary.hpBlue,
  hpPallete.neutral.lightGrey,
  hpPallete.primary.hpBlueWebAcc
];

export const darkChartColors = [
  hpPallete.primary.hpBlueWebAcc,
  hpPallete.primary.hpBlue,
  hpPallete.neutral.lightGrey,
  hpPallete.primary.hpBlueWebAcc
];
