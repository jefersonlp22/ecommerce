import React from "react";
import { TextField } from "@material-ui/core";
import { Button } from "../Buttons";
import { FormRegisterProps } from "./index.d";
import { useLayout } from "../../contexts/layout";
import VMasker from "vanilla-masker";
import { isValidCPF, isValidPhone, isValidCNPJ } from "@brazilian-utils/brazilian-utils";
import { useForm, Form } from "../../hooks/useForm";

const DataNfe: React.FC<FormRegisterProps> = ({ onFinish }) => {
  const layoutContext = useLayout();
  const { formRegisterData: form, setFormRegisterData } = layoutContext;

  const initialFValues = {
    nf_name: form?.name ?? "",
    nf_email: form?.email ?? "",
    nf_phone: form?.phone ?? "",
    nf_document: form?.document ?? "",
    nf_company_document: form?.company_document ?? "",
    type: form?.type ?? "",
    nf_company_name: form?.company_name
  };

  const validate = (fieldValues = values) => {
    let temp: any = { ...errors };

    if ("name" in fieldValues) {
      temp.name = fieldValues.name ? "" : "Este campo precisa ser preenchido.";
    }

    if ("phone" in fieldValues) {
      temp.phone = isValidPhone(fieldValues?.phone)
        ? ""
        : "Telefone não é válido.";
    }

    if ("document" in fieldValues) {
      temp.document = isValidCPF(fieldValues?.document) ? "" : "CPF não é válido.";
    }

    if ("company_document" in fieldValues && values?.type !== 'pf') {
        temp.company_document = isValidCNPJ(fieldValues?.company_document) ? "" : "CNPJ não é válido.";
    }

    setErrors({ ...temp });

    if (fieldValues === values) {
      return Object.values(temp).every(x => x === "");
    }
  };

  const { values, errors, setErrors, handleInputChange, resetForm } = useForm(
    initialFValues,
    true,
    validate
  );


  const handleSubmit = e => {
    e.preventDefault();
    if (validate()) {
      setFormRegisterData({ ...form, dataNf: values });
      onFinish(values);
      resetForm();
    }
  };

  console.log('forrm',form)

  return (
    <div className="sm:py-10 flex flex-col items-center sm:w-2/3">
      <h2 className="mb-10 text-title text-xl text-center">
        <strong>
            Dados para NF
        </strong>
      </h2>
      <div className="sm:px-3 w-full">
        <Form onSubmit={handleSubmit}>
          <div className="mb-5">
            <TextField
              fullWidth={true}
              type="text"
              label="Nome completo"
              name="nf_name"
              required={true}
              autoComplete="nope"
              value={values.nf_name}
              onChange={handleInputChange}
              {...(errors?.nf_name && { error: true, helperText: errors?.nf_name })}
            />
          </div>
          {values?.type  === 'pf' ?
            <div className="mb-5">
            <TextField
              fullWidth={true}
              className="color-primary"
              type="tel"
              label="CPF"
              name="nf_document"
              required={true}
              autoComplete="nope"
              value={VMasker.toPattern(values.nf_document, "999.999.999-99")}
              onChange={handleInputChange}
              {...(errors?.nf_document && { error: true, helperText: errors?.nf_document })}
            />
          </div>
          :
          <div className="mb-5">
            <TextField
              fullWidth={true}
              className="color-primary"
              type="tel"
              label="CNPJ"
              name="nf_company_document"
              required={true}
              autoComplete="nope"
              value={VMasker.toPattern(values.nf_company_document, "99.999.999/9999-99")}
              onChange={handleInputChange}
              {...(errors?.nf_company_document && { error: true, helperText: errors?.nf_company_document })}
            />
          </div>
          }
          
          <div className="mb-5">
            <TextField
              fullWidth={true}
              type="text"
              label="Celular"
              name="nf_phone"
              required={true}
              autoComplete="nope"
              value={VMasker.toPattern(values.nf_phone, "(99) 99999-9999")}
              onChange={handleInputChange}
              {...(errors?.nf_phone && { error: true, helperText: errors?.nf_phone })}
            />
          </div>

          {values?.type  === 'pf' ? 
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
            :
            <div className="mb-5">
                <TextField
                fullWidth={true}
                type="text"
                label="Razão social"
                name="nf_company_name"
                required={true}
                autoComplete="nope"
                value={values.nf_company_name}
                onChange={handleInputChange}
                {...(errors?.nf_company_name && { error: true, helperText: errors?.nf_company_name })}
                />
            </div>
          }

          <Button type="submit" className="teste2">
            Avançar
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default DataNfe;
