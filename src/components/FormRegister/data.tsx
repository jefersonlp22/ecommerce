import React, {useState, useEffect  } from "react";
import { TextField } from "@material-ui/core";
import { Button } from "../Buttons";
import { FormRegisterProps } from "./index.d";
import { useLayout } from "../../contexts/layout";
import VMasker from "vanilla-masker";
import { isValidCPF, isValidPhone, isValidCNPJ } from "@brazilian-utils/brazilian-utils";
import { useForm, Form } from "../../hooks/useForm";
import { immediateToast } from "izitoast-react";
import moment from 'moment';
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import ReactLoading from "react-loading";
import { ROUTE_TENANT_HOME } from "../../constants";
import { useHistory } from "react-router-dom";
import { Modal } from "../Modal";

const FormData: React.FC<FormRegisterProps> = ({ onFinish, handlePrevOrNext }) => {
  const layoutContext = useLayout();
  const [dateValid, setDateValid] = useState(false);
  const [logued, setLogued] = useState(false);

  const history = useHistory();

  const { formRegisterData: form, setFormRegisterData, tenant,ambassador,handleCustomer } = layoutContext;

  const initialFValues = {
    name: form.name ?? "",
    email: form.email ?? "",
    phone: form.phone ?? "",
    birthday: form.birthday ?? "",
    document: form.document ?? "",
    type: form.type ?? "",
    company_name: form?.company_name ?? "",
    company_document: form?.company_document ?? "",
  };
  const REGISTER_CUSTOMER = gql`
  mutation(
    $email: String
    $name: String
    $phone: String
    $document: String
    $company_name: String
    $company_document: String
    $type: String
    $birthday: String
    $password: String
    $creator_user_id: Int
  ){
    registerCustomer(input:
      {
        tenant_id: "${tenant?.id}",
        email: $email
        name: $name
        phone: $phone
        document:$document
        company_name: $company_name
        company_document: $company_document
        birthday: $birthday
        type: $type
        password: $password
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
        state
        district
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

  const [registerCustomer, { loading}] = useMutation(REGISTER_CUSTOMER)
  const [ custumerAddress, {loading: loadingAddree}] = useMutation(CUSTOMER_ADDRESS)

  const isValidBirth = (input: string) => {
    const reg = /(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d/;

    return input.match(reg) ? true : false;
  };

  const validate = (fieldValues = values) => {
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

  const { values, errors, setErrors, handleInputChange, setValues, resetForm } = useForm(
    initialFValues,
    true,
    validate
  );



  const handleSubmit = async e => {
    e.preventDefault();
    if (validate()) {
      let saveCusttomer = await registerCustomer({
        variables:{
          email: values?.email || "",
          name: values?.name || "",
          phone: values?.phone.replace(/[^\d]+/g, "") || "",
          document: values?.document.replace(/[^\d]+/g, "") || "",
          company_name: values?.company_name || "",
          company_document: values.company_document !== ""? values.company_document.replace(/[^\d]+/g, "") : "",
          type: values?.type || "",
          birthday: values?.birthday?.split("/")
          .reverse()
          .join("-") || "",
          password: form?.password ,
          creator_user_id: ambassador?.id
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

      if (saveCusttomer) {
        setFormRegisterData({ ...form,  ...values});
        handleCustomer(saveCusttomer?.data?.registerCustomer)
        let saveAddress =  await custumerAddress({
          variables:{
            customer_id: saveCusttomer?.data.registerCustomer?.id,
            name: form?.addressee || "",
            city: form?.city || "",
            city_code: "",
            postal_code: form?.postal_code.replace(/[^\d]+/g, "") || "",
            addressee: values?.name || "",
            address: form?.address ||  "",
            number: form?.number || "",
            local_reference: form?.local_reference || "",
            complement: form?.complement || "",
            district: form?.district || "",
            state: form?.state || "",
            creator_user_id: ambassador?.id,
          }
        })
        if (saveAddress) {
           setFormRegisterData({ ...form,  addresses: [saveAddress?.data?.customerAddAddress], ...values});
           handleCustomer({...saveCusttomer?.data?.registerCustomer, addresses: [saveAddress?.data?.customerAddAddress]})
            history.push(`${ ROUTE_TENANT_HOME()}`);
            setLogued(true)
          resetForm();
        }
      }
    }
  };

  const handleEditAddress = () => {
    setFormRegisterData({ ...form, ...values });
    handlePrevOrNext(false, {edit: true})
  }

  const handleAddress = () => {
    setValues({...values})
    onFinish(false)
    setFormRegisterData({...form, ...values})
  }

 useEffect(() => {
   if (tenant?.data?.legality_settings?.customer?.mandatory_age) {
     setDateValid(true)
   }
 }, [tenant]);

 const handleLogued = () => {
  setLogued(!logued);
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
    {loadingAddree|| loading ? (
      <div className="sm:py-10 flex flex-col items-center w-full sm:w-2/3">
        <ReactLoading
          type="bubbles"
          color="#aeaeae"
          height={"30%"}
          width={"30%"}
        />
      </div>
    ) : (
        <div className="sm:py-10 flex flex-col items-center sm:w-2/3">
          <h2 className="mb-10 text-title text-xl text-center">
            <strong>
              {values?.type === 'pf' ? 'Pessoa Física' : 'Pessoa Jurídica'}
            </strong>
          </h2>
          <div className="sm:px-3 w-full">
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
                  value={form?.email || ""}
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
              {form?.number ?
                <div onClick={() => handleEditAddress()}  className="mb-3  pointer-events-auto cursor-pointer">
                  <p className="text-left text-xs text-text-1 mb-3">
                    Endereço
                  </p>
                  <p className="text-left text-xs text-title">
                    {form?.address}, {form?.number}
                  </p>
                  <p className="text-left text-xs text-title">
                    {form?.complement}
                  </p>
                  <p className="text-left text-xs text-title">
                    {form?.district}
                  </p>
                  <p className="text-left text-xs text-title">
                    {form?.city} - {form?.state}
                  </p>
                </div>
                :
                <div onClick={() => handleAddress()}  className="mb-5 pointer-events-auto cursor-pointer">
                  <TextField
                    fullWidth={true}
                    type="tel"
                    aria-readonly
                    label="Cadastre seu endereço"
                    name="address"
                    required={true}
                    autoComplete="nope"
                    onChange={handleInputChange}
                    {...(errors?.address && { error: true, helperText: errors?.address })}
                  />
                </div>
              }

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
                Avançar
              </Button>
            </Form>
          </div>
        </div>
    )}
    </>
  );
};

export default FormData;
