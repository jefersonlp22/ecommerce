/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Props } from './types';

const bodyEl = document?.body;
const portalRoot = document.getElementById('portal-root');

// https://reactjs.org/docs/portals.html
const Portal: React.FC<Props> = ({ ...props }) => {
  const [el, setEl] = useState<any>();
  useEffect(() => {
    const el = document.createElement('div');
    el.classList.add('portal');
    bodyEl?.classList.add('overflow-hidden');
    portalRoot?.appendChild(el);
    setEl(el);

    return () => {
      bodyEl?.classList.remove('overflow-hidden');
      portalRoot?.removeChild(el);
    }
  }, [])

  if(!el) {
    return null;
  }

  // adicionar o el ao useState evita o bug com interação no componente. Ex.: Ao clicar no + ou - dentro do carinho de compra
  return ReactDOM.createPortal(
    props.children,
    el,
  );

  // return render;
};

export { Portal };

