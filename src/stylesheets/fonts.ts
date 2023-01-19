import {createGlobalStyle} from 'styled-components';

import Black from '../assets/fonts/CircularStd-Black.ttf';
import BlackItalic from '../assets/fonts/CircularStd-BlackItalic.ttf';
import Bold from '../assets/fonts/CircularStd-Bold.ttf';
import BoldItalic from '../assets/fonts/CircularStd-BoldItalic.ttf';
import Book from '../assets/fonts/CircularStd-Book.ttf';
import BookItalic from '../assets/fonts/CircularStd-BookItalic.ttf';
import Medium from '../assets/fonts/CircularStd-Medium.ttf';
import MediumItalic from '../assets/fonts/CircularStd-MediumItalic.ttf';


export default createGlobalStyle`
  @font-face {
    font-family: CircularStd;
    font-weight: 800;
    src: url(${Black});
  }

  @font-face {
    font-family: CircularStd;
    font-weight: 800;
    font-style: italic;
    src: url(${BlackItalic});
  }

  @font-face {
    font-family: CircularStd;
    font-weight: 700;
    src: url(${Bold});
  }

  @font-face {
    font-family: CircularStd;
    font-weight: 700;
    font-style: italic;
    src: url(${BoldItalic});
  }

  @font-face {
    font-family: CircularStd;
    font-weight: 600;
    src: url(${Medium});
  }

  @font-face {
    font-family: CircularStd;
    font-weight: 600;
    font-style: italic;
    src: url(${MediumItalic});
  }

  @font-face {
    font-family: CircularStd;
    font-weight: 500;
    src: url(${Book});
  }

  @font-face {
    font-family: CircularStd;
    font-weight: 500;
    font-style: italic;
    src: url(${BookItalic});
  }

`;
