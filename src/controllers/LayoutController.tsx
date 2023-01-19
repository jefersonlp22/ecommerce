import React from 'react';
import Layouts from '../layouts';

import GlobalStyles from '../stylesheets/global';
import GlobalFonts from '../stylesheets/fonts';
import { ProviderLayout } from '../contexts/layout';

interface Props {
  name: string;
  props?: any;
  currentLocation?: any;
}

const LayoutController = ({ name, ...props }) => {
  const Layout = Layouts[name];

  const { host } = window.location;
  const storageKey = `${host}/${props?.external}`;

  return (
    <>
      <GlobalFonts />
      <GlobalStyles />
      <ProviderLayout external={props?.external} storageKey={storageKey}>
        <Layout {...props} />
      </ProviderLayout>
    </>
  )
};

export default LayoutController;
