/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState, useCallback} from 'react';
import { Container } from "../../components/Grid";
import { useHistory } from "react-router-dom";
import { useLayout } from "../../contexts/layout";
import { Content, Th, Td, Tr, Table, Menu, TagMenu, MenuMobile, Status} from "./style";
import ApolloClient, { gql} from "apollo-boost";
import { isValidCEP, isValidCNPJ, isValidPhone, isValidCPF } from "@brazilian-utils/brazilian-utils";
import { useForm, Form } from "../../hooks/useForm";
import { TextField } from "@material-ui/core";
import { Button, ButtonSecondary, ButtonClear} from "../../components/Buttons";
import CardAddress from "../../components/FormRegister/card";
import { IconClose } from "../../components/Icons/Close";
import  CardOrder from "./CardOrder";
import { ROUTE_TENANT_ORDER_DETAIL, ROUTE_TENANT_ORDERS, ROUTE_TENANT_HOME } from "../../constants/";
import {useMutation } from "@apollo/react-hooks";
import ReactLoading from "react-loading";
import { immediateToast } from "izitoast-react";
import { Modal } from "../../components/Modal";


import VMasker from "vanilla-masker";
import moment from 'moment';

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

const GET_ORDERS = gql`
mutation($customer_id: Int $tenant_id: Int ){
    ordersByCustomer(input:{
        customer_id: $customer_id
        tenant_id: $tenant_id
    }){
      id
      channel
      code
      tenant_id
      subtotal
      total
      subtotal_formatted
      total_formatted
      payment_method
      delivered_at
      paid_at
      placed_at
      created_at
      approved_at
      billed_at
      shipped_at
      canceled_at
      discount
      shippings{
        id
        desired_delivery_at
        delivery_estimate
        shipping_method
        shipping_price
        working_days
      }
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
        addressee
        address
        postal_code
        name
        number
        complement
        district
        local_reference
        city
        state
      }
      transactions{
        id
        external_id
        external_url
        payment_method
        status
        created_at
      }
    }
  }
`;

const UPDATE_CUSTOMER = gql`
  mutation(
    $id: Int
    $tenant_id: String
    $name: String
    $phone: String
    $document: String
    $birthday: String
    $company_name: String
    $company_document: String
    $type: String
    $creator_user_id: Int
  ){
    updateCustomerData(input:
      {
        id: $id
        tenant_id: $tenant_id,
        name: $name
        phone: $phone
        document:$document
        birthday: $birthday
        company_name: $company_name
        company_document: $company_document
        type: $type
        creator_user_id: $creator_user_id
      })
    {
      auth_token
      email
      id
      name
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
      }
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

const DELETE_ADDRESS = gql`
    mutation($address_id: Int $customer_id: Int){
        customerDeleteAddress(input:{address_id: $address_id  customer_id: $customer_id})
    }
`;

const client = new ApolloClient({
    uri: process?.env?.REACT_APP_API_URL || ""
  });
// import { Container } from './styles';

const Orders: React.FC = () => {
  const history = useHistory();
  const [edit, setEdit] = useState('home');
  const [dateValid, setDateValid] = useState(false);
  const [updateOrCreate, setUpdateOrCreate] = useState('');
  const [addressSelected, setAddressSelected] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [orders, setOrders] = useState([]);
  const [showLogout, setShowLogout] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);

  const layoutContext = useLayout();
  const { catalog,formRegisterData: form, setFormRegisterData , setCatalog, tenant, setOrderDetail,logout , handleCustomer, ambassador, customer} = layoutContext;

  const initialFValues = {
    number: form?.number ?? "",
    postal_code: form?.postal_code ?? "",
    complement: form?.complement ?? "",
    addressee: form?.addressee ?? "",
    name: customer?.name ?? "",
    email: customer?.email ?? "",
    phone: customer?.phone ?? "",
    address: customer?.address ?? "",
    birthday: customer?.birthday?.split("-")
    .reverse()
    .join("/") ?? "",
    document: customer?.document ?? "",
    type: customer?.type ?? "",
    company_name: customer?.company_name ?? "",
    company_document: customer?.company_document ?? "",
    address_name: form?.number ?? "",
  };

  const UPDATE_CUSTOMER_ADDRESS = gql`
  mutation(
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
  ){
    customerUpdateAddress(input:{
        id: ${addressSelected?.id}
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
  })
    {
      id
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
    }
  }
