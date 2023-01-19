/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useCallback } from "react";
import { TextField } from "@material-ui/core";
import { Button } from "../Buttons";
import { FormRegisterProps } from "./index.d";
import { useLayout } from "../../contexts/layout";
import VMasker from "vanilla-masker";
import ApolloClient, { gql } from "apollo-boost";
import { isValidCEP } from "@brazilian-utils/brazilian-utils";
import { useForm, Form } from "../../hooks/useForm";

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

const client = new ApolloClient({
  uri: process?.env?.REACT_APP_API_URL || ""
});

const FormAddress: React.FC<FormRegisterProps> = ({ onFinish }) => {
  const layoutContext = useLayout();

  const { formRegisterData: form, setFormRegisterData } = layoutContext;

  const initialFValues = {
    number: form.number ?? "",
    postal_code: form.postal_code ?? "",
    complement: form.complement ?? "",
    addressee: form?.addressee ?? "",
    name: form.name ?? "",
    email: form.email ?? "",
    phone: form.phone ?? "",
    birthday: form.birthday ?? "",
    document: form.document ?? "",
    type: form.type ?? "",
    company_name: form?.company_name ?? "",
    company_document: form?.company_document ?? "",
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

  const {
    values,
    errors,
    setErrors,
    handleInputChange,
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

  const handleSubmit = e => {
    e.preventDefault();
    if (validate()) {
      setFormRegisterData({ ...form, ...values });
      onFinish(false);
    }
  };

  useEffect(() => {
    if (values.postal_code.length >= 9 && isValidCEP(values.postal_code)) {
      getDataPostalCode(values.postal_code);
    }
  }, [values.postal_code]);

  useEffect(() => {
    setValues(prev => ({ ...prev, state: form.state }));
    setValues(prev => ({ ...prev, city: form.city }));
    setValues(prev => ({ ...prev, district: form.district }));
    setValues(prev => ({ ...prev, address: form.address }));
  }, [form.state, form.city, form.district, form.address, setValues]);

  console.log('akivalus',values)

  return (
    <div className="sm:py-10 flex flex-col items-center sm:w-2/3">
      <h2 className="mb-10 text-title text-xl text-center">
        <strong>
          Endereço
        </strong>
      </h2>
      <div className="sm:px-3 w-full">
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
              name="addressee"
              autoComplete="nope"
              required={false}
              value={values.addressee || ""}
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
            Avançar
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default FormAddress;
