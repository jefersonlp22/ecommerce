import React, {useState, useEffect} from 'react';
import { TextField } from '@material-ui/core';
import { Button } from '../Buttons';
import { FormRegisterProps } from './index.d';
import { useLayout } from '../../contexts/layout';
import { useForm, Form } from '../../hooks/useForm';
import ReactLoading from "react-loading";
import {useQuery} from '@apollo/react-hooks';
import { gql } from "apollo-boost";

const FormEventDatte: React.FC<FormRegisterProps> = ({ onFinish }) => {
  const layoutContext = useLayout();

  const { formRegisterData: form, setFormRegisterData } = layoutContext;
  const [dateDefault, setDateDefault] = useState('');
  const [dateSelected, setDateSelected] = useState('');

  const initialFValues = {
    eventDate: ''
  };
  let paymentType= form?.payment_type;
  let postal_code = form?.address_delivery?.postal_code.replace(/[^\d]+/g, "")

  const QUERY_WINE_SLA = gql`
    query{
      wineDeliveryFirstScheduleDay(input:{postal_code: "${postal_code}" payment: {type: ${paymentType}}}){
        days
        first_schedule_day
      }
    }
  `;

  const {data, loading} = useQuery(QUERY_WINE_SLA, {
    fetchPolicy: 'no-cache'
  });

  const isValidEventDate = (input: string) => {
    let formated= input.split("-").reverse().join("/")

    const reg = /(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d/;

    return formated.match(reg) ? true : false;
  };



  const validate = (fieldValues = values) => {
    const temp: any = { ...errors };


    temp.eventDate = isValidEventDate(dateSelected)
          ? ""
          : fieldValues?.eventDate === "" ? "Este campo precisa ser preenchido" : "Data não é válida.";

    setErrors({ ...temp });

    if (fieldValues === values) {
      return Object.values(temp).every((x) => x === "");
    }

  };

  const { values, errors, setErrors, resetForm } = useForm(
    initialFValues,
    true,
    validate
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setFormRegisterData({ ...form, eventDate:  dateSelected.split("-").reverse().join("/")});
      onFinish(values);
      resetForm();
    }
  };

useEffect(() => {
  if (data) {
    setDateDefault(data?.wineDeliveryFirstScheduleDay?.first_schedule_day)
    setDateSelected(data?.wineDeliveryFirstScheduleDay?.first_schedule_day)
  }
}, [data]);


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

  return (
    <div className="sm:py-10 flex flex-col w-full items-center sm:w-2/3">
      { dateDefault ?
      <>
        <h2 className="mb-10 text-title text-xl text-center">
        <strong>Data do evento</strong>
      </h2>
      <div className="sm:px-4 items-center justify-center w-full">
        <Form onSubmit={handleSubmit}>
            <div className="mb-4 w-full flex flex-col justify-center items-center">
              <div className="mb-10 w-2/3">
                  {/* <TextField
                  fullWidth={true}
                  //defaultValue={moment(dateDefault).format("DD/MM/YYYY")}
                  required={true}
                  type="tel"
                  label='Data do evento'
                  name="eventDate"
                  autoComplete="nope"
                  value={VMasker.toPattern(values.eventDate, "99/99/9999")}
                  onChange={handleInputChange}
                  {...(errors?.eventDate && { error: true, helperText: errors?.eventDate })}
                /> */}
                <TextField
                  id="date"
                  required={true}
                  label="Data do evento"
                  type="date"
                  name="eventDate"
                  onChange={ e => setDateSelected(e.target.value)}
                  value={dateSelected}
                  //defaultValue="2017-05-24"
                  //defaultValue={`${dateDefault}`}
                  inputProps={{
                    min:`${dateDefault}`,
                    max: "2022-08-20"
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  {...(errors?.eventDate && { error: true, helperText: errors?.eventDate })}
                />
              </div>
              <div className="flex w-ful justify-center flex-col">
                <p className="text-center text-xs text-text-1 mb-5">
                  Para melhorar sua experiência nos conte a data que pretende utilizar seus produtos, caso sua compra seja para brindar em uma ocasião especial.
                </p>
              </div>
            </div>
          <Button type="submit" className="teste2">
            Avançar
          </Button>
        </Form>
      </div>
      </>
      : null
      }

    </div>
  );
};

export default FormEventDatte;
