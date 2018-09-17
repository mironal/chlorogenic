import Color from "color"

const colorPalet = {
  backgroundColor: "#393939",
  textColor: "#efefef",
  baseColor: "#2c9a9a",

  redColor: "#CA4C4C",
  greenColor: "#4CCA7E",
  yellowColor: "#B1CA4C",
  blueColor: "#4C7ECA",
}

export interface Theme {
  secondaryBackgroundColor: string
  backgroundColor: string
  baseColor: string
  secondaryBaseColor: string
  textColor: string
  secondaryTextColor: string
  redColor: string
  blueColor: string
  greenColor: string
  yellowColor: string
}

const mainTheme: Theme = {
  ...colorPalet,
  secondaryBackgroundColor: Color(colorPalet.backgroundColor)
    .darken(0.4)
    .toString(),
  secondaryBaseColor: Color(colorPalet.baseColor)
    .lighten(0.2)
    .toString(),
  secondaryTextColor: Color(colorPalet.textColor)
    .darken(0.4)
    .toString(),
}

export const theme = {
  main: mainTheme,
}
