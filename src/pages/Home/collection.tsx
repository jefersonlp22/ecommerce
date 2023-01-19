import React, { useEffect, useState } from "react";
import { Collection as CollectionProps } from "../../ModelTyping/Collection";
import { CardProduct } from "../../components/CardProduct";
import { HorizontalCarousel } from "../../components/HorizontalCarousel";
import { Title, TextLinked } from "../../components/Typograph";
import { ButtonClear } from "../../components/Buttons";
import { useHistory } from "react-router-dom";
import { Next } from "../../components/Icons/Next";
import { Line } from "../../components/Grid";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import ReactLoading from "react-loading";
import { Product } from "../../ModelTyping/Product";
import { ROUTE_TENANT_PRODUCTS } from "../../constants";
import { useLayout } from "../../contexts/layout";

export const Collection: React.FC<{ data: CollectionProps }> = ({ data }) => {
  const history = useHistory();
  const layoutContext = useLayout();
  const { catalog, setCatalog } = layoutContext;
  const [products, setProducts] = useState<Product[]>();

  const { loading, data: res } = useQuery(gql`
    query{
      catalogProducts(
        first: 5
        hasCollections: {column: ID, operator: EQ, value: ${data.id}}
      ) {
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
  `);

  useEffect(() => {
    if (res) {
      let filterProductEnable = res.catalogProducts.data?.filter(product => {
        return product.enabled === 1
      })
      setProducts(filterProductEnable);
    }
  }, [res]);

  const handleProducts = (query?: string, collection?: CollectionProps) => {
    history.push(`${ROUTE_TENANT_PRODUCTS()}${query ? `?${query}` : ""}`);
    setCatalog({ ...catalog, currentCollection: collection });
  };

  return (
    <div>
      <div className="flex flex-row items-center justify-between mb-5">
        <Title onClick={() => handleProducts(`tipo=${data.id}`, data)}>
          {data.name}
        </Title>
        <TextLinked>
          <ButtonClear
            className="hidden sm:block"
            color="primary"
            onClick={() => handleProducts(`tipo=${data.id}`, data)}
          >
            Ver todos
          </ButtonClear>
          <div className="block sm:hidden">
            <Next
              onClick={() => handleProducts(`tipo=${data.id}`, data)}
              fill="currentColor"
              size={25}
            />
          </div>
        </TextLinked>
      </div>
      {loading && (
        <ReactLoading
          type="bubbles"
          color="#aeaeae"
          height={"5%"}
          width={"5%"}
        />
      )}
      {products && (
        <HorizontalCarousel
          data={products}
          component={CardProduct}
          naturalSlideWidth={100}
          naturalSlideHeight={160}
        />
      )}
      <Line />
    </div>
  );
};
