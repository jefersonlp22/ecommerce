/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useCallback, useState } from "react";
import { TextField } from "@material-ui/core";
import { Button, ButtonSecondary } from "../Buttons";
import { FormRegisterProps } from "./index.d";
import { useLayout } from "../../contexts/layout";
import VMasker from "vanilla-masker";
import ApolloClient, { gql } from "apollo-boost";
import { isValidCEP } from "@brazilian-utils/brazilian-utils";
import { useForm, Form } from "../../hooks/useForm";
import CardConfirm from "./card";
import { Address as AddressType } from "../../ModelTyping/Address";

import { useMutation } from "@apollo/react-hooks";
import ReactLoading from "react-loading";

const SEARCH_POSTAL_CODE = gql`
  query($postalCode: String!) {
    searchPostalCode(postal_code: $postalCode) {
      postal_code
      state
      city
      address
      district
    }
  }
`;

const CUSTOMER_ADDRESS = gql`
  mutation(
    $customer_id: Int
    $name: String
    $city: String
    $city_code: String
    $postal_code: String
    $addressee: String
    $address: String
    $number: String
    $local_reference: String
    $complement: String
    $district: String
    $state: String
    $creator_user_id: Int
  ){
    customerAddAddress(input:{
      customer_id: $customer_id
      name: $name
      city: $city
      city_code: $city_code
      postal_code: $postal_code
      addressee: $addressee
      address: $address
      number: $number
      local_reference: $local_reference
      complement: $complement
      district: $district
      state: $state
      creator_user_id: $creator_user_id
  })
    {
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
  }
`;

const client = new ApolloClient({
  uri: process?.env?.REACT_APP_API_URL || ""
});

