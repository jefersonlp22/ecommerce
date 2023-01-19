/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Button } from "../Buttons";
import { FormRegisterProps } from "./index.d";
import { useLayout } from "../../contexts/layout";
import ReactLoading from "react-loading";
import InputRadio from "../../components/Radio";
import {TextRadio} from "./style";
import {useQuery} from '@apollo/react-hooks';
import { gql } from "apollo-boost";
import VMasker from "vanilla-masker";
import { TextField } from '@material-ui/core';
import { useForm } from '../../hooks/useForm';
import moment from 'moment';
import empyt from "../../assets/img/empyt.png";

const TypeDelivery: React.FC<FormRegisterProps> = ({ onFinish }) => {

  const [erro, setErro] = useState(null);
  
  // const [erro, setErro] = useState<erroProps>({});
  const layoutContext = useLayout();
  const {
    formRegisterData: form,
    setFormRegisterData,
  } = layoutContext;

  let paymentType= form?.payment_type;
  let postal_code = form?.address_delivery?.postal_code.replace(/[^\d]+/g, "")
    //let postal_code = '72311617';
    let eventDate = form?.eventDate.split("/")
    .reverse()
    .join("-")

  const QUERY_WINE_SLA = gql`
    query($event_date: Date! $postal_code: String!){
        wineDeliverySla(input:{
            postal_code: $postal_code
            desired_delivery_at: $event_date
            payment: {
                type: ${paymentType}
            }
        }) {
            sla
            deadline
            normal
            delivery_price
            schedule {
                date
            }
        }
    }
`;

  const {data, loading: loadFreight, error} = useQuery(QUERY_WINE_SLA, {
    fetchPolicy: 'no-cache',
    variables: {
        event_date: eventDate,
        postal_code: postal_code,
    }
  });


  useEffect(() => {
    if (error) {
      //let type = JSON.parse(error.graphQLErrors[0]?.message);
      //setErros(type.data);
      setErro('Evento muito próximo para entregarmos os produtos')

      //setErros(JSON.parse(error.graphQLErrors[0].message) )
    }
  }, [error]);

    const [dates, setDates] = useState([]);
    const [type, setType] = useState('normal');
    const [dateSelected, setDateSelected] = useState(null);

    useEffect(() => {
        if (data) {
          if (data?.wineDeliverySla?.normal) {
            if (type === 'normal') {
              setDateSelected(moment(data?.wineDeliverySla?.normal).format("DD/MM/YYYY"))
            }else{
              setDateSelected(moment(data?.wineDeliverySla?.schedule[0]?.date).format("DD/MM/YYYY"))
            }
          } else{
            setErro('Evento muito próximo para entregarmos os produtos')
          }
        }
      }, [data, type]);
    
      useEffect(() => {
        if (data) {
        setDates(data?.wineDeliverySla?.schedule)
        }
      }, [data]);

      let minimumDate = moment(dates[0]?.date).format("DD/MM/YYYY");
      let maxDate = moment(dates[dates.length - 1]?.date).format("DD/MM/YYYY")

  const initialFValues = {
    delivery_estimate: dateSelected || ''
  };

  const isValidEventDate = (input: string) => {
    let date = input.split("/")
    .reverse()
    .join("-")

    let dateValid  = moment(date).isBetween( dates[0]?.date,  dates[dates.length - 1]?.date,  undefined, '[]')
    
    return dateValid;
  };

  const validate = (fieldValues = values) => {
    const temp: any = { ...errors };
    
    temp.delivery_estimate = isValidEventDate(fieldValues?.delivery_estimate)
          ? ""
          : fieldValues?.delivery_estimate === "" ? "Este campo precisa ser preenchido" : "Data não é válida.";

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

  const handleSubmit = () => {
    if (type === 'normal') {
        setFormRegisterData({ ...form, delivery_type: 'normal', delivery_estimate: dateSelected });
        onFinish(values);
        resetForm();
        return;
    }
    if (validate()) {
      setFormRegisterData({ ...form, delivery_type: 'programada', ...values });
      onFinish(values);
      resetForm();
    }
  };

  return (
    <>
      {loadFreight ? (
        <div className="sm:py-10 flex flex-col items-center w-full sm:w-2/3">
          <ReactLoading
            type="bubbles"
            color="#aeaeae"
            height={"30%"}
            width={"30%"}
          />
        </div>
      ) :
      (
        erro ?
        (
          <div className="sm:py-10 flex flex-col items-center w-full sm:w-2/3">
            <div className="mb-5">
              <img width={80} loading="lazy" src={empyt} alt="" />
            </div>
            <h2 className="mb-10 text-title text-xl text-center">
              <strong>
                Ops!
              </strong>
            </h2>
            <p  className="text-center text-xs text-text-1 mb-5">
               {erro}
            </p>

        </div>
        )
        :
        (<div className="sm:py-10 flex flex-col items-center w-full sm:w-2/3">
            <h2 className="mb-10 text-title text-xl text-center">
            <strong>
            Tipo de entrega
            </strong>
            </h2>
            <div className="w-full flex-row">
                <div className="flex w-ful justify-center flex-row">
                    <div className="flex w-32 items-baseline flex-row">
                        <InputRadio selectedInput={setType} active={type === 'normal'} value={'normal'}></InputRadio>
                        <TextRadio active={type === 'normal'}>Normal</TextRadio>
                    </div>
                    <div hidden={dates.length < 1} className={`flex w-32 ${dates.length < 1 ? 'hidden' : ''} items-baseline flex-row`}>
                        <InputRadio selectedInput={setType} active={type === 'programada'} value={'programada'}></InputRadio>
                        <TextRadio active={type === 'programada'}> Programada</TextRadio>
                    </div>
                </div>
                    {type === 'normal' ? 
                    <div className="flex w-ful justify-center flex-row">
                        <div className="text-center text-xs text-text-1 mb-5">
                            Previsão
                            <TextRadio active={true}>{dateSelected}</TextRadio>
                        </div>
                    </div>
                    : 
                    <div className="flex w-ful justify-center flex-col">
                        <div className="mb-4 w-full flex justify-center items-center">
                            <div className="mb-4 w-2/3">
                                    <TextField
                                    fullWidth={true}
                                    required={true}
                                    type="tel"
                                    label='Data'
                                    name="delivery_estimate"
                                    autoComplete="nope"
                                    value={VMasker.toPattern(values.delivery_estimate, "99/99/9999")}
                                    onChange={handleInputChange}
                                    {...(errors?.delivery_estimate && { error: true, helperText: errors?.delivery_estimate })}
                                    />
                                </div>
                        </div>
                        <div>
                            <p className="text-center text-xs text-text-1 mb-5">
                                {`Escolha uma data entre ${minimumDate} e ${maxDate}`}
                            </p>
                            <p  className="text-center text-xs text-text-1 mb-5">
                                Importante: A entrega pode ser feita até 3 dias antes da data agendada.
                            </p>
                        </div>
                    </div>
                }
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
        </div> )
    )}
    </>
  );
};

export default TypeDelivery;
