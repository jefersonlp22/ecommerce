import 'styled-components';

declare module 'styled-components'{
    export interface DefaultTheme{
        title: string;

        colors:{
            primary: string;
            secundary: string;
            text: string;
            title: string;
            silver: string;
            [key: string]: string;
        };

        fonts: {
          /**
           * Default Font Family Theme
           */
          family: string;

          /**
           * Font Sizes
           */
          sizes:{
            /**
             * Extra Large
             */
            xl: string;
            /**
             * Large
             */
            lg: string;
            /**
             * Medium
             */
            md: string;
            /**
             * Small
             */
            sm: string;
            /**
             * Extra Small
             */
            xs: string;
          }
        }

        sizes: {
          contentNumeric: Number;
          content: string;
          gapNumeric: number;
          gap: string;
        }

        media:{
          mobileS: string;
          mobileM: string;
          mobileL: string;
          tablet: string;
          laptop: string;
          laptopL: string;
          desktop: string;
          desktopL: string;
        }
    }
}


