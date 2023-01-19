export interface IconProps {
  /**
   * Classes Names
   */
  className?: string;
  /**
   * onClick Event
   */
  onClick?(): void;
  /**
   * Css cursor type
   */
  cursor?: string;
  /**
   * First color of icon
   */
  fill?: string;
  /**
   * Color for icon if notify bullet
   */
  bulletFill?: string;
  /**
   * Size of icon and viewBox
   * @default 40
   */
  size?: number;
  /**
   * have notification
   * @default false
   */
  notification?: boolean;
}
