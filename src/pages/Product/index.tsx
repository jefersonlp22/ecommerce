/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback } from "react";
import { Container, Content } from "../../components/Grid";
import { Title } from "../../components/Typograph";
import ReactLoading from "react-loading";
// import { TagsProduct } from "../../components/Tag";
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext
} from "pure-react-carousel";
import { ArrowArea } from "../../components/HeroBanner/style";
import { ArrowPrev, ArrowNext } from "../../components/HeroBanner/icons";
import { useHistory } from "react-router-dom";
import Select from "../../components/Select";
import { Product } from "../../ModelTyping/Product";
import { immediateToast } from "izitoast-react";
import { useLayout } from "../../contexts/layout";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { ImageBoss } from "../../components/Image";
import imageDefault from "../../assets/img/productDefault.png";

export default ({ match }) => {
  const { params } = match;
  const history = useHistory();
  const layoutContext = useLayout();
  const [product, setProduct] = useState<Product>();
  const [datasheet, setDatasheet] = useState([]);
  const [variant, setVariant] = useState(null);
  const [item, setItem] = useState(null);
  const [loadImg, setLoadImg] = useState(true);
  const [productSelected, setProductSelected] = useState<any>();
  interface optionObject {
    [key: string]: any;
  }
  const [options, setOptions] = useState<optionObject>({});

  const handleAddCart = () => {
    if (layoutContext?.addCartItems) {
      const add = { ...productSelected[0] };
      add.featured_asset = product?.product?.featured_asset;
      if (add.stock < 1) {
        let messageError =
          add?.values?.length > 1
            ? add?.values[0]?.option?.name +
              "ou" +
              add?.values[1]?.option?.name +
              "não disponível em estoque no momento"
            : add?.values[0]?.option?.name
            ? add?.values[0]?.option?.name +
              "não disponível em estoque no momento"
            : "Produto não disponível em estoque no momento";
        return immediateToast("error", {
          message: messageError,
          position: "topLeft",
          icon: undefined,
          class: "sm:rounded-full overflow-hidden",
          messageColor: "white"
        });
      }
      console.log('add',add)
      layoutContext?.addCartItems({ ...add }, {});
      immediateToast("success", {
        message: "Item adicionado ao carrinho!",
        position: "topLeft",
        icon: undefined,
        class: "sm:rounded-full overflow-hidden",
        messageColor: "white"
      });
    }
  };
  const PRODUCT_BY_ID = gql`
  query {
    product(id: "${params.productId}") {
      id
      name
      code
      price
      price_formatted
      list_price_formatted
      list_price
      description
      quantity_items
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
        facet{
          id
          name
        }
      }
      assets {
        id
        url
      }
      featured_asset {
        url
      }
      share_asset {
        url
        raw_url
      }
      variants {
        id
        enabled
        name
        sku
        price
        stock
        price_formatted
        list_price
        list_price_formatted
        values {
          id
          name
          option {
            name
          }
        }
      }
    }
  }
`;

  const { data: dataProduct } = useQuery(PRODUCT_BY_ID, {
    fetchPolicy: "no-cache"
  });
  useEffect(() => {
    let variant = options;

    if (dataProduct) {
      if (dataProduct.product && dataProduct.product.options) {
        dataProduct.product.options.forEach((option, i) => {
          variant[option?.name] = option?.values[0]?.name;
        });
      }

      setOptions(variant);
      if (
        dataProduct.product &&
        dataProduct.product.variants &&
        dataProduct.product.variants.length > 0
      ) {
        let selectedInitialVariant = dataProduct.product.variants.filter(
          variantSelected =>
            variantSelected.stock > 0 && variantSelected.enabled === 1
        );
        addProductSelected(selectedInitialVariant.slice(0, 1));
      }
    }
  }, [options, dataProduct]);

  useEffect(() => {
    if (dataProduct) {
      setProduct(dataProduct);
    }
  }, [dataProduct]);

  useEffect(() => {
    if (product?.product?.datasheet) {
      try {
        let parsed = JSON.parse(product?.product?.datasheet);
        setDatasheet(parsed);
      } catch (error) {}
    }
  }, [product]);

  const addProductSelected = useCallback(
    product => {
      if (product.length > 0) {
        setProductSelected(product);
      }
    },

    [setProductSelected]
  );
  function selectedVariant(product: any, variants: any, item: any) {
    let variant = options;
    if (variant) {
      variant[variants?.name] = item?.name;
    }

    let variantValues: any;
    let productVar;
    variantValues = product.product.variants;

    Object.entries(variant).forEach((option, index) => {
      productVar =
        variantValues &&
        variantValues.filter((productVariant: any, i: any) => {
          return (
            productVariant?.values[index].name ===
            variant[productVariant?.values[index].option.name]
          );
        });

      variantValues = productVar;
    });

    addProductSelected(productVar);
  }
  useEffect(() => {
    if (variant && item) {
      selectedVariant(product, variant, item);
    }
  }, [variant]);


   //console.log("productSelected", productSelected);
  if (!product) {
    return <Title mobileTruncate={false}>Carregando...</Title>;
  }
  return (
    <Container className="flex-1">
      <Content className="flex flex-col h-full pb-32 lg:pb-20">
        <div className="lg:fixed mt-3 lg:ml-4 text-4xl ">
          <button
            type="button"
            onClick={() => history.goBack()}
            className="focus:outline-none"
          >
            <i className="uil uil-arrow-left" />
          </button>
        </div>
        <div className="flex lg:mt-5">
          <div className="w-1/12 hidden lg:block"></div>
          <div className="w-full md:w-10/12">
            <Title mobileTruncate={false}>{product?.product?.name}</Title>
          </div>
        </div>
        <div className="flex flex-1 flex-wrap -mx-4 mt-5">
          <div className="w-1/12 px-4 hidden lg:block"></div>
          <div className="w-full sm:w-5/12 lg:w-4/12 px-4 mb-5 overflow-hidden">
            <CarouselProvider
              totalSlides={product?.product?.assets.length}
              naturalSlideWidth={100}
              naturalSlideHeight={125}
              isIntrinsicHeight
              className="relative"
            >
              <ArrowArea direction="prev" className="prev">
                <ButtonBack className="lg:ml-5">
                  <ArrowPrev />
                </ButtonBack>
              </ArrowArea>
              <Slider>
                {product?.product?.assets.length > 0 ? (
                  product.product.assets.map((asset: any, index) => {
                    setTimeout(() => { setLoadImg(false) }, 7000);
                    return (
                      <Slide key={`id${asset.id}`} index={index}>
                          <div style={{minHeight: 300}} className="img bg-opacity-50">
                          <ImageBoss
                            uri={asset.url}
                            height={800}
                            width={580}
                            className="items-center df"
                            operation={"cover:contain"}
                          />
                          {loadImg &&
                            <div className="h-64 flex absolute w-full items-center justify-center">
                              <ReactLoading
                                type="spokes"
                                color="#aeaeae"
                                height={"10%"}
                                width={"10%"}
                              />
                            </div>}
                        </div>

                      </Slide>
                    );
                  })
                ) : (
                  <Slide index={2}>
                    <div style={{ width: 350, height: 450, borderRadius: 5 }}>
                      <img
                        style={{ width: 350, height: 450, borderRadius: 5 }}
                        src={imageDefault}
                        alt="Produto sem imagem"
                      />
                    </div>
                  </Slide>
                )}
              </Slider>
              <ArrowArea direction="next">
                <ButtonNext className="lg:mr-5">
                  <ArrowNext />
                </ButtonNext>
              </ArrowArea>
            </CarouselProvider>
          </div>
          <div className="w-full sm:w-7/12 lg:w-6/12 px-4">
            <div className="inline-flex w-full flex-wrap -mx-1 mb-5">
              {/* {product?.product?.facet_values?.map(
                (facetValue: any, indexFacet: any) => {
                  return (
                    <div key={`index${indexFacet}`} className="px-1">
                      <TagsProduct
                        tag={facetValue.facet.name}
                        value={facetValue.name}
                      />
                    </div>
                  );
                }
              )} */}
            </div>
            <div className="text-text-3 text-sm">
              <div className="mb-4">
                <div className="flex flex-wrap -mx-4">
                  {product?.product?.options.length > 0
                    ? product?.product?.options.map(
                        (option: any, indexOption: any) => (
                          <div
                            key={`id${option.id}`}
                            className="w-full mb-3 md:mb-0 md:w-1/2 lg:w:1/3 px-4"
                          >
                            <Select
                              {...product?.product?.options[indexOption]}
                              setVariant={setVariant}
                              setItem={setItem}
                              productSelected={productSelected}
                            />
                          </div>
                        )
                      )
                    : null}
                </div>
              </div>
              <div className="mb-5">
                <h5 className="text-title">Descrição</h5>
                <div
                  dangerouslySetInnerHTML={{
                    __html: product?.product?.description
                  }}
                />
              </div>
              <div
                style={{
                  display: datasheet.length > 0 ? "flex" : "none",
                  flexDirection: "column"
                }}
              >
                <h5 className="text-title mb-3">Ficha técnica</h5>
                {datasheet?.map((item: any, index: any) => (
                  <p key={index} className="mb-2">
                    <span className="text-title mr-1">{item.name} </span>
                    {item.value}
                  </p>
                ))}
              </div>
            </div>
          </div>
          <div className="w-1/12 px-4 hidden lg:block"></div>
        </div>

      </Content>
      {productSelected ? (
        <div
          className="fixed bottom-0 flex flex-wrap justify-center sm:justify-between items-center bg-primary rounded-t-8 sm:rounded-full sm:mb-5 px-8 py-5 sm:px-3 sm:py-2 w-full sm:w-2/3 lg:w-5/12 xl:w-4/12 sm:left-1/2 transform sm:-translate-x-1/2 lg:-translate-x-10 xl:-translate-x-8 text-white"
          style={{ maxWidth: 485 }}
        >
          <span className="mx-5 sm:mx-2 mb-4 sm:mb-0 opacity-50 line-through ml-1 text-sm">
            {productSelected[0].list_price > 0
              ? `R$ ${productSelected[0].list_price_formatted}`
              : ""}
          </span>
          <span className="mx-5 sm:mx-2 mb-4 sm:mb-0 text-lg">
            <strong>R$ {productSelected[0].price_formatted}</strong>
          </span>
          <button
            className="bg-transparent w-full sm:w-auto py-2 px-8 border border-white rounded-full uppercase text-xs focus:outline-none"
            onClick={handleAddCart}
          >
            Adicionar ao carrinho
          </button>
        </div>
      ) : null}
    </Container>
  );
};
