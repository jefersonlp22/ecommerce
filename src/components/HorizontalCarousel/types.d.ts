export interface Props{
  /**
   * Array of Objects
   */
  data : object[];
  /**
   * React component to render slide item
   */
  component: React.ComponentType<any>;
  naturalSlideWidth: number;
  naturalSlideHeight: number;
}
