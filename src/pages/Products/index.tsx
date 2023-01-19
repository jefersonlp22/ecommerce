/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Container, Content, Line } from "../../components/Grid";
import { Title, TextLinked } from "../../components/Typograph";
import { ButtonClear } from "../../components/Buttons";
import { CardProduct } from "../../components/CardProduct";
import { Animate } from "../../components/Animate";
import { useLayout } from "../../contexts/layout";
import Pagination from "@material-ui/lab/Pagination";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { gql } from "apollo-boost";
import { useHistory } from "react-router-dom";
import { ROUTE_TENANT_PRODUCTS } from "../../constants";

export default () => {
  const urlParams = new URLSearchParams(window.location.search);
  const page = parseInt(urlParams.get("page") ?? "1", 10);
  const history = useHistory();
  const [title] = useState<string>("Produtos");
  const layoutContext = useLayout();
  const { catalog, setCatalog } = layoutContext;
  const [productsIds] = useState<number>(0);
  const [valueSearch] = useState<string>("");
  const [loadPage, setLoadPage] = useState(false);
  const useStyles = makeStyles(theme =>
    createStyles({
      root: {
        "& > * + *": {
          marginTop: theme.spacing(10),
          marginLeft: "800px"
        }
      }
    })
  );
  const classes = useStyles();

  const PRODUCTS_PAGINATION = gql`
    query catalogProducts($page: Int, $first: Int!) {
      catalogProducts(
        first: $first
        page: $page
          filter:{column: ID, operator: NOT_IN, value: [${productsIds}]
              AND: [
                ${catalog?.searchProductName ?
                  `{ column: NAME, operator: LIKE, value: "%${catalog?.searchProductName}%" }`
                  :
                  ''
                }

                # {
                #   OR: [
                #       { column: CODE, operator: EQ, value: "${valueSearch}"}
                #     ]
                #   }
                ]
            }
        ${
          catalog?.currentCollection?.id
            ? `hasCollections: {column: ID, operator: EQ, value: ${catalog?.currentCollection.id}}`
            : ""
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
  const { loading, data: productsCatalog, networkStatus } = useQuery(
    PRODUCTS_PAGINATION,
    {
      variables: {
        page: page,
        first: 30
      },
      fetchPolicy: "cache-first",
      notifyOnNetworkStatusChange: true,
      onCompleted: () => {
        if (
          productsCatalog &&
          productsCatalog.catalogProducts &&
          productsCatalog.catalogProducts.data.length > 0
        ) {
          setLoadPage(false);
          if (setCatalog) {
            setCatalog({
              ...catalog,
              products: {
                ...catalog?.products,
                data: [
                  catalog?.products?.data,
                  ...productsCatalog.catalogProducts.data
                ]
              },
              currentProductsByCollection: productsCatalog.catalogProducts
            });
          }
        }
      }
    }
  );

  useEffect(() => {
    if (networkStatus) {
      networkStatus < 7 ? setLoadPage(true) : setLoadPage(false);
    }
  }, [networkStatus]);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    const type = urlParams.get("tipo");
    history.push(`${ROUTE_TENANT_PRODUCTS()}?tipo=${type}&page=${value}`);
  };
  const renderLoading = () => {
    if (loading || loadPage) {
      return (
        <div className="df fdr alic jc-sb">
          <Title>Carregando...</Title>
        </div>
      );
    }
    return null;
  };
  const renderContent = () => {
    if (!loading || !loadPage) {
      return (
        <Animate>
          <div className="flex flex-row justify-between items-start">
            <Title mobileTruncate={false}>{title}</Title>
            <TextLinked>
              <ButtonClear
                color="title"
                className="inline-flex items-center text-base"
              >
                {/* <span className="hidden sm:block">Filtrar</span> <Filter /> */}
              </ButtonClear>
            </TextLinked>
          </div>
          <Line size={10} />

          <Line />
          <div className="flex flex-wrap -mx-1 md:-mx-4">
            {catalog?.currentProductsByCollection?.data.map(
              (item: any, index: any) => (
                <div
                  className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 px-1 md:px-4 mb-3 md:mb-8"
                  key={index}
                >
                  <CardProduct {...item} />
                </div>
              )
            )}
          </div>
          <div
            style={{
              display: catalog?.products?.data.length > 0 ? "flex" : "none"
            }}
          >
            <div className={classes.root}>
              <Pagination
                count={
                  productsCatalog?.catalogProducts?.paginatorInfo?.lastPage
                }
                page={page}
                variant="outlined"
                color="primary"
                onChange={handleChange}
              />
            </div>
          </div>
          <Line />
        </Animate>
      );
    }
    return null;
  };
  return (
    <Container>
      <Content>
        <Line />
        {renderLoading()}
        {renderContent()}
      </Content>
    </Container>
  );
};
