/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect } from 'react';
import { Header } from '../../components/Header';
import { CategoryNav } from '../../components/CategoryNav';
import { CategoryNavContent } from '../../components/CategoryNav/content';
import { Cart } from '../../components/Cart';
import { useLayout } from '../../contexts/layout';
import { FormRegister } from '../../components/FormRegister';
import ReactLoading from 'react-loading';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import _ from 'lodash';

const QUERY = gql`
  query {
    ambassador{
      id
      name
      email
      picture_url
      phone
    }
    tenant{
      id
      name
      picture_url
      typeof_terms
      term_of_use
      data {
        color {
          primary
          secondary
        }
        payment_methods{
          min_transaction_value
        }
        freight_methods
        legality_settings{
          customer{
            mandatory_age
            minimum_age
          }
        }
      }
    }
    catalogCollections(first: 40) {
      data {
        id
        name
        position
        is_root
        featured_asset {
          url
        }
      }
    }
  }
`;

export default ({ ...props }) => {
  const layoutContext = useLayout();
  const { catalog, setCatalog } = layoutContext;
  const { loading, data, error } = useQuery(QUERY);

  const setColors = useCallback(() => {
    const root = document.documentElement;
    const { color } = data?.tenant?.data;
    root.style.setProperty('--color-primary', color.primary);
    root.style.setProperty('--color-secondary', color.secondary);
  }, [data?.tenant]);

  useEffect(() => {
    if (data) {
      layoutContext?.setAmbassador(data.ambassador);
      layoutContext?.setTenant(data.tenant);
      setColors();
      if (setCatalog) {
        let collectionsData = _.filter(data?.catalogCollections?.data, {
          is_root: 0
        });
        setCatalog({
          ...catalog,
          collections: collectionsData
        });
      }
    }
  }, [data]);

  if(error) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <ReactLoading type="bubbles" color="#aeaeae" height={'5%'} width={'5%'} />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        avatarUri="https://via.placeholder.com/120"
        brandUri={layoutContext?.tenant?.picture_url}
      />
      <CategoryNav />
      {layoutContext?.cartOpen && <Cart />}
      {layoutContext?.formRegisterOpen && <FormRegister />}

      <div className="flex flex-col flex-1 relative">
        <CategoryNavContent />
        {props.children}
      </div>
    </div>
  )
}


