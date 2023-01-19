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

const FormEmail: React.FC<FormRegisterProps> = ({ onFinish, resetPassword }) => {
  const layoutContext = useLayout();
  const [newCustomer, setNewCustomer] = useState(false);
  const { formRegisterData: form, setFormRegisterData, tenant, customer, handleCustomer, setFormRegisterStep} = layoutContext;
  const [viewPassword, setViewPassword] = useState(false);
  const [logued, setLogued] = useState(false);

  const initialFValues = {
    email: form?.email ?? '',
    document: ''
  };

  const LOGIN = gql`
  mutation($email: String $password: String ){
    loginCustomer(
      input:{
        tenant_id: "${tenant?.id}",
        email: $email,
        password: $password
      }   
    ){
      auth_token
      id
      name
      email
      document
      phone
      type
    	birthday
      orders {
        id
        code
        external_id
        customer_id
        tenant_id        
        subtotal
        subtotal_formatted
        total
        total_formatted
        user_id
        created_at
        paid_at
        placed_at
        approved_at
        billed_at
        delivered_at
        shipped_at
        updated_at
        canceled_at
        items {
              id
              name
              quantity
              price
              subtotal
              total
        }
        shippings {
            id
            desired_delivery_at
            delivery_estimate
            shipping_method
            shipping_price
            working_days
        }         
      }
      addresses {
          id
          postal_code
          addressee
          address
          number
          name
          complement
          district
          city
          state
          addressee
      }
    }
  } 
  `;

  const validPassword = (password) => {

    let valilid  =  password.length >= 8 &&
    password.match(/[!@#$%&;*]+/) &&
    password.match(/[0-9]+/) &&
    (password.match(/[a-z]+/) || password.match(/[A-Z]+/))

    return valilid
  }

  const [login, {loading, data}] = useMutation(LOGIN)
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // if (values?.password !== values?.confirm_password)  {
   
    if (validate()) {
      setFormRegisterData({ ...form, ...values });
      onFinish(values);
      resetForm();
    }
  };

  const handleLogin = (e) => {
      e.preventDefault();
      if (validate()) {
        setFormRegisterData({ ...form, ...values });
      } 
      login({variables: {email: values?.email, password: values?.password }}).catch((err) => {
        immediateToast("error", {
          message: err.graphQLErrors[0].message,
          position: "topLeft",
          icon: undefined,
          class: "sm:rounded-full overflow-hidden",
          messageColor: "white"
        });
      })
  };

  useEffect(() => {
    if (data) {
      setLogued(true)
      handleCustomer(data?.loginCustomer)
      setFormRegisterData({...form, ...data?.loginCustomer})
      
    }
  }, [data]);

  useEffect(() => {
    if (customer) {
      setFormRegisterData({...form, ...customer})
      setFormRegisterStep(5)
    }
  }, []);

  if (loading) {
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

  const handleLogued = () => {
    setLogued(false);
    layoutContext?.setFormRegisterOpen(false);
    document.location.reload(true);
    //history.push(`${ ROUTE_TENANT_HOME()}`);
  }

  const renderModal = () => {
    if (logued) {
      return (
        <Modal onClose={() => handleLogued()}>
            <div className="flex py-8 flex-col items-center justify-center px-8 ">
                <p className=" text-title text-center text-lg mb-2">Autenticado com sucesso!! <br/> Boas compras!!</p>
                <i className="uil uil-grin mr-5 text-text-1 mb-2 text-5xl" />
                <Button onClick={() => handleLogued()} type="button" className="teste2 mb-4">
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
    <div className="sm:py-10 flex flex-col items-center sm:w-2/3">
      <h2 className="mb-10 text-title text-xl text-center">
        <strong> {newCustomer ? 'Digite seu e-mail' : 'Login'}</strong>
      </h2>
      <div className="sm:px-4 w-full">
        <Form onSubmit={newCustomer ? handleSubmit : handleLogin}>
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
                {...(errors?.password && { error: true, helperText: errors?.password })}
              />
            </div>
          </div>
          { newCustomer &&
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
            <div className="text-silver-1 text-xs text-center mt-3">
              Sua senha precisa ter no mínimo 8 caracteres <br/>e pelo menos um
              caractere especial e um número.
            </div>
          </div>
          }
          <div onClick={resetPassword}  className="flex items-center justify-center text-silver-1 cursor-pointer mb-5">
            Esqueceu sua senha?
          </div>
          <Button type="submit" className="teste2 mb-5">
            Avançar
          </Button>
        </Form>
        {!newCustomer &&
          <ButtonSecondary onClick={() =>  setNewCustomer(true)} className="teste2">
            CRIAR CONTA
          </ButtonSecondary>
          }
      </div>
    </div>
    </>
  );
};

export default FormEmail;
