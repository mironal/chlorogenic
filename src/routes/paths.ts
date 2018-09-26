const paths = {
  Dashboard: (panelIndex: number | undefined = undefined) =>
    `/${panelIndex === undefined ? ":panelIndex" : panelIndex}`,
  SignIn: "/signin",
}

export default paths

export type Paths = typeof paths
