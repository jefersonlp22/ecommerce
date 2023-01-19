/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { Button } from "../Buttons";
import { FormRegisterProps } from "./index.d";
import { useLayout } from "../../contexts/layout";
import InputRadio from "../../components/Radio";
import {TextRadio} from "./style";


const PersonType: React.FC<FormRegisterProps> = ({ onFinish }) => {
  
    const layoutContext = useLayout();
    const {
        formRegisterData: form,
        setFormRegisterData,
    } = layoutContext;
    const [type, setType] = useState('pf');

    const handleSubmit = () => {
        setFormRegisterData({ ...form, type: type });
        onFinish(type); 
        return;
    };
    
  return (
    <div className="sm:py-10 flex flex-col items-center w-full sm:w-2/3">
        <h2 className="mb-10 text-title text-xl text-center">
        <strong>
            Escolha uma das opções abaixo
        </strong>
        </h2>
        <div className="w-full flex-row">
            <div className="flex w-ful justify-center flex-col mb-8">
                <div className="flex w-40 items-baseline flex-row">
                    <InputRadio selectedInput={setType} active={type === 'pf'} value={'pf'}></InputRadio>
                    <TextRadio active={type === 'pf'}>Pessoa física</TextRadio>
                </div>
                <div className="flex w-40 items-baseline flex-row">
                    <InputRadio selectedInput={setType} active={type === 'pj'} value={'pj'}></InputRadio>
                    <TextRadio active={type === 'pj'}> Pessoa jurídica</TextRadio>
                </div>
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

export default PersonType;
