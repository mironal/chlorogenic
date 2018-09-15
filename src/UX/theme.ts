import Color from "color"

const RoastBeanColors = {
  green: "rgb(249, 255, 239)", // greenbeans. not roasted yet.
  light: "rgb(254, 261, 247)", // Light roast beans.
  medium: "rgb(255, 196, 120)", // Medium roast beans.
  italian: "rgb(39, 20, 5)", // Italian roast beans. very bitter.
  cherry: "#ff6e6e",
}

export interface Theme {
  baseBackground: string
  background: string
  secondaryBackground: string
  text: string
  secondaryText: string
  disable: string
  negative: string
  positive: string

  // primitive colors
  whiteColor: string
  redColor: string
  greenColor: string
}

const mainTheme: Theme = {
  baseBackground: RoastBeanColors.green,
  secondaryBackground: Color(RoastBeanColors.green)
    .darken(0.04)
    .toString(),
  background: RoastBeanColors.medium,
  text: RoastBeanColors.italian,
  secondaryText: RoastBeanColors.medium,
  negative: RoastBeanColors.cherry,
  positive: "green",
  disable: "gray",

  whiteColor: "white",
  redColor: "red",
  greenColor: "green",
}

export const theme = {
  main: mainTheme,
}
