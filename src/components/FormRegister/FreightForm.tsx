/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Button } from "../Buttons";
import { FormRegisterProps } from "./index.d";
import { useLayout } from "../../contexts/layout";
import ReactLoading from "react-loading";
import InputRadio from "../../components/InputRadio";
import {Radio, TextRadio, RadioValues} from "./style";
import {useQuery} from '@apollo/react-hooks';
import { gql } from "apollo-boost";

import empyt from "../../assets/img/empyt.png";
import { isArray } from "lodash";


interface freightProps {
  id?: number
  name?: string
  freight_price?: string
  days_to_delivery?: string
  freight_price_formatted?: string
  setting_id?: string
  has_min_amount_free?: boolean
  min_amount_free?: number
  is_free?: boolean
}

interface erroProps {
  maximum_items?: number
  minimum_items?: number
  minimum_price?: string
}


const FormConfirm: React.FC<FormRegisterProps> = ({ onFinish }) => {
  const [total, setTotal] = useState<number>(0);
  const [erros, setErros] = useState(null);
  // const [erro, setErro] = useState<erroProps>({});

  const [quantity, setQuantity] = useState<number>(0);  const layoutContext = useLayout();
  const {
    formRegisterData: form,
    cartItems,
    setFormRegisterData,
  } = layoutContext;

  useEffect(() => {
    setTotal(0);
    //setDiscount(0);
    let qty = 0;
    cartItems?.map((item: any) => {
      const itemTotal = item?.product?.price * item?.qty ;
      qty += parseInt(item?.qty, 10);
      setTotal(value => {
        return value + itemTotal;
      });
    });
    setQuantity(qty);

  }, [cartItems]);

  let postal_code = form?.address_delivery?.postal_code.replace(/[^\d]+/g, "")
  
  const GET_FREIGHTS = gql`
  query($postal_code: Int!, $total_items: Int!, $total_price: Float){
    shippingOptionsStore(input:{cep: $postal_code, total_items: $total_items, total_price: $total_price}){  
      name
      freight_price
      freight_price_formatted
      days_to_delivery
      setting_id
      has_min_amount_free
      min_amount_free
      is_free
    }
  }
  `;

const {data, loading: loadFreight, error} = useQuery(GET_FREIGHTS, {
  fetchPolicy: 'no-cache',
  variables: {
    postal_code: postal_code,
    total_items: quantity,
    total_price: (total/100)
  }
});

  useEffect(() => {
    if (error) {
      let type = JSON.parse(error.graphQLErrors[0].message);
      setErros(type.data);

      //setErros(JSON.parse(error.graphQLErrors[0].message) )
    }
  }, [error]);

  

  const [freightTypeSelected, setFreightTypeSelected] = useState <freightProps>({});
  const [freightTypes, setFreightTypes] = useState <freightProps[]>([]);
  
  useEffect(() => {
    if (data) {
      setFreightTypes(data?.shippingOptionsStore)
    }
  }, [data]);

  useEffect(() => {
    if (freightTypes.length > 0) {
      setFreightTypeSelected(freightTypes[0])
    }
  }, [freightTypes]);

  const handleSubmit = () => {
    setFormRegisterData({ ...form, freight: freightTypeSelected });
    onFinish(freightTypeSelected);
  };

  let array = isArray(erros);

  return (
    <>
      {loadFreight ? (
        <div className="sm:py-10 flex flex-col items-center w-full sm:w-2/3">
          <ReactLoading
            type="bubbles"
            color="#aeaeae"
            height={"30%"}
            width={"30%"}
          />
        </div>
      ) : (
        freightTypes.length > 0 ? 
        (<div className="sm:py-10 flex flex-col items-center w-full">
          <h2 className="mb-10 text-title text-xl text-center">
            <strong>
            Defina o tipo de entrega para este pedido
            </strong>
          </h2>
          <div >            
            <div className="grid gap-2 w-full grid-cols-3">
              <RadioValues className="col-start-2" >Valor</RadioValues><RadioValues> Previsão</RadioValues>
            </div>
            {freightTypes.map((freightType, index) => {
              return(
                <div className="grid gap-2 w-full grid-cols-3" key={`shipType${index}`}>
                  <Radio>
                    <InputRadio selectedInput={setFreightTypeSelected} selected={freightTypeSelected} value={freightType} />
                  </Radio>
                  <TextRadio active={freightType.setting_id === freightTypeSelected?.setting_id}> 
                    {freightType?.is_free ? `Grátis` : `R$ ${freightType?.freight_price_formatted}` }
                  </TextRadio>
                  <TextRadio active={freightType.setting_id === freightTypeSelected?.setting_id}> 
                    {freightType?.days_to_delivery} Dias úteis
                  </TextRadio>
                </div>
              );
            })
            }          
          </div>

          <div className="px-3 w-full sm:px-0">
              <Button
                type="button"
                color="success"
                onClick={() => handleSubmit()}
              >
                Fechar pedido
              </Button>
            </div>

        </div> ) : ( erros ? 
          (<div className="sm:py-10 flex flex-col items-center w-full sm:w-2/3">
            <div className="mb-5">
              <img width={80} loading="lazy" src={empyt} alt="" />
            </div>
            <h2 className="mb-10 text-title text-xl text-center">
              <strong>
                Ops!
              </strong>
            </h2>
            { array ? 
              ( 
                <div className="w-full">
                  <p className="text-center text-text-1 mb-5">
                    { erros[0].maximum_items < quantity ? `Quantidade máxima de items pra esse frete: ${erros[0].maximum_items}`: ''}
                  </p>
                  <p className="text-center text-text-1 mb-5">
                    { erros[0].minimum_items > quantity ? `Quantidade mínima de items pra esse frete: ${erros[0].minimum_items}`: ''}
                  </p>
                  <p className="text-center text-text-1 mb-5">
                    { parseInt(erros[0].minimum_price, 10) > total ? `Valor mínimo de compras pra esse frete: ${erros[0].minimum_price}`: ''}
                  </p>
                </div>
              ) : 
              (
                <div className="w-full">
                  <p className="text-center text-text-1 mb-5">
                    No momento não há modalidade <br/>de envio/frete disponível para entrega do seu pedido.<br/><br/>
                    Entre em contato com o seu lover.
                  </p>
                </div>
              ) 
            }
        </div>) : 
          (
            <div className="sm:py-10 flex flex-col items-center w-full sm:w-2/3">
              <div className="w-full">
                <p className="text-center text-text-1 mb-5">
                  Frete Gratis! 
                </p>
              </div>
              <div className="px-3 sm:px-0">
                <Button
                  type="button"
                  color="success"
                  onClick={() => handleSubmit()}
                >
                  Fechar pedido
                </Button>
              </div>
            </div>
          )
        )
      )}
    </>
  );
};

export default FormConfirm;
