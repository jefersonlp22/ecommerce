/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { Button } from "../Buttons";
import { FormRegisterProps } from "./index.d";
import { useLayout } from "../../contexts/layout";
import InputRadio from "../../components/Radio";
import {TextRadio} from "./style";


const PaymentType: React.FC<FormRegisterProps> = ({ onFinish }) => {

  const layoutContext = useLayout();
  const {
    formRegisterData: form,
    setFormRegisterData,
  } = layoutContext;

  const [type, setType] = useState('BANK_SLIP');

  const handleSubmit = () => {
    setFormRegisterData({ ...form, payment_type: type });
    onFinish(type);
    return;
  };

  console.log('form',form);
  return (
    <div className="sm:py-10 flex flex-col items-center w-full sm:w-2/3">
        <h2 className="mb-10 text-title text-xl text-center">
        <strong>
            Escolha a forma de pagamento de sua preferência
        </strong>
        </h2>
        <div className="w-full flex-row">
            <div className="flex w-ful justify-center flex-row">
                <div  onClick={() => setType('BANK_SLIP')} className="flex w-32 items-baseline flex-row cursor-pointer">
                    <InputRadio selectedInput={setType} active={type === 'BANK_SLIP'} value={'BANK_SLIP'}></InputRadio>
                    <TextRadio active={type === 'BANK_SLIP'}>Boleto</TextRadio>
                </div>
                <div onClick={() => setType('CREDIT_CARD')} className="flex w-32 items-baseline flex-row cursor-pointer">
                    <InputRadio selectedInput={setType} active={type === 'CREDIT_CARD'} value={'CREDIT_CARD'}></InputRadio>
                    <TextRadio active={type === 'CREDIT_CARD'}> Crédito</TextRadio>
                </div>
            </div>
            <div className="flex w-ful justify-center flex-col">
                <p className="text-center text-xs text-text-1 mb-5">
                { type === 'BANK_SLIP' ? 'Descrição' : '' }
                </p>
                <p className="text-center text-xs text-primary mb-5">
                    { type === 'BANK_SLIP' ?
                        'Pague em até 2 dias úteis utilizando o código de barras ou impressão do boleto.Atenção! \n Pagamentos em boleto acrescentam 2 dias úteis ao prazo de entrega'
                    :
                        ''
                    }
                </p>
            </div>
            <div className="px-3 sm:px-0">
                <Button
                    type="button"
                    color="primary"
                    onClick={() => handleSubmit()}
                >
                    AVANÇAR
                </Button>
            </div>
        </div>
    </div>
  );
};

export default PaymentType;