`;

  const [getOrders, {loading, data}] = useMutation(GET_ORDERS );
  const [updateCustomer, {loading: loadUpadateCustomer}] = useMutation(UPDATE_CUSTOMER );
  const [createAddressCustomer, {loading: loadAddress}] = useMutation(CUSTOMER_ADDRESS );
  const [updateAddressCustomer, {loading: loadCustomer}] = useMutation(UPDATE_CUSTOMER_ADDRESS );
  const [deleteAddress, {loading: loadDeleteAddress}] = useMutation(DELETE_ADDRESS );

  useEffect(() => {
    if (tenant?.data?.legality_settings?.customer?.mandatory_age) {
      setDateValid(true)
    }
  }, [tenant]);

  const isValidBirth = (input: string) => {
    const reg = /(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d/;

    return input.match(reg) ? true : false;
  };

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

  const validateRegistetr = (fieldValues = values) => {
    let temp: any = { ...errors };

    if ("name" in fieldValues) {
      temp.name = fieldValues.name ? "" : "Este campo precisa ser preenchido.";
    }
    if ("company_document" in fieldValues && values?.type !== 'pf') {
      temp.company_document = isValidCNPJ(fieldValues?.company_document) ? "" : "CNPJ não é válido.";
    }

    if ("phone" in fieldValues) {
      temp.phone = isValidPhone(fieldValues?.phone)
        ? ""
        : "Telefone não é válido.";
    }

    if ("birthday" in fieldValues) {


      if (fieldValues.birthday || tenant?.data?.legality_settings?.customer?.mandatory_age) {
        let dayNow = moment();

        var dateOfBirth = moment(fieldValues?.birthday, 'DD/MM/YYYY');
        let age = dayNow.diff(dateOfBirth, 'years');

        if (isValidBirth(fieldValues?.birthday) && tenant?.data?.legality_settings?.customer?.minimum_age > age) {
          return immediateToast("error", {
            message: `É necessário ter mais de ${tenant?.data?.legality_settings?.customer?.minimum_age} anos para concluir a compra.`,
            position: "topLeft",
            icon: undefined,
            class: "sm:rounded-full overflow-hidden",
            messageColor: "white"
          });
        }
        temp.birthday = isValidBirth(fieldValues?.birthday)
          ? ""
          : fieldValues?.birthday === "" ? "Este campo precisa ser preenchido" : "Data de nascimento não é válida.";
      } else {
        temp.birthday = "";
      }
    }

    if ("document" in fieldValues) {
      temp.document = isValidCPF(fieldValues?.document) ? "" : "CPF não é válido.";
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
          //delete address.postal_code;
          const newForm = { ...form, ...address };
          delete newForm.number;
          if (setFormRegisterData) {
            setFormRegisterData(newForm);
            setValues(newForm)
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
    console.log(' akiiiiooooooi');
    e.preventDefault();
    if (validateRegistetr()) {
      setFormRegisterData({ ...form, ...values });
      let saveUpdateCustomer = await updateCustomer({
            variables:{
                id: customer?.id,
                tenant_id: tenant?.id,
                name: values?.name || "",
                phone: values?.phone.replace(/[^\d]+/g, "") || "",
                document: values?.document.replace(/[^\d]+/g, "") || "",
                company_name: values?.company_name || "",
                company_document: values.company_document !== ""? values.company_document.replace(/[^\d]+/g, "") : "",
                type: values?.type || "",
                birthday: dateValid || values?.birthday !== "" ? values?.birthday?.split("/")
                .reverse()
                .join("-") : "",
                creator_user_id: ambassador?.id
            }
        })
        if (saveUpdateCustomer) {
            handleCustomer(saveUpdateCustomer.data.updateCustomerData)
            history.push(`${ ROUTE_TENANT_ORDERS()}`)
        }
    }
  };

  const handleSubmitAddress = async e => {
    e.preventDefault();
    if (validate()) {
      setFormRegisterData({ ...form, ...values });
      if (updateOrCreate === 'edit') {
        let filter=[]
        let updateAddress = await updateAddressCustomer({
            variables:{
                name: values?.address_name || "",
                city: values?.city || "",
                city_code: "",
                postal_code: values?.postal_code.replace(/[^\d]+/g, "") || "",
                addressee: values?.name || "",
                address: values?.address ||  "",
                number: values?.number || "",
                local_reference: values?.local_reference || "",
                complement: values?.complement || "",
                district: values?.district || "",
                state: values?.state || "",
            }
          })
          if (updateAddress) {
            filter = customer?.addresses?.filter((item, index) => {
            return updateAddress?.data.customerUpdateAddress.id !== item.id})
            handleCustomer({...customer, addresses:[...filter, updateAddress?.data.customerUpdateAddress]})
            setUpdateOrCreate('');
        }
      } else{
        let createAddress = await createAddressCustomer({
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
        if (createAddress) {
            setUpdateOrCreate('')
            handleCustomer({...customer, addresses:[...customer.addresses, createAddress.data?.customerAddAddress]})
        }
      }
    }
  };

  const handleDeleteAddress = async () => {
      setShowDeleted(false)
      let  deleted = await deleteAddress({
          variables: {
              customer_id: customer?.id,
              address_id: addressSelected?.id
          }
      })
      if (deleted.data.customerDeleteAddress) {
          let filterDelected = customer?.addresses.filter((item , index) => {
              return item.id !== addressSelected?.id
          })
          handleCustomer({...customer, addresses: filterDelected})
          setUpdateOrCreate('')
      }
    }

  useEffect(() => {
    if (values.postal_code.length >= 9 && isValidCEP(values.postal_code)) {
      getDataPostalCode(values.postal_code);
    }
  }, [values.postal_code]);

  useEffect(() => {
      if (values.postal_code.length >= 9 && isValidCEP(values.postal_code)) {
        setValues(prev => ({ ...prev, state: form?.state }));
        setValues(prev => ({ ...prev, city: form?.city }));
        setValues(prev => ({ ...prev, district: form?.district }));
        setValues(prev => ({ ...prev, address: form?.address }));
      }

  }, [form?.state, form?.city, form?.district, form?.address, setValues]);

  const handleEditAddress = (address) => {

    setValues(
        {
            ...values,
            address_name: address.name,
            city: address?.city || "",
            city_code: address?.city_code || "",
            postal_code: address?.postal_code.replace(/[^\d]+/g, "") || "",
            addressee: customer?.name || "",
            address: address?.address ||  "",
            number: address?.number || "",
            local_reference: address?.local_reference || "",
            complement: address?.complement || "",
            district: address?.district || "",
            state: address?.state || "",
        })
    setUpdateOrCreate('edit')
    setAddressSelected(address)
    setFormRegisterData({...form, ...address, address_name: address.name})
  }

  const handleNewAddress = () => {
    setUpdateOrCreate('new')
      resetForm()
      setValues({...values, address: "", postal_code: '', city: '',  state: '', complement: '', local_reference: '', number: '', district: ''})
  }

  const handleOrderDetail = (order) => {
    setOrderDetail(order)
    history.push(`${ ROUTE_TENANT_ORDER_DETAIL()}`);
  }

  useEffect(() => {
      if (tenant) {
          getOrders({
            variables: {
                customer_id: customer.id,
                tenant_id: tenant.id
            }
          })
      }
  }, [tenant]);

  useEffect(() => {
    if (data) {
        let orderBy = data?.ordersByCustomer.slice()
        .sort((a, b) => b.created_at.split("/")
        .reverse()
        .join("-") - a.created_at.split("/")
        .reverse()
        .join("-"))
        .reverse();
        setOrders(orderBy)
    }
  }, [data]);

  useEffect(() => {
    setCatalog({ ...catalog, currentCollection: {name: 'Área do cliente'} });
  }, [])

  const handleLogout = () => {
    logout()
    history.push(`${ ROUTE_TENANT_HOME()}`)
    document.location.reload(true);
  }

  const home = () => {
    return(
        <>
            <div className="flex py-12 flex-col">
                <h1 className="text-left mb-4 text-4xl text-title">Bem-vindo de volta, {customer?.name}!</h1>
                {
                  tenant?.id === '6' ?
                  <p className="text-sm mb-10 text-left text-silver-1">
                    Seja bem vindo a minha Lojinha Wine Eventos. Aqui você conta com a minha <br/>
                    Consultoria em um formato digital e irá receber os produtos diretamente da Wine em sua casa. <br/>
                    Sou seu Embaixador e estou aqui para te ajudar sempre. Qualquer dúvida sobre seus pedidos,  <br/>
                    entre em contato diretamente comigo.
                </p>
                :
                <p className="text-sm mb-10 text-left text-silver-1">
                    Seja bem vindo a minha Lojinha. Aqui você conta com a minha Consultoria em um formato digital. <br/>
                    Qualquer dúvida sobre seus pedidos, entre em contato diretamente comigo.
                </p>
                }

                <div className="flex w-16 text-sm justify-between mb- text-left text-silver-1">
                    <i className="uil uil-receipt" />
                    <p className="text-sm text-left text-silver-1">
                        Pedidos
                    </p>
                </div>
            </div>
            { orders.length > 0 ?
            <>
            <Table className="grid grid-cols-2 md:grid-cols-1 mb-10 pt-10" >
                <Th className="grid py-5 px-5 grid-cols-1 text-title md:grid-cols-6">
                    <div>Código</div>
                    <div>Data</div>
                    <div>Valor</div>
                    <div>Vendido por</div>
                    <div>Origem da compra</div>
                    <div>Status</div>
                    <div></div>
                </Th>
                {
                    orders.map((order, index) => {
                        return(
                            <Tr onClick={() => handleOrderDetail(order)} key={index} className="grid hover:bg-white py-5 px-5 grid-cols-1 text-silver-1 md:grid-cols-6">
                                <Td className="hover:bg-white" >
                                    {order?.code}
                                </Td>
                                <Td className="">
                                    {order?.created_at}
                                </Td>
                                <Td className="">
                                    {order?.total_formatted}
                                </Td>
                                <Td className="">
                                    {ambassador?.name}
                                </Td>
                                <Td className="">
                                    {order?.channel === 'store' ? "Lojinha" : ambassador?.name}
                                </Td>
                                <Td className="flex items-center">
                                  <div className="flex items-center justify-between ">
                                   <Status  className={`${order.approved_at ? 'bg-success' : order.canceled_at ? 'bg-danger' : 'bg-silver-1'} mr-2 `} ></Status>
                                    <div>{order.canceled_at ? 'Cancelado' :
                                    order?.delivered_at ? 'Entregue' :
                                    order?.shipped_at ? 'Aguardando entrega' :
                                    order?.paid_at ? 'Pago, aguardando envio' :
                                    order?.approved_at ? 'Aguardando pagamento' :
                                    'Aguadando aprovação.'
                                    }</div>
                                  </div>
                                </Td>

                            </Tr>
                        )
                    })
                }
            </Table>

            <div className="md:hidden pb-10">
                { orders.map((order, index) => {
                    return(
                        <div key={index}>
                        <CardOrder
                            onClick={() => handleOrderDetail(order)}
                            headerLeft={<i className="uil uil-receipt" />}
                            header={<span>#{order?.code}</span>}
                        >
                            <p >
                                Data: {order?.created_at}
                            </p>
                            <p>
                                Valor:  {order?.total_formatted}
                            </p>
                            <p>
                                Vendido: {ambassador?.name}
                            </p>
                            <p>
                              Origem da compra: {order?.channel === 'store' ? "Loja" : ambassador?.name}
                            </p>

                        </CardOrder>
                        </div>
                    )

                })
                }
            </div>
            </>
            :
            <div className="flex w-ful items-center justify-center py-8 text-title text-2xl">
                Você  ainda não fez nenhum pedido!
            </div>
            }
        </>
    )
  }

  const register = () => {
      return(

            <div className="py-10 flex flex-col items-center sm:w-2/3">
                <h2 className="mb-10 text-title text-xl text-center">
                <strong>
                    {values?.type === 'pf' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                </strong>
                </h2>
                <div className=" w-full">
                <Form onSubmit={handleSubmit}>
                <div hidden={values?.type === 'pf'} className="mb-5">
                    <TextField
                        fullWidth={true}
                        type="text"
                        label="Razão social"
                        name="company_name"
                        required={values?.type !== 'pf'}
                        autoComplete="nope"
                        value={values.company_name}
                        onChange={handleInputChange}
                        {...(errors?.company_name && { error: true, helperText: errors?.company_name })}
                    />
                    </div>
                <div hidden={values?.type === 'pf'} className="mb-5">
                    <TextField
                        fullWidth={true}
                        className="color-primary"
                        type="tel"
                        label="CNPJ"
                        name="company_document"
                        required={values?.type !== 'pf'}
                        autoComplete="nope"
                        value={VMasker.toPattern(values.company_document, "99.999.999/9999-99")}
                        onChange={handleInputChange}
                        {...(errors?.company_document && { error: true, helperText: errors?.company_document })}
                    />
                    </div>
                    <div className="mb-5">
                    <TextField
                        fullWidth={true}
                        type="text"
                        label="Nome"
                        name="name"
                        required={true}
                        autoComplete="nope"
                        value={values.name}
                        onChange={handleInputChange}
                        {...(errors?.name && { error: true, helperText: errors?.name })}
                    />
                    </div>
                    <div className="mb-5">
                    <TextField
                        fullWidth={true}
                        type="email"
                        label="E-mail"
                        name="email"
                        disabled
                        value={values?.email || ""}
                    />
                    </div>
                    <div className="mb-5">
                    <TextField
                        fullWidth={true}
                        type="text"
                        label="Celular"
                        name="phone"
                        required={true}
                        autoComplete="nope"
                        value={VMasker.toPattern(values.phone, "(99) 99999-9999")}
                        onChange={handleInputChange}
                        {...(errors?.phone && { error: true, helperText: errors?.phone })}
                    />
                    </div>
                    <div className="mb-5">
                    <TextField
                        fullWidth={true}
                        type="tel"
                        label="CPF"
                        name="document"
                        required={true}
                        autoComplete="nope"
                        value={VMasker.toPattern(values.document, "999.999.999-99")}
                        onChange={handleInputChange}
                        {...(errors?.document && { error: true, helperText: errors?.document })}
                    />
                    </div>

                    <div className="mb-5">
                    <TextField
                        fullWidth={true}
                        required={dateValid}
                        type="tel"
                        label={`Data de nascimento ${tenant?.data?.legality_settings?.customer?.mandatory_age ? '' : '(Opc)' }`}
                        name="birthday"
                        autoComplete="nope"
                        value={VMasker.toPattern(values.birthday, "99/99/9999")}
                        onChange={handleInputChange}
                        {...(errors?.birthday && { error: true, helperText: errors?.birthday })}
                    />
                    </div>
                    <Button type="submit" className="teste2">
                        Alterar
                    </Button>
                </Form>
            </div>
        </div>
      )
  }

  const address = () => {
      return(
        <div className="mb-10">

            {updateOrCreate === 'edit' ||  updateOrCreate === 'new'?
            <div className="py-10 flex flex-col items-center sm:w-2/3">
                <div className="flex w-full justify-between" onClick={() => setUpdateOrCreate('')}>
                    <IconClose cursor="pointer" />
                </div>
                <h2 className="mb-10 text-title text-xl text-center">
                    <strong>
                    Endereço
                    </strong>
                </h2>
                <div className=" w-full">
                    <Form onSubmit={handleSubmitAddress}>
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
                        required={false}
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
                    <Button type="submit" className="teste2 mt-6">
                        {updateOrCreate === 'edit' ? 'Alterar' : 'Casdastrar'}
                    </Button>
                    <ButtonSecondary onClick={() => setShowDeleted(true)} type="button" className="teste2 mt-6">
                        Deletar
                    </ButtonSecondary>
                    </Form>
                </div>
            </div>
            :
            <div>
                <div className="flex justify-between pt-10">
                    <h1  className="mb-10  text-title text-sm md:text-2xl text-center">Endereços</h1>
                    <div className="w-2/6 md:w-1/6">
                    <ButtonSecondary onClick={() => handleNewAddress()}>Novo</ButtonSecondary>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-2 pb-8 md:grid-cols-3">
                  {customer?.addresses.length > 0 ?
                  <>
                  {customer?.addresses.map((address: any, index: number)  => {
                      return(
                          <div className="cursor-pointer" key={`indeex${index}`} >
                              <CardAddress
                              onClick={() => handleEditAddress(address)}
                              headerLeft={<i className="uil uil-map-marker" />}
                              header={<span>{address?.name}</span>}
                              >
                                  <p >
                                      {address?.address}, {address?.number}
                                  </p>
                                  <p>
                                      {address?.city} - {address?.state} {address?.postal_code}
                                  </p>
                              </CardAddress>
                          </div>
                      )
                      })}
                  </>
                      :
                      <div>Nenhum Endereço Cadastrado</div>
                  }

                </div>
            </div>

            }
        </div>
      )
  }

  const renderModal = () => {
    if (showLogout) {
      return (
        <Modal onClose={() => setShowLogout(false)}>
            <div className="px-8 py-8 ">
                <p className=" text-title text-center text-xl mb-10">Tem certeza que deseja sair?</p>
                <Button onClick={() => handleLogout()} type="button" className="teste2 mb-4">
                    Sair
                </Button>
                <ButtonSecondary onClick={() => setShowLogout(false)} type="button" className="teste2">
                    Cancelar
                </ButtonSecondary>
            </div>
        </Modal>
      );
    }
    return null;
  };

  const renderDeleteAddress = () => {
    if (showDeleted) {
      return (
        <Modal onClose={() => setShowDeleted(false)}>
            <div className="px-8 py-8 ">
                <p className=" text-title text-center text-xl mb-10">Tem certeza que deseja deletar esse endereço?</p>
                <Button onClick={() => handleDeleteAddress()} type="button" className="teste2 mb-4">
                    Deletar
                </Button>
                <ButtonSecondary onClick={() => setShowDeleted(false)} type="button" className="teste2">
                    Cancelar
                </ButtonSecondary>
            </div>
        </Modal>
      );
    }
    return null;
  };

  return (
  <>
  {renderModal()}
  {renderDeleteAddress()}
    <Container className="flex h-full justify-center items-center relative" >
        {loading || loadAddress || loadCustomer || loadUpadateCustomer || loadDeleteAddress? <div className="sm:py-10 flex flex-col items-center w-full sm:w-2/3">
            <ReactLoading
            type="bubbles"
            color="#aeaeae"
            height={"10%"}
            width={"10%"}
            />
        </div> :
        <Content>
            <div onClick={() => setShowMenu(!showMenu)} className={`flex md:hidden justify-start ${showMenu ? 'bg-silver-3' : ''} items-center py-4 px-12 md:fixed visible md:invisible cursor-pointer`}>
            {showMenu?
                    <ButtonClear
                        className="absolute top-0 left-0  ml-10 md:ml-40 mt-1 t"
                        onClick={() => {}}
                    >
                        <i className="uil uil-sort-amount-down text-4xl" />
                    </ButtonClear>
                    :
                    <ButtonClear
                        className="absolute top-0 left-0  ml-10 md:ml-40 mt-1 "
                        onClick={() => {}}
                    >
                        <i className="uil uil-sort-amount-up text-4xl" />
                    </ButtonClear>
                }
            </div>
            <div className={`md:grid w-full h-full ${showMenu ? 'grid-rows-2' : 'grid-rows-6'} md:grid-rows-1  grid-flow-col`}>
                <MenuMobile show={showMenu} className="">
                    <div className="flex w-full md:hidden mt-8 md:w-full text-silver-1 md:py-8 justify-end items-end flex-col">
                        <TagMenu onClick={() => setEdit('home')} className={`flex ${edit === 'home' ? ' bg-white border-b-2 text-primary' : ''} hover:text-primary px-10 md:justify-end items-end py-5 hover:bg-white`}>
                            <div className="flex justify-start w-8/12"><i className="uil uil-home-alt mr-5" />Principal</div>
                        </TagMenu>
                        <TagMenu onClick={() => setEdit('address')} className={`flex ${edit === 'address' ? 'bg-white border-b-2 text-primary' : ''} hover:text-primary px-10 md:justify-end items-end py-5 hover:bg-white`}>
                            <div className="flex justify-start w-8/12"><i className="uil uil-map-marker mr-5" />Endereços</div>
                        </TagMenu>
                        <TagMenu onClick={() => setEdit('data')} className={`flex ${edit === 'data' ? 'bg-white border-b-2 text-primary' : ''} hover:text-primary px-10 md:justify-end items-end py-5 hover:bg-white`}>
                            <div className="flex justify-start w-8/12"><i className="uil uil-postcard mr-5" />Cadastro</div>
                        </TagMenu>
                        <TagMenu onClick={() => setShowLogout(true)} className= {`flex ${edit === 'logout' ? 'bg-white border-b-2 text-primary' : ''} hover:text-primary px-10 md:justify-end items-end py-5 hover:bg-white`}>
                            <div className="flex justify-start w-8/12"><i className="uil uil-lock-alt mr-5" />Logout</div>
                        </TagMenu>
                    </div>
                </MenuMobile>
                <Menu className="">
                    <div className="flex md:w-full text-silver-1 md:py-8 justify-end items-end flex-col">
                        <TagMenu onClick={() => setEdit('home')} className={`flex ${edit === 'home' ? ' bg-white border-r-2 text-primary' : ''} hover:text-primary px-10 justify-end items-end py-5 hover:bg-white`}>
                            <div className="flex justify-start w-8/12"><i className="uil uil-home-alt mr-5" />Principal</div>
                        </TagMenu>
                        <TagMenu onClick={() => setEdit('address')} className={`flex ${edit === 'address' ? 'bg-white border-r-2 text-primary' : ''} hover:text-primary px-10 justify-end items-end py-5 hover:bg-white`}>
                            <div className="flex justify-start w-8/12"><i className="uil uil-map-marker mr-5" />Endereços</div>
                        </TagMenu>
                        <TagMenu onClick={() => setEdit('data')} className={`flex ${edit === 'data' ? 'bg-white border-r-2 text-primary' : ''} hover:text-primary px-10 justify-end items-end py-5 hover:bg-white`}>
                            <div className="flex justify-start w-8/12"><i className="uil uil-postcard mr-5" />Cadastro</div>
                        </TagMenu>
                        <TagMenu onClick={() => setShowLogout(true)} className= {`flex ${edit === 'logout' ? 'bg-white border-r-2 text-primary' : ''} hover:text-primary px-10 justify-end items-end py-5 hover:bg-white`}>
                            <div className="flex justify-start w-8/12"><i className="uil uil-lock-alt mr-5" />Logout</div>
                        </TagMenu>
                    </div>
                </Menu>
                <div className="md:col-span-6 px-12 ">
                    {edit === 'home' && (
                        home()
                    )}
                    {edit === 'address' && (
                        address()
                    )}
                    {edit === 'data' && (
                        register()
                    )}
                </div>

            </div>
        </Content>}
    </Container>
    </>
  );
}

export default Orders;
