/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Icon from "./icon";
import { IconCancel } from "../Icons/Cancel";
import { InputProps } from "./index.d";
import { Container, InputContent, Input, Results } from "./index.style";
import { searchStr } from "../../utils";
import { useLayout } from "../../contexts/layout";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { ImageBoss } from "../../components/Image";
import ReactLoading from "react-loading";


let currentProduct = []
const Search: React.FC<InputProps> = () => {
  const history = useHistory();

  const [inputRef, setInputRef] = useState<HTMLInputElement>();
  const [toggle, setToogle] = useState<boolean>(false);
  const [showClear, setShowClear] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const [focus, setFocus] = useState<boolean>(false);
  const layoutContext = useLayout();
  const { catalog, setCatalog } = layoutContext;
  const [products, setProducts] = useState([]);

  const handleToogle = (value: boolean) => {
    setToogle(value);
    if (value) {
      inputRef?.focus();
    }
  };

  const PRODUCTS_PAGINATION = gql`
    query catalogProducts($page: Int, $first: Int!) {
      catalogProducts(
        first: $first
        page: $page
          filter:{column: NAME, operator: LIKE, value: "%${value}%"}
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
  const { loading, data: productsCatalog } = useQuery(PRODUCTS_PAGINATION, {
    variables: {
      page: 1,
      first: 60
    },
    fetchPolicy: "network-only",
    skip: currentProduct.length > 8,
    onCompleted: () => {
      if (
        productsCatalog &&
        productsCatalog.catalogProducts &&
        productsCatalog.catalogProducts.data.length > 0
      ) {
        setProducts(productsCatalog.catalogProducts.data);
      }
    }
  });

  const handleResult = (search?: any) => {
    setShowClear(true);
    inputRef?.blur();
    setValue(search?.name || "");
    //if (history.location.pathname === "/produtos" && history.location.search) {
    //const parse = queryString.parse(history.location.search);
    //parse.s = search;
    if (setCatalog) {
      setCatalog(
        { ...catalog, selectedProduct: search });
    }
    history.push(`/produto/${search?.id}`);
    return;

    //history.push(`/produto?s=${search}`);
  };
  const handleClear = () => {
    setShowClear(false);
    setValue("");
    if (setCatalog) {
      setCatalog(
        { ...catalog, searchProductName: ''});
    }
  };

  const renderResults = () => {
    if (toggle && value.length >= 2 && focus) {
      const mock = products.reverse();

      const res = mock.filter(item => searchStr(item?.name || "", value));

      currentProduct = res;

      return (
        <Results className="absolute w-full -mt-1 text-sm">
          <div>
            {res.length > 0 ? (
              res.map((item: any, index) => {
                return (
                <div onClick={() => handleResult(item ?? {})} key={index} className="flex items-center px-1 justify-between">
                  <div className="h-24 w-24 rounded-md">
                    {item?.featured_asset?.url ?
                      <ImageBoss
                      uri={item?.featured_asset?.url}
                      height={120}
                      width={120}
                      className="items-center rounded-md"
                      operation={"cover:contain"}
                    />
                    :
                    null
                    }
                  </div>
                  <div className="flex flex-col justify-between">
                    <div
                      className="px-4 text-title text-xs w-full text-left focus:outline-none"
                    >
                      {item.name}
                    </div><div
                      className="px-4 text-silver-1 text-xs w-full text-left focus:outline-none"
                    >
                      {item?.quantity_items ? `Quantidade: ${item?.quantity_items}` : ''}
                    </div>
                  </div>
                </div>
              )})
            ) : !loading ? (
              <div className="py-3 px-4 text-title w-full text-left focus:outline-none">
                {" "}
                Nenhum resultado
              </div>
            ) : null}
            {loading && (
              <div className="df alic jc-c">
                <ReactLoading
                  type="bubbles"
                  color="#aeaeae"
                  height={"20%"}
                  width={"20%"}
                />
              </div>
            )}
            <div onClick={handleSubmit} className="text-xs w-full textt-center flex items-center justify-center px-4 text-silver-1 py-4 cursor-pointer ">+ Mostrar mais</div>
          </div>
        </Results>
      );
    }
    return null;
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    inputRef?.blur();
    if (setCatalog) {
      setCatalog(
        { ...catalog, searchProductName: value, currentCollection: ''});
    }
    history.push(`/produtos`);
    setShowClear(true);

    //handleResult(value);
  };

  const search = value => {
    setValue(value);
  }

  useEffect(() => {
    if (!focus && value === '') {
      if (setCatalog) {
        setCatalog(
          { ...catalog, searchProductName: value});
      }
    }
  }, [focus]);

  return (
    <Container toggle={toggle}>
      <IconCancel
        onClick={() => handleToogle(false)}
        cursor="pointer"
        className="search__cancel"
      />
      <InputContent onSubmit={handleSubmit} toggle={toggle}>
        <div className="flex items-center">
          {toggle && (
            <Input
              type="text"
              value={value}
              placeholder="Buscar"
              ref={(input: HTMLInputElement) => {
                setInputRef(input);
              }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                search(e.target.value)
              }
              onFocus={() => setFocus(true)}
              onBlur={() => {
                setTimeout(() => {
                  setFocus(false);
                }, 500);
              }}
            />
          )}
          {showClear && (
            <button type="button" onClick={handleClear}>
              <i className="uil uil-trash-alt text-xl text-title focus:outline-none" />
            </button>
          )}
        </div>
        {renderResults()}
      </InputContent>
      <Icon
        onClick={() => handleToogle(!toggle)}
        cursor="pointer"
        className="search__svg"
      />
    </Container>
  );
};

export { Search };
