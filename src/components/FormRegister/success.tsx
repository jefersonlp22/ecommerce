/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Button } from "../Buttons";
import { FormRegisterProps } from "./index.d";
import successForm from "../../assets/img/form-success.png";
import ReactLoading from "react-loading";
import { useLayout } from "../../contexts/layout";

const FormSuccess: React.FC<FormRegisterProps> = ({
  onFinish,
  loading,
  transaction
}) => {
  const layoutContext = useLayout();

  const invoice = () => {
    layoutContext?.setFormRegisterStep(1)
    layoutContext?.setFormRegisterOpen(false)
    onFinish([]);
    window.open(
      `${process.env.REACT_APP_INVOICE}/fatura/${transaction[0]?.external_id}`,
      "_blank"
    );
  };

  const handleConfirm = () => {
    layoutContext?.setFormRegisterStep(1)
    layoutContext?.setFormRegisterOpen(false)
  }

  return (
    <div className="sm:py-10 flex flex-col items-center w-full sm:w-2/3">
      <div className="mb-5">
        <img width={230} loading="lazy" src={successForm} alt="" />
      </div>
      <h2 className="mb-5 text-title text-xl text-center">
        {loading ? (
          <strong>Estamos quase lá!</strong>
        ) : transaction.length > 0 ? (
          <strong>Prontinho!</strong>
        ) : (
          <strong>Prontinho! <br />Seu pedido foi solicitado!!</strong>
        ) }
      </h2>

      <div className="w-full">
        {loading ? (
          <div className="text-center text-text-1 mb-5">
            <p className="text-center text-text-1 mb-5">
              Aguarde a confirmação do seu pedido...
            </p>
            <div className="flex flex-col items-center">
              <ReactLoading
                type="bubbles"
                color="#aeaeae"
                height={"30%"}
                width={"30%"}
              />
            </div>
          </div>
        ) : transaction.length > 0 ? (
          <p className="text-center text-text-1 mb-5">
            Acesse a fatura para pagamento.
          </p>
        ) : (
          <p className="text-center text-text-1 mb-5">
            Aguarde que a aprovação será informada <br />por email
            ou entre em contato <br />com {layoutContext?.ambassador?.name}.
          </p>
        )}
        <div className="px-3 sm:px-0">
          {transaction.length > 0 ? (
            <div className="mb-3">
              <Button type="button" onClick={invoice} color="primary-dark">
                ACESSAR AGORA
              </Button>
            </div>
          ) : (!loading &&
            <div className="mb-3">
            <Button type="button" onClick={() => handleConfirm()} color="primary-dark">
              OK
            </Button>
          </div>
          )
        }
          {/* <Button type="button" onClick={onFinish} color="secundary-dark">
            Reenviar
          </Button> */}
        </div>
      </div>
    </div>
  );
};

export default FormSuccess;
