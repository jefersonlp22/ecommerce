import React from "react";
import currency from "currency.js";
import { Container, Content } from "./style";
import { useLayout } from "../../contexts/layout";
import { ImageBoss } from "../../components/Image";
import imageDefault from "../../assets/img/productDefault.png";

import { Product } from "../../ModelTyping/Product";
import { ROUTE_TENANT_PRODUCT } from "../../constants";

const CardProduct: React.FC<Product> = ({ ...props }) => {
  const {
    name,
    type,
    code,
    quantity_items,
    price_formatted,
    list_price_formatted,
    price,
    list_price
  } = props;
  const layoutContext = useLayout();
  const { catalog, setCatalog } = layoutContext;

  let priceForUnit = currency(price / 100, {
    decimal: ",",
    separator: "."
  })
    .divide(quantity_items)
    .format();

  return (
    <Container
      to={`${ROUTE_TENANT_PRODUCT(props.id)}`}
      onClick={() => {
        if (setCatalog) {
          setCatalog({ ...catalog, selectedProduct: props });
        }
      }}
    >
      {props.featured_asset?.url ? (
        <div className="img">
          <ImageBoss
            uri={props.featured_asset.url}
            height={360}
            width={260}
            operation={"cover:contain"}
          />
        </div>
      ) : (
        <div className="img">
          <img src={imageDefault} alt="Produto sem imagem" />
        </div>
      )}
      <Content>
        {code && <div className="cod">Cod: {code}</div>}
        <div className="name">
          {name}
          {quantity_items && quantity_items > 1
            ? `  (${quantity_items}un)`
            : ""}
        </div>

        {price > 0 ? (
          <div className="flex flex-col justify-center items-start">
            {list_price > 0 ? (
              <div className="price oldPrice">R$ {list_price_formatted}</div>
            ) : null}

            <div className="price">R$ {price_formatted}</div>
            <div className="price">
              {price_formatted && type === "compound"
                ? `R$ ${priceForUnit}/unid.`
                : null}
            </div>
            {/* {quantity_items && quantity_items > 1 ? (
              <IconEye
                className="iconToggle"
                onClick={() => setToggle(!toggle)}
              />
            ) : null} */}
          </div>
        ) : (
          <div className="price">Indísponivel</div>
        )}
      </Content>
    </Container>
  );
};

export { CardProduct };
