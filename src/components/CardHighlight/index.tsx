import React from "react";
import { Container } from "./style";
import { ImageBoss } from "../../components/Image";
import { useLayout } from "../../contexts/layout";
import imageDefault from "../../assets/img/productDefault.png";

import { HomeShopCollection } from "../../ModelTyping/HomeShopCollection";
import { ROUTE_TENANT_PRODUCTS } from "../../constants";

const CardHighlight: React.FC<HomeShopCollection> = ({ ...props }) => {
  const layoutContext = useLayout();
  const { catalog, setCatalog } = layoutContext;
  return (
    <Container to={`${ROUTE_TENANT_PRODUCTS()}?tipo=${props?.collection?.id}`}>
      <div
        onClick={() =>
          setCatalog({ ...catalog, currentCollection: props?.collection })
        }
        className="img"
      >
        {props?.collection?.featured_asset?.url ? (
          <ImageBoss
            uri={props?.collection?.featured_asset?.url}
            height={620}
            width={600}
            operation={"cover:attention"}
          />
        ) : (
          <div className="img">
            <img src={imageDefault} alt="Produto sem imagem" />
          </div>
        )}
      </div>
      <div
        onClick={() =>
          setCatalog({ ...catalog, currentCollection: props?.collection })
        }
      >
        {props?.collection?.name}
      </div>
    </Container>
  );
};

export { CardHighlight };