const FormAddressDelivery: React.FC<FormRegisterProps> = ({ onFinish }) => {
  const layoutContext = useLayout();
  const [newAddress, setNewAddress] = useState(false);
  const [addressSeleted, setAddressSeleted] = useState<AddressType>({});
  const { formRegisterData: form, setFormRegisterData, customer,ambassador, handleCustomer} = layoutContext;
  const [addresses, setAddresses] = useState<AddressType[]>(form?.addresses);


  const initialFValues = {
    number: form.number ?? "",
    postal_code: form.postal_code ?? "",
    complement: form.complement ?? "",
    addressee: form?.addressee ?? "",
    reference: form?.reference ?? "",
    address: form?.address ?? "",
  };

  const [ custumerAddress, {loading: loadingAddress}] = useMutation(CUSTOMER_ADDRESS)


  const validate = (fieldValues = values) => {
    let temp: any = { ...errors };

    if ("postal_code" in fieldValues) {
      temp.postal_code = isValidCEP(fieldValues?.postal_code)
        ? ""
        : "CEP não é válido.";
    }

    setErrors({ ...temp });

    if (fieldValues === values) {
      return Object.values(temp).every(x => x === "");
    }
  };

  const {
    values,
    errors,
    setErrors,
    handleInputChange,
    resetForm,
    setValues
  } = useForm(initialFValues, true, validate);

  const getDataPostalCode = useCallback(
    async (postalCode: string) => {
      try {
        const { data } = await client.query({
          query: SEARCH_POSTAL_CODE,
          variables: { postalCode }
        });

        if (data) {
          const address = { ...data?.searchPostalCode };
          delete address.postal_code;

          const newForm = { ...form, ...address };
          if (setFormRegisterData) {
            setFormRegisterData(newForm);
          }
        }
      } catch {
        let temp: any = { ...errors };
        temp.postal_code = "CEP não é válido.";
        setErrors({ ...temp });
      }
    },
    [form, setFormRegisterData, errors, setErrors]
  );

  const handleSubmit = async e => {
      console.log('values',values);
    e.preventDefault();
    if (validate()) {
      let saveAddress =  await custumerAddress({
        variables:{
          customer_id: customer?.id,
          name: values?.address_name || "",
          city: values?.city || "",
          city_code: "",
          postal_code: values?.postal_code.replace(/[^\d]+/g, "") || "",
          addressee: customer?.name || "",
          address: values?.address ||  "",
          number: values?.number || "",
          local_reference: values?.local_reference || "",
          complement: values?.complement || "",
          district: values?.district || "",
          state: values?.state || "",
          creator_user_id: ambassador?.id,
        }
      })
      if (saveAddress) {
        console.log('saveAddress',saveAddress)
        setAddresses([...addresses, saveAddress.data?.customerAddAddress])
        handleCustomer({...customer, addresses: [...addresses, saveAddress.data?.customerAddAddress]})
        handleNewAddress();
        resetForm();
      }
        // setAddresses([...addresses, values])s
    }
  };

  const handleNewAddress = () => {
      setNewAddress(!newAddress);
      resetForm();
    //e.preventDefault();
      //onFinish(values);
      //resetForm();
  };

  const handleSelectedAddress = value => {
    setAddressSeleted(value);
  };

  const handleConfirm = () => {
    setFormRegisterData({ ...form, address_delivery: addressSeleted });
    onFinish(values);
    //e.preventDefault();
      //onFinish(values);
      //resetForm();ss
  };



  useEffect(() => {
    if (values.postal_code.length >= 9 && isValidCEP(values.postal_code)) {
      getDataPostalCode(values.postal_code);
    }
  }, [values.postal_code]);

  useEffect(() => {
      if (addresses.length > 0) {
          setAddressSeleted(addresses[0])
      }
  }, [addresses]);

  useEffect(() => {
    setValues(prev => ({ ...prev, state: form.state }));
    setValues(prev => ({ ...prev, city: form.city }));
    setValues(prev => ({ ...prev, district: form.district }));
    setValues(prev => ({ ...prev, address: form.address }));
  }, [form.state, form.city, form.district, form.address, setValues]);

  // useEffect(() => {
  //   if (customer) {
  //     console.log( 'customer',customer)
  //     layoutContext.setFormRegisterOpen(false);
  //     setOrderDetail(customer.orders[0])
  //     history.push(`${ ROUTE_TENANT_ORDER_DETAIL()}`);
  //   }
  // }, [customer]);

  if (loadingAddress) {
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


  return (
    <div className="sm:py-10 flex flex-col items-center sm:w-2/3">
      <h2 className="mb-10 text-title text-xl text-center">
        <strong>
          Defina o endereço de entrega
          <br />
          do pedido
        </strong>
      </h2>
        <div className="sm:px-3 w-full">
        { newAddress ?
            <Form onSubmit={handleSubmit}>
            <div className="mb-5">
                <TextField
                fullWidth={true}
                type="tel"
                label="CEP"
                name="postal_code"
                required={true}
                autoComplete="nope"
                value={VMasker.toPattern(values.postal_code, "99999-999")}
                onChange={handleInputChange}
                {...(errors?.postal_code && {
                    error: true,
                    helperText: errors?.postal_code
                })}
                />
            </div>
            <div className="mb-5">
                <TextField
                fullWidth={true}
                type="text"
                label="Nome do endereço"
                name="address_name"
                autoComplete="nope"
                value={values.address_name || ""}
                onChange={handleInputChange}
                />
            </div>
            <div className="mb-5">
                <TextField
                fullWidth={true}
                type="text"
                label="Estado"
                disabled
                name="state"
                required={true}
                autoComplete="nope"
                value={values?.state || ""}
                onChange={handleInputChange}
                />
            </div>
            <div className="mb-5">
                <TextField
                fullWidth={true}
                type="text"
                label="Cidade"
                disabled
                name="city"
                required={true}
                autoComplete="nope"
                value={values?.city || ""}
                onChange={handleInputChange}
                />
            </div>
            <div className="mb-5">
                <TextField
                fullWidth={true}
                type="text"
                label="Bairro"
                name="district"
                required={true}
                autoComplete="nope"
                value={values?.district || ""}
                onChange={handleInputChange}
                />
            </div>
            <div className="mb-5">
                <TextField
                fullWidth={true}
                type="text"
                label="Endereço"
                name="address"
                required={true}
                autoComplete="nope"
                value={values?.address || ""}
                onChange={handleInputChange}
                />

            </div>
            <div className="mb-5">
                <TextField
                fullWidth={true}
                type="number"
                label="Número"
                name="number"
                required={true}
                autoComplete="nope"
                value={values.number || ""}
                onChange={handleInputChange}
                />
            </div>
            <div className="mb-5">
                <TextField
                fullWidth={true}
                type="text"
                label="Complemento (opc)"
                name="complement"
                required={false}
                autoComplete="nope"
                value={values.complement || ""}
                onChange={handleInputChange}
                />
            </div>
            <div className="mb-5">
                <TextField
                type="text"
                label="Referência (opc)"
                name="reference"
                required={false}
                autoComplete="nope"
                value={values.reference || ""}
                onChange={handleInputChange}
                />
            </div>
            <Button type="submit" className="teste2">
                Confirmar
            </Button>
            </Form>
            :
            <>
                {addresses.length > 0 ?
                <>
                {addresses.map((addresse: any, index: number)  => {
                    return(
                        <div className="cursor-pointer" key={index} onClick={() => handleSelectedAddress(addresse)}>
                            <CardConfirm
                            headerLeft={<i className="uil uil-map-marker" />}
                            header={<span>{addresse?.name}</span>}
                            active={addressSeleted?.id ===  addresse?.id}
                            >
                                <p>
                                    {addresse?.address}, {addresse?.number}
                                </p>
                                <p>
                                    {addresse?.city} - {addresse?.state} {addresse?.postal_code}
                                </p>
                            </CardConfirm>
                        </div>
                    )
                    })}
                    <Button type="submit" onClick={() => handleConfirm()} className="teste2 mt-8">
                            Confirmar
                        </Button>
                        <ButtonSecondary type="submit" onClick={() => handleNewAddress()} className="teste2 mt-6">
                            Novo endereço
                        </ButtonSecondary>
                </>
                    :
                    <div>Nenhum Endereço Cadastrado</div>
                }

            </>
            }
        </div>
    </div>
  );
};

export default FormAddressDelivery;
