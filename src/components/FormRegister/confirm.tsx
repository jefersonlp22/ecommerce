/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Button } from "../Buttons";
import { FormRegisterProps } from "./index.d";
import CardConfirm from "./card";
import { useLayout } from "../../contexts/layout";
import VMasker from "vanilla-masker";
import ReactLoading from "react-loading";

const FormConfirm: React.FC<FormRegisterProps> = ({ onFinish, loading }) => {
  const layoutContext = useLayout();
  //const [discount, setDiscount] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [subTotal, setSubTotal] = useState<number>(0);

  const { cartItems } = layoutContext;

  useEffect(() => {
    setTotal(0);
    setSubTotal(0);
    //setDiscount(0);
    let qty = 0;
    cartItems?.map((item: any) => {      
      let itemTotal = item?.product?.price * item?.qty;    
      const itemSubTotal = item?.product?.price * item?.qty;

      if(layoutContext?.tenant?.data?.freight_methods && !form?.freight?.is_free){
        itemTotal = (item?.product?.price * item?.qty) + parseInt(form?.freight?.freight_price ,10)
      }

      qty += parseInt(item?.qty, 10);
      setTotal(value => {
        return value + itemTotal;
      });
      setSubTotal(value => {
        return value + itemSubTotal;
      });
      if (
        item?.product?.list_price &&
        item?.product?.list_price > item?.product?.price
      ) {
        // const subTotalDiscount =
        //   (item?.product?.list_price - item?.product?.price) * item?.qty;
        // setDiscount(value => {
        //   return value + subTotalDiscount;
        // });
      }
    });
    setQuantity(qty);
  }, [cartItems]);

  const {
    formRegisterData: form,
    setFormRegisterStep,
    setFormRegisterIsEditing,
    setFormRegisterOpen,
    setCartOpen
  } = layoutContext;

  const edit = (step: number) => {
    if (setFormRegisterStep) {
      setFormRegisterStep(step);
    }
  };

  const openCart = () => {
    if (setFormRegisterOpen && setCartOpen) {
      setFormRegisterOpen(false);
      setCartOpen(true);
    }
  };

  useEffect(() => {
    if (setFormRegisterIsEditing) {
      setFormRegisterIsEditing(true);
    }
  }, []);

  return (
    <>
      {loading ? (
        <div className="sm:py-10 flex flex-col items-center w-full sm:w-2/3">
          <h2 className="mb-10 text-title text-xl text-center">
            <strong>Finalizando o seu pedido...</strong>
          </h2>

          <ReactLoading
            type="bubbles"
            color="#aeaeae"
            height={"30%"}
            width={"30%"}
          />
        </div>
      ) : (
        <div className="sm:py-10 flex flex-col items-center w-full sm:w-2/3">
          <h2 className="mb-10 text-title text-xl text-center">
            <strong>
              Quase lá! Confirme
              <br />
              antes de prosseguir:
            </strong>
          </h2>
          <div className="w-full">
            <CardConfirm
              headerLeft={<i className="uil uil-user" />}
              header={
                <div className="flex flex-col">
                  <span>{layoutContext?.ambassador?.name}</span>
                  <span>{layoutContext?.tenant?.name}</span>
                </div>
              }
            />
            <CardConfirm
              headerLeft={<i className="uil uil-shopping-cart-alt" />}
              header={<span>R$ {VMasker.toMoney(subTotal)}</span>}
              onClick={openCart}
            >
              <p>
                {quantity} {quantity > 1 ? "itens" : "item"}
              </p>
              {/* <p>Desconto - R$ {VMasker.toMoney(discount)}</p> */}
            </CardConfirm>
            <CardConfirm
              headerLeft={<i className="uil uil-users-alt" />}
              header={<span>{form?.email}</span>}
            />
            <CardConfirm
              headerLeft={<i className="uil uil-map-marker" />}
              header={<span>Endereço</span>}
              onClick={() => {
                edit(5);
              }}
            >
              <p>
                {form?.address_delivery?.address}, {form?.address_delivery?.number}
              </p>
              <p>
                {form?.address_delivery?.city} - {form?.address_delivery?.state} {form?.address_delivery?.postal_code}
              </p>
            </CardConfirm>

            <CardConfirm
                headerLeft={<i className="uil uil-receipt" />}
                header={<span>NF: {form?.dataNf.nf_name}</span>}
                onClick={() => {
                  edit(6);
                }}
                >
                <p>
                  {form?.payment_type === 'pf' ? form?.dataNf.nf_email : form?.dataNf?.nf_company_name}
                </p>
            </CardConfirm>
            {layoutContext.tenant.name === 'Wine Eventos' ?
            <>
              <CardConfirm
                headerLeft={<i className="uil uil-schedule" />}
                header={<span>Evento {form?.eventDate}</span>}
                onClick={() => {
                  edit(8);
                }}
              />

              <CardConfirm
                headerLeft={<i className="uil uil-usd-circle" />}
                header={<span>{form?.payment_type === 'BANK_SLIP' ? 'Boleto' : 'Catão de crédito'}</span>}
                onClick={() => {
                  edit(8);
                }}
                >
                <p>
                  Pagamento via link de pagamento
                </p>
              </CardConfirm>
              <CardConfirm
                headerLeft={<i className="uil uil-truck" />}
                header={<span>Entrega: {form?.delivery_type}</span>}
                onClick={() => {
                  edit(8);
                }}
                >
                <p>
                  Previsão: {form?.delivery_estimate}
                </p>
              </CardConfirm>
            </>
             :
             <div></div>
            }

            {layoutContext?.tenant?.data?.freight_methods ? 
              <CardConfirm
                headerLeft={<i className="uil uil-truck" />}
                header={<span>Frete</span>}
                onClick={() => {
                  edit(7);
                }}
              >
                {form?.freight ?
                  <div>
                    <p>
                      {form?.freight?.name}
                    </p>
                    { form?.freight?.is_free ? 
                      (
                        <p>
                        Grátis!
                      </p>
                      ) : 
                     ( 
                      <p>
                        Preço : {form?.freight?.freight_price_formatted}
                      </p>
                      )
                    }
                    <p>
                      Previsão de entrega : {form?.freight?.days_to_delivery} úteis.
                    </p>
                  </div>
                  : 
                  <div>
                      <p>Frete Gratis</p>
                  </div>
                }              
              </CardConfirm>
            : null}
            <div className="py-6 text-center">
              {/* <p className="text-text-3 my-1 text-xs">Taxas R$24,00</p> */}
              <p className="text-danger my-1 text-xs">
               {layoutContext?.discount >  0 ? `- Desconto R$ ${VMasker.toMoney(layoutContext?.discount)}` : ''}
              </p>
              <p className="text-title my-1 text-base font-semibold">
                Total R$ {VMasker.toMoney(total - layoutContext?.discount)}
              </p>
            </div>
            <div className="px-3 sm:px-0">
              <Button
                type="button"
                color="success"
                onClick={() => onFinish(form)}
              >
                Fechar pedido
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormConfirm;
