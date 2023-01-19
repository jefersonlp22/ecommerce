/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import _ from "lodash";
import { useHistory } from "react-router-dom";

import { HeroBanner } from "../../components/HeroBanner";
import { Container, Content, Line } from "../../components/Grid";
import { Title, TextLinked } from "../../components/Typograph";
import { CardHighlight } from "../../components/CardHighlight";
import { Next } from "../../components/Icons/Next";
import { HorizontalCarousel } from "../../components/HorizontalCarousel";
import { useLayout } from "../../contexts/layout";
import { ROUTE_TENANT_PRODUCTS } from "../../constants/";
import { ROUTE_TENANT_POLITICS } from "../../constants/";
import { ROUTE_TENANT_TERM_OF_USE } from "../../constants/";
import MetaTags from 'react-meta-tags';


import {
  Collections as CollectionsProps,
  Collection as CollectionProps
} from "../../ModelTyping/Collection";
import {
  HomeShopCollectionPaginator,
  SlideProps
} from "../../ModelTyping/HomeShopCollection";
// import { collectionMock, categoriesHighlightMock } from '../../mocks';
import { Animate } from "../../components/Animate";
import { Product } from "../../ModelTyping/Product";
import { Collection } from "./collection";

interface HomeData {
  catalogCollections: CollectionsProps;
  homeShopCollection: HomeShopCollectionPaginator;
  storeHomeShopSlider: {
    data: Product[];
  };
  catalogProducts: Product[];
}



