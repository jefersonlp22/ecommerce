/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { ModalRight } from "../ModalRight";
import { useLayout } from "../../contexts/layout";
import VMasker from "vanilla-masker";
import { InputNumber } from "../InputNumber";
import { immediateToast } from "izitoast-react";
import { ImageBoss } from "../Image";
import { gql } from "apollo-boost";
import { useLazyQuery } from "@apollo/react-hooks";
import ReactLoading from "react-loading";
interface optionObject {
  [key: string]: any;
}

const GET_CART_REFRESH = gql`
query ($cartIds: [Int]){
  refreshCartStore(cart: $cartIds ){
    id
    name
    sku
    enabled
    stock
    product{
      id
      name
      code
      description
      type
      quantity_items
      datasheet
      enabled
      price
      price_formatted
      list_price
      list_price_formatted
      featured_asset{
        id
        url
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
        product{
          featured_asset{
            url
          }
        }
        values {
          id
          name
          option {
            name
          }
        }
      }
      assets{
        id
        url
        raw_url
      }
      options{
        id
        name
        values{
          id
          name
        }
      }
    }
  }
}
`;

const Cart: React.FC = () => {
  const layoutContext = useLayout();
  const [total, setTotal] = useState<number>(0);


  const { cartItems, tenant, setDiscount, discount, storageKey, setCartItems} = layoutContext;

  useEffect(() => {
    setTotal(0);
    setDiscount(0);
    let quantity = 0

    for (let index = 0; index < cartItems.length; index++) {
      quantity = cartItems[index]?.qty + quantity;
    }

    cartItems?.map((item: any) => {
      const itemTotal = item?.product?.price * item?.qty;
      setTotal(value => {
        return value + itemTotal;
      });

      if (tenant.name === 'Wine Eventos' && quantity > 2) {
        //let totalPrice = item?.product?.price * item?.qty

        const totalDiscount =
          (itemTotal * 5) / 100;
        setDiscount(value=>  Math.round(totalDiscount + value));
      }
    });
  }, [cartItems]);

  const [ getCart, {data, loading} ] = useLazyQuery(GET_CART_REFRESH, {
    fetchPolicy: 'no-cache'
  })

  useEffect(() => {
    const cartFromLocalStorage = localStorage.getItem(storageKey);
    const cartParsed = cartFromLocalStorage && JSON.parse(cartFromLocalStorage);
    if (cartParsed) {

      let cartId = []
      for (let index = 0; index < cartParsed.length; index++) {
        cartId.push(Number(cartParsed[index].product?.id))
      }
      getCart({variables:{
        cartIds: cartId
      }})
    }

  }, []);



  useEffect(() => {
    if (data) {
      let updateCart = []
      let filterVariant = []
       let newVariants = []

       cartItems.map((cartItem, index) => {
        filterVariant = data?.refreshCartStore[index].product?.variants
        .filter((variant => variant.id === cartItem.product.id))
        newVariants.push(...filterVariant)
        return filterVariant;
      })

      newVariants.map((item, index) => {
        let indexCartStorage = cartItems.findIndex(cart => {
          return cart.product.id === item.id;
        })
        updateCart.push({
          product: {
            enabled: item?.enabled,
            featured_asset: item?.product?.featured_asset,
            ...newVariants[index],
          },
          qty: cartItems[indexCartStorage].qty,
        })
        return indexCartStorage;
      })

      localStorage.setItem(storageKey, JSON.stringify(updateCart));
      setCartItems(updateCart);
    }
  }, [data]);

  const handleClose = () => {
    if (layoutContext?.setCartOpen) {
      layoutContext?.setCartOpen(false);
    }
  };

  const handleChange = async (value: number, index: number) => {
    if (layoutContext?.changeQtyCartItem) {
      layoutContext?.changeQtyCartItem(value, index);
    }
  };

  const handleSubmit = () => {
    let minTransactionValue = tenant?.data?.payment_methods?.min_transaction_value ;
    if(minTransactionValue && minTransactionValue > 0){
      if( (total / 100) < (minTransactionValue / 100)){
        immediateToast("error", {
          message: `Valor mínimo para pedidos R$ ${minTransactionValue / 100}`,
          position: "topLeft",
          icon: undefined,
          class: "sm:rounded-full overflow-hidden",
          messageColor: "white",
          backgroundColor: '#FF6F6F'
        });
      }else if (layoutContext?.setFormRegisterOpen) {
        handleClose();
        layoutContext?.setFormRegisterOpen(true);
      }
    }else if (layoutContext?.setFormRegisterOpen) {
      handleClose();
      layoutContext?.setFormRegisterOpen(true);
    }
  };

  const renderCard = () => {
    if (loading) {
      return(
        <div className="w-full h-full flex items-center justify-center">
          <ReactLoading
            type="bubbles"
            color="#aeaeae"
            height={"30%"}
            width={"30%"}
          />
        </div>
      )
    }

    return (
      cartItems &&
      cartItems.map((item: any, index) => {
        return (
          <div key={index} className="shadow hover:bg-white px-6">
            <div className="flex py-5 -mx-1">
              <div className="px-1 w-3/12">
                {item?.product?.featured_asset?.url ? (
                  <ImageBoss
                    uri={item?.product?.featured_asset?.url}
                    height={160}
                    width={100}
                    operation={"cover:contain"}
                  />
                ) : null}
              </div>
              <div className="px-1 flex flex-1 justify-between items-between text-xs text-title">
                <div className="flex-1 flex flex-col justify-between">
                  <h3 className="mb-3">{item?.product?.name}</h3>
                  <p className="text-text-3">
                    {item?.product?.values.map(
                      (variant: any, indexV: number) => (
                        <span key={indexV}>
                          {variant?.option?.name} {variant?.name}
                        </span>
                      )
                    )}
                    <br />
                    Preço unitário R$ {item?.product?.price_formatted}
                  </p>
                </div>
                <div className="flex flex-col justify-between items-center w-2/5 pl-2">
                  <InputNumber
                    value={item?.qty}
                    onChange={value => handleChange(value, index)}
                  />
                  <p className="text-right">
                    Total item
                    <br />
                    <span className="text-sm">
                      R${" "}
                      {VMasker.toMoney(item?.product?.price * item?.qty || 0)}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })
    );
  };

  const renderHeader = () => {
    return (
      <h4 className="text-title text-base">
        <i className="uil uil-shopping-cart-alt text-xl"></i> Carrinho
      </h4>
    );
  };

  const renderBody = () => {
    return <div className="bg-silver-3 min-h-full">{renderCard()}</div>;
  };

  const renderFooter = () => {
    if (cartItems?.length && !loading) {
      return (
        <div className="py-5 px-6 flex flex-col justify-center items-center">
          {discount > 0 && (
            <div className="mb-3 text-xs text-danger">
              Desconto - R$ {VMasker.toMoney(discount)}
            </div>
          )}

          <div className="mb-3 text-base text-title font-semibold">
            Total R$ {VMasker.toMoney(total  - discount)}
          </div>
          <button
            className="rounded-full w-full bg-success text-white p-3 uppercase text-xs font-bold focus:outline-none"
            onClick={handleSubmit}
          >
            Finalizar
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <ModalRight
      onClose={handleClose}
      header={renderHeader()}
      children={renderBody()}
      footer={renderFooter()}
    />
  );
};

export { Cart };
