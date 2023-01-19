export default `
  #portal-root {
    position: relative;
    z-index: 999;
    & > .portal {
      background-color: rgba(0,0,0,0.5);
      position: fixed;
      height: 100%;
      width: 100%;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      display: flex;
      flex-direction: column;
    }
  }
`