export default () => {
  const history = useHistory();
  const [valueSearch] = useState("");
  const HOME_QUERY = gql`
  query {
    storeHomeShopSlider(first: 6) {
      data {
        id
        title
        description
        device
        channel
        link
        featured_asset {
          url
        }
      }
    }
    homeShopCollection(
      first: 10
      hasCollection: { column: ENABLED, operator: EQ, value: 1 }
    ) {
      data {
        collection {
          id
          name
          description
          position
          parent_id
          is_root
          featured_asset {
            url
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
    catalogProducts(
      first: 30
      page: 1
        filter:{column: ID, operator: NOT_IN, value: [0]
            AND: [
              { column: NAME, operator: LIKE, value: "%${valueSearch}%" }
              # {
              #   OR: [
              #       { column: CODE, operator: EQ, value: "${valueSearch}"}
              #     ]
              #   }
              ]
          }
    ) {
      paginatorInfo {
        count
        currentPage
        firstItem
        hasMorePages
        lastItem
        lastPage
        perPage
        total
      }
      data {
        id
        name
        code
        description
        quantity_items
        price
        price_formatted
        list_price_formatted
        list_price
        type
        datasheet
        enabled
        options {
          id
          name
          values {
            id
            name
          }
        }
        facet_values {
          name
        }
        assets {
          id
          url
        }
        featured_asset {
          url
        }
        collections {
          id
          name
        }
      }
    }
  }
`;

  const { loading, data } = useQuery<HomeData>(HOME_QUERY);
  const [carrousel, setCarrousel] = useState<SlideProps[]>();
  const [cookieExistes, setCookieExistes] = useState(false);
  const [highLights, setHighLights] = useState<CollectionProps[]>();
  const layoutContext = useLayout();
  const { catalog, setCatalog, tenant } = layoutContext;

  useEffect(() => {
    if (data) {
      let collectionsData = _.filter(data?.catalogCollections?.data, {
        is_root: 0
      });
      setCarrousel(data?.storeHomeShopSlider?.data);
      if (setCatalog) {
        setCatalog({
          ...catalog,
          products: data.catalogProducts,
          collections: collectionsData,
          currentCollection: ""
        });
      }
      setHighLights(data.homeShopCollection.data);
    }
  }, [data]);

  const handleCategories = () => {
    history.push(`${ROUTE_TENANT_PRODUCTS()}`);
  };

  const handlePolitics = () => {
    tenant?.typeof_terms === 'text' ?
    history.push(`${ROUTE_TENANT_POLITICS()}`) :
    window.open(`${tenant?.term_of_use}`,"_blank")
  }

  const handleTermOfUse = () => {
    history.push(`${ ROUTE_TENANT_TERM_OF_USE()}`);
  }


  function setCookie(cname, cvalue, exdays) {
    setCookieExistes(false);
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));

    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return false
  }

  async function checkCookie() {
     var coockieName = await getCookie("acceptCookies");

    if (!coockieName && coockieName != null) {
      setCookieExistes(!cookieExistes);
    }
  }

  // useEffect(() => {
  //   if (tenant) {
  //     console.log(tenant);
  //   }
  // }, [tenant]);

  useEffect(() => {
    setCatalog({ ...catalog, currentCollection: "" });
    checkCookie();
  }, []);

  if (loading)
    return (
      <Animate>
        <Container>
          <Content>
            <Line />
            <Title>Carregando...</Title>
          </Content>
        </Container>
      </Animate>
    );

  // if (error && process.env.NODE_ENV !== "development") return <p>Error :(</p>;
  return (
    <Animate  className="mt-8">
      <MetaTags>

        <MountTenantMetaTags tenantId={tenant?.id} />
        <title>{`Lojinha - ${tenant?.name}`}</title>
        <meta name="description" content={`Lojinha - ${tenant?.name}`} />
        <meta property="og:title" content={`Lojinha - ${tenant?.name}`}/>
        <meta property="og:image" content={tenant?.picture_url} />
      </MetaTags>

      {carrousel && carrousel.length > 0 && <HeroBanner data={carrousel} />}
      <Container>
        <Content className=" relative">
          <Line />
          <div className="flex flex-row items-center justify-between mb-5">
            <Title>Categorias em destaque</Title>
            <TextLinked>
              {/* <ButtonClear className="hidden sm:block" color="primary" onClick={handleCategories}>Ver todos</ButtonClear> */}
              <div className="block sm:hidden">
                <Next
                  onClick={handleCategories}
                  fill="currentColor"
                  size={20}
                />
              </div>
            </TextLinked>
          </div>
          {highLights?.length && (
            <>
              <HorizontalCarousel
                data={highLights}
                component={CardHighlight}
                naturalSlideWidth={100}
                naturalSlideHeight={90}
              />
              <Line />
            </>
          )}

          {catalog?.collections?.map((collection: any, index: any) => (
            <Collection key={index} data={collection} />
          ))}
          <Line />
          <Line />
          <Line />
          <Line />
          <Line />
          <Line />
          <Line />

        </Content>
        {cookieExistes ? (
          <div className="fixed bottom-0 flex justify-center items-center min-w-full py-0 md:py-12">
          <div
            className="flex flex-col sm:flex-row justify-around py-2 px-2 items-center bg-white rounded-t-8 md:rounded-8 w-full sm:w-9/12 md:w-3/4 text-text-4"
          >
            <span className="mx-4 sm:mx-2 mb-4 px- py-1 sm:mb-0 text-sm">
              <div className="text-justify">
                Utilizamos cookies e tecnologias semelhantes para entender e melhorar sua experiência na nossa plataforma.<br/>
                Ao seguir, você concorda com a
                <strong onClick={() => handlePolitics()} className="cursor-pointer text-primary"> Política de Privacidade </strong>
                 e <strong onClick={() => handleTermOfUse()} className="cursor-pointer text-primary">Termos de Uso da Plataforma</strong>.
              </div>
            </span>
            <div className=" w-1/2 sm:w-1/12">
              <button
                className="bg-primary w-full  py-2 px-3 rounded-full uppercase text-white text-xs focus:outline-none"
                onClick={() => setCookie("acceptCookies", true, 365)}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      ) : null}

      </Container>

    </Animate>
  );
};

const MountTenantMetaTags = ({tenantId}) =>{

  const [isWine, setIsWine] = useState(false);

  useEffect(()=>{
    if(
      window.location.hostname === 'wineeventos.peoplecommerce.com.br' &&
      Number(tenantId) === 6){
        setIsWine(true);
    }
  },[]);

  return (<>
    {isWine ? <>
      <meta name="theme-color" content="#e14687" />
      <link rel="manifest" href="/manifest-wine.json" />
      <link rel="icon" href="/wine-favicon.ico" />
      <link rel="apple-touch-icon" href="/wine-logo192.png" />
    </> : <>
      <meta name="theme-color" content="#000000" />
      <link rel="manifest" href="/manifest.json" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/logo192.png" />
    </> }

  </>);
}
