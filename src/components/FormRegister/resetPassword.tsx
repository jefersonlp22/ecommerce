/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import { TextField } from '@material-ui/core';
import { Button, ButtonSecondary } from '../Buttons';
import { FormRegisterProps } from './index.d';
import { isValidEmail } from '@brazilian-utils/brazilian-utils';
import { useForm, Form } from '../../hooks/useForm';
import { useLayout} from "../../contexts/layout";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import ReactLoading from "react-loading";
import { immediateToast } from "izitoast-react";
import { Modal } from "../Modal";

const ResetPassword: React.FC<FormRegisterProps> = ({ onFinish, resetPassword }) => {
  const layoutContext = useLayout();
  const { formRegisterData: form, setFormRegisterData, tenant, customer, handleCustomer, setFormRegisterStep} = layoutContext;
  const [viewPassword, setViewPassword] = useState(false);
  const [logued, setLogued] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [tokenValidate, setTokenValidate] = useState(false);

  const initialFValues = {
    email: form?.email ?? '',
    token: ''
  };

  const RESET = gql`
    mutation($email: String){
        customerGenerateToken(
        input:{
            tenant_id: ${tenant?.id},
            email: $email,
        }   
        )
    } 
  `;

  const VALIDATE_TOKEN = gql`
    mutation($email: String $recover_token: String ){
        customerValidateRecoverToken(
            input:{
                tenant_id: ${tenant?.id},
                email: $email,
                recover_token: $recover_token
            }   
        )
        {
            id
        }
    } 
  `;

  const RECOVER_PASSWORD = gql`
  mutation($id: Int $password:  String){
    customerRecoverPass(input:{id: $id password: $password}){
      id
      auth_token
      name
      email
      phone
      document
      birthday
      type
      company_name
      company_document
      
      addresses{
        id
        customer_id
        name
        city
        city_code
        postal_code
        addressee
        address
        number
        local_reference
        complement
        district
        state
        creator_user_id
      }
      orders{
        id
        code
        customer_id
        tenant_id
        subtotal
        total
        subtotal_formatted
        total_formatted
          user_id
        payment_method
        external_id
        created_at
        paid_at
        placed_at
        approved_at
        billed_at
        delivered_at
        shipped_at
        canceled_at
        items{
          id
          name
          quantity
          price
          subtotal
          total
        }
        delivery{
          id
          postal_code
          name
          addressee
          address
          number
          complement
          district
          local_reference
          city
          state
        }
        shippings{
          id
          desired_delivery_at
          delivery_estimate
          shipping_method
          shipping_price
          working_days
        }
        transactions{
          id
          external_id
          external_url
          payment_method
          due_date
          data
          created_at
          status
        }
      }
    }
  }
  `;

  const [handleResetPassword, {loading}] = useMutation(RESET)
  const [validateToken, {loading: loadValidate, data}] = useMutation(VALIDATE_TOKEN)
  const [recoverPassword, {loading: loadRecover, data: dataRecovery}] = useMutation(RECOVER_PASSWORD)


  const validPassword = (password) => {

    let valilid  =  password.length >= 8 &&
    password.match(/[!@#$%&;*]+/) &&
    password.match(/[0-9]+/) &&
    (password.match(/[a-z]+/) || password.match(/[A-Z]+/))

    return valilid
  }


  const validate = (fieldValues = values) => {
    const temp: any = { ...errors };

    if ("email" in fieldValues) {
      temp.email = isValidEmail(fieldValues?.email)
        ? ""
        : "Email não é válido.";
    }

    if ("password" in fieldValues && "confirm_password" in fieldValues) {

        if (validPassword(fieldValues.password)) {        
            temp.password = ''
          } else{
            temp.password = 'Senha inválida, mínimo 8 caracteres, número e caractere especial'
          }
      temp.confirm_password = fieldValues.password === fieldValues.confirm_password
        ? ""
        : "Senhas diferentes.";
    }

    setErrors({ ...temp });

    if (fieldValues === values) {
      return Object.values(temp).every((x) => x === "");
    }

  };

  const { values, errors, setErrors, handleInputChange, resetForm } = useForm(
    initialFValues,
    true,
    validate
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (values?.password !== values?.confirm_password)  {
   
    if (validate()) {
      setFormRegisterData({ ...form, ...values });
      let recovery = await recoverPassword({
          variables: {
              id: data?.customerValidateRecoverToken?.id,
              password: values?.password
          }
      }).catch((err) => {
        immediateToast("error", {
        message: err.graphQLErrors[0].message,
        position: "topLeft",
        icon: undefined,
        class: "sm:rounded-full overflow-hidden",
        messageColor: "white"
        });
    })
    if (recovery) {
        setLogued(true)
    }
    }
  };

  const handleTokenValidate = async (e) => {
    e.preventDefault();
    // if (values?.password !== values?.confirm_password)  {
    setFormRegisterData({ ...form, ...values });
    resetForm();
   let validate = await validateToken({variables: {
    recover_token: values?.token,
    email: values?.email
   }}).catch((err) => {
        immediateToast("error", {
        message: err.graphQLErrors[0].message,
        position: "topLeft",
        icon: undefined,
        class: "sm:rounded-full overflow-hidden",
        messageColor: "white"
        });
    })
    if (validate) {
        setAuthenticated(true)
    }
  }

  const reset = async (e) => {
      e.preventDefault();
      if (validate()) {
        setFormRegisterData({ ...form, ...values });
      } 
      let reset = await handleResetPassword({variables: {email: values?.email}}).catch((err) => {
        immediateToast("error", {
          message: err.graphQLErrors[0].message,
          position: "topLeft",
          icon: undefined,
          class: "sm:rounded-full overflow-hidden",
          messageColor: "white"
        });
      })
      if (reset) {
          setTokenValidate(true)
          setHasToken(true)
      }
  };


  const handleLogued = () => {
    setLogued(false);
    layoutContext?.setFormRegisterOpen(false);
    document.location.reload(true);
    //history.push(`${ ROUTE_TENANT_HOME()}`);
  }

  useEffect(() => {
    if (dataRecovery) {
      handleCustomer(dataRecovery?.customerRecoverPass)
      setFormRegisterData({...form, ...dataRecovery?.customerRecoverPass})
      
    }
  }, [dataRecovery]);

  useEffect(() => {
    if (customer) {
      setFormRegisterData({...form, ...customer})
      setFormRegisterStep(5)
    }
  }, []);

  if (loading || loadValidate || loadRecover) {
    return(
      <div className="sm:py-10 flex flex-col items-center w-full sm:w-2/3">
        <ReactLoading
          type="bubbles"
          color="#aeaeae"
          height={"30%"}
          width={"30%"}
        />
      </div>
    )
  }

  const renderModal = () => {
    if (tokenValidate) {
      return (
        <Modal onClose={() =>  setTokenValidate(false)}>
            <div className="flex py-8 flex-col items-center justify-center px-8 ">
                <p className=" text-title text-center text-lg mb-2">Um código foi enviado para o email <br/> {form?.email}</p>
                <i className="uil uil-grin mr-5 text-text-1 mb-2 text-5xl" />
                <Button onClick={() =>  setTokenValidate(false)} type="button" className="teste2 mb-4">
                    Ok
                </Button>
            </div>
        </Modal>
      );
    }
    return null;
  };
  const renderAuthenticated = () => {
    if (logued) {
      return (
        <Modal onClose={() =>  handleLogued()}>
            <div className="flex py-8 flex-col items-center justify-center px-8 ">
                <p className=" text-title text-center text-lg mb-2">Senha alterada com sucesso!<br/></p>
                <i className="uil uil-grin mr-5 text-text-1 mb-2 text-5xl" />
                <Button onClick={() =>  handleLogued()} type="button" className="teste2 mb-4">
                    Ok
                </Button>
            </div>
        </Modal>
      );
    }
    return null;
  };

  return (
    <>
    {renderModal()}
    {renderAuthenticated()}
    <div className="sm:py-10 flex flex-col items-center sm:w-2/3">
      <h2 className="mb-10 text-title text-xl text-center">
        <strong>{ authenticated ? 'Digite sua nova senha' : hasToken  ? 'Digite o código recebido no email' : 'Digite seu de cadastro e-mail'}</strong>
      </h2>
      <div className="sm:px-4 w-full">
        <Form onSubmit={authenticated ? handleSubmit : hasToken ? handleTokenValidate : reset}>
        { !authenticated ? 
        <>
              <div className="mb-5">
            <TextField
              fullWidth={true}
              className="color-primary"
              type="email"
              label="E-mail"
              name="email"
              required={true}
              autoComplete="nope"
              value={values.email}
              onChange={handleInputChange}
              {...(errors?.email && { error: true, helperText: errors?.email })}
            />
          </div>
          {hasToken  &&
          <div className="mb-5">
            <TextField
              fullWidth={true}
              className="color-primary"
              type="text"
              label="Código"
              name="token"
              required={true}
              autoComplete="nope"
              value={values.token}
              onChange={handleInputChange}
              {...(errors?.token && { error: true, helperText: errors?.token })}
            />
          </div>
          }
        </>
          :
          <>
            <div className="mb-5 relative">
                <div onClick={() => setViewPassword(!viewPassword)} className="flex z-20 cursor-pointer right-0 mt-4 mr-4 absolute">
                    {viewPassword ? 
                        <i className="uil uil-eye-slash text-title" /> 
                        :
                        <i className="uil uil-eye text-title" />
                    }
                </div>
                <TextField
                fullWidth={true}
                className="color-primary"
                type={viewPassword ? "text" : "password"}
                label="Senha"
                name="password"
                required={true}
                autoComplete="nope"
                onChange={handleInputChange}
                />
            </div>
            <div className="mb-5 relative">
              <div onClick={() => setViewPassword(!viewPassword)} className="flex z-20 cursor-pointer right-0 mt-4 mr-4 absolute">
                {viewPassword ? 
                  <i className="uil uil-eye-slash text-title" />
                  :
                  <i className="uil uil-eye text-title" />
                }
              </div>
                <TextField
                fullWidth={true}
                className="color-primary"
                type={viewPassword ? "text" : "password"}
                label="Confirmar senha"
                name="confirm_password"
                required={true}
                autoComplete="nope"
                onChange={handleInputChange}
                {...(errors?.confirm_password && { error: true, helperText: errors?.confirm_password })}
                />
            </div>
            
          </>
          }
          {/* {hasToken ?
            <div onClick={() => setHasToken(!hasToken)} className="flex items-center justify-center text-silver-1 cursor-pointer mb-5">
                Não tenho token!
            </div> 
            :
            <div onClick={() => setHasToken(!hasToken)} className="flex items-center justify-center text-silver-1 cursor-pointer mb-5">
                Ja tenho o token!
            </div>
          } */}
          <Button type="submit" className="teste2 mb-5">
            Confirmar
          </Button>
          <ButtonSecondary onClick={resetPassword} type="button" className="teste2 mb-5">
            Cancelar
          </ButtonSecondary>
        </Form>
      </div>
    </div>
    </>
  );
};

export default ResetPassword;
