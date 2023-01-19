import { createGlobalStyle } from "styled-components";

import _variables from "./abstracts/_variables";
import _reset from "./abstracts/_reset";
import _flex from "./abstracts/_flex";
import _portal from "./abstracts/_portal";

export default createGlobalStyle`
  ${_variables}
  ${_reset}
  ${_flex}
  ${_portal}

  html, body {
    font-family: CircularStd;
    overflow-x:hidden 
  }

  .iziToast {
    padding: 7px 100px 7px 5px;
    min-height: auto;
    .iziToast-close {
      filter: brightness(0) invert(1);
      opacity: 1;
    }
    &.iziToast-color-green {
      background: var(--color-success);
      .iziToast-progressbar {
        background: var(--color-success);
      }
    }
  }

  .MuiTextField-root {
    --color-text-field-border: #e5e5e6;
    --color-text-field-text: var(--color-title);
    &.color-primary {
      --color-text-field-border: var(--color-primary);
      --color-text-field-text: var(--color-primary);
    }
    label.MuiFormLabel-root {
      color: var(--color-text-4);
    }
    .MuiInput-underline {
      &:hover, &:focus, &.Mui-focused {
        &:before, &:after {
          border-color: var(--color-text-field-border) !important;
        }
      }
      &:before, &:after {
        border-color: var(--color-text-field-border);
      }
      input {
        color: var(--color-text-field-text);
      }
    }
  }
`;
