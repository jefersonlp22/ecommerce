/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback, useEffect } from "react";
import { useLayout } from "../../contexts/layout";
import { Modal } from "../Modal";
import FormEmail from "./email";
import FormData from "./data";
import FormAddress from "./address";
import FormConfirm from "./confirm";
import { ButtonClear } from "../Buttons";
import FormSuccess from "./success";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { immediateToast } from "izitoast-react";
import FreightForm  from "./FreightForm";
import EventDate from "./eventDate";
import TypeDelivery from "./typeDelivery";
import PaymentType from "./paymentType";
import FormAddressDelivery from "./addressDelivery";
import PersonType from "./personType";
import DataNfe from "./dataNfe";
import ResetPassword from "./resetPassword";
import { useHistory } from "react-router-dom";
import { ROUTE_TENANT_ORDER_DETAIL } from "../../constants/";

// import { SaveFormCart } from './index';

interface SaveFormCart {
  variables: any;
}

let transactionDraft = [];


const GET_ORDER = gql`
  query($id: String) {
    orderStore(id: $id) {
      id
      external_id
      customer_id
      code
      quantity
      tenant_id
      total
      subtotal
      shipping
      total_formatted
      user_id
      placed_at
      approved_at
      paid_at
      discount
      billed_at
      shipped_at
      delivered_at
      canceled_at
      shippings{
        id
        desired_delivery_at
        delivery_estimate
        shipping_method
        shipping_price
        working_days
      }
      customer {
        id
        email
        name
        phone
        document
      }
      items {
        id
        subtotal
        sku
        shipping
        shipped_at
        order_id
        total_formatted
        name
        discount
        total
        delivered_at
        product_variant_id
        product_variant_frozen
        data
        quantity
      }
      delivery_address{
        name
        postal_code
        addressee
        address
        number
        complement
        district
        city
        state
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
`;

const FormRegister: React.FC = () => {
  const [formState, setFormState] = useState({});
  const layoutContext = useLayout();
  const [loading, setLoading] = useState(false);
  const [wineSteps, setWineSteps] = useState(1);
  const history = useHistory();
  const [resetPassword, setResetPassword] = useState(false);

  const formRegisterStep = layoutContext?.formRegisterStep || 0;

  const ORDER_STORE = gql`
    mutation(
      $customer: CustomerStoreInput!
      $address: AddressStoreInput!
      $products: [ProductsStoreInput]!
      $delivery: OrderDeliveryInput
      $shipping: Int
      $discount: Int
    ) {
      createOrderStore(
        input: {
          customer: $customer,
          address: $address,
          products: $products,
          delivery: $delivery,
          shipping: $shipping,
          discount: $discount
          payment_type:{
            type: ${layoutContext?.formRegisterData?.payment_type }
          }
        }
      ) {
        external_id
      }
    }
  `;

  const [createOrder] = useMutation(ORDER_STORE);
  const [getOrder, { data: dataOrder }] = useLazyQuery(GET_ORDER);

  const createOrderStore = useCallback(async (obj: any) => {

    const customer = {
      name: obj?.name,
      email: obj?.email,
      phone: obj?.phone?.replace(/[^\d]+/g, ""),
      birthday: obj?.birthday
        ? obj?.birthday
            .split("/")
            .reverse()
            .join("-")
        : "",
      document: obj?.document.replace(/[^\d]+/g, "")
    };

    const address = {
      postal_code: obj?.address_delivery?.postal_code.replace(/[^\d]+/g, ""),
      number: parseInt(obj?.address_delivery?.number, 10),
      state: obj?.address_delivery?.state,
      city: obj?.address_delivery?.city,
      district: obj?.address_delivery?.district,
      address: obj?.address_delivery?.address,
      complement: obj?.address_delivery?.complement,
      local_reference: obj?.address_delivery?.reference,
    };

    const delivery = {
      setting_id: obj?.freight?.setting_id,
      shipping_method: obj?.freight?.name || obj?.delivery_type || '',
      shipping_price: obj?.freight?.freight_price,
      working_days: obj?.freight?.days_to_delivery,
      delivery_estimate: obj?.delivery_estimate ? obj?.delivery_estimate.split("/")
      .reverse()
      .join("-") : "",
      desired_delivery_at: obj?.eventDate ? obj?.eventDate.split("/")
      .reverse()
      .join("-") : "",
    };

    // if (layoutContext.tenant.name === 'Wine Eventos') {
    //   delivery = {

    //     shipping_method: obj?.delivery_type
    //   }

    // }

    const products = layoutContext?.cartItems?.flatMap((item: any) => ({
      variant_id: Number(item?.product?.id),
      quantity: parseInt(item?.qty, 10)
    }));

    try {
      let saveStore = null;

      let variablesToSave: SaveFormCart = {
        variables: {
          customer,
          address,
          products,
          discount: layoutContext?.discount
        }
      };

      if(layoutContext?.tenant?.data?.freight_methods || layoutContext.tenant.name === 'Wine Eventos'){
        variablesToSave.variables = {
          ...variablesToSave.variables,
          delivery,
          shipping: obj?.freight?.is_free ? 0 : obj?.freight?.freight_price || 0
        }
      }

      saveStore = await createOrder(variablesToSave);

      if (saveStore) {
        setStep(10);
        layoutContext?.cartReset();
        setTimeout(async () => {
          getOrder({
            variables: { id: saveStore.data.createOrderStore.external_id }
          });
        }, 8000);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      immediateToast("error", {
        message: error.graphQLErrors[0].message,
        position: "topLeft",
        icon: undefined,
        class: "sm:rounded-full overflow-hidden",
        messageColor: "white"
      });
    }
  }, []);

  const handleClose = () => {
    // if (layoutContext.setFormRegisterOpen && formRegisterStep === 4) {
    //   setStep(3)
    // }
    if (layoutContext.formRegisterIsEditing && formRegisterStep < 9) {
      layoutContext?.setFormRegisterStep(9)
      return
    }

    if (layoutContext.setFormRegisterOpen && formRegisterStep !== 4) {
      layoutContext.setFormRegisterOpen(false);
    }


    if (formRegisterStep === 10) {
      layoutContext?.formReset();
    }
  };

  const setStep = (step: number) => {
    if (layoutContext.setFormRegisterStep) {
      layoutContext.setFormRegisterStep(step);
    }
  };

  const handlePrevOrNext = (isNext: boolean, form?: any) => {
    console.log('wineSteps', wineSteps, 'isnextt', isNext, 'stepatual', formRegisterStep);
    if (isNext && formRegisterStep === 7 && layoutContext.tenant.name !== 'Wine Eventos') {
      setStep(9)
      return
    }
    if (formRegisterStep === 4 && !isNext) {
      setStep(3)
      return;
    }

    if (layoutContext?.formRegisterData?.number && formRegisterStep === 3) {
      if (isNext) {
        setStep(5);
      } else if(form?.edit){
        let step = formRegisterStep || 0;
        step = step + 1;
        setStep(step);
      }
      else{
        let step = formRegisterStep || 0;
        step = isNext ? step + 1 : step - 1;
        setStep(step);
      }
      return
    }

    if (formRegisterStep === 8 && wineSteps < 4) {
      if (layoutContext.formRegisterIsEditing && wineSteps === 3) {
        setWineSteps(1)
      }
      if (wineSteps === 1 && !isNext) {
        setStep(6)
        setWineSteps(1);
        return;
      }
      if (wineSteps === 3 && isNext) {
        console.log('akiiii')
        setWineSteps(1)
        setStep(9)
        return;
      }
      let step = wineSteps || 0;
      step = isNext ? step + 1 : step - 1;
      setWineSteps(step);
      return;
    }

    if (formRegisterStep === 6 && isNext && !layoutContext?.tenant?.data?.freight_methods) {

      if (layoutContext.tenant.name === 'Wine Eventos') {

        setStep(8);
      return;
      }
      setStep(9);
      return;
    }

    if (formRegisterStep === 9 && isNext) {
      setLoading(true);

      createOrderStore(form);

      return;
    }

    if (layoutContext.formRegisterIsEditing ) {
      if (formRegisterStep  !== 5) {
        setStep(9);
        setWineSteps(1)
        return;
      }
      setWineSteps(1)
    }

    let step = formRegisterStep || 0;
    step = isNext ? step + 1 : step - 1;
    setStep(step);
  };

  const handleNext = (val: {}) => {
    setFormState({ ...formState, ...val });
    handlePrevOrNext(true, val);
  };

  useEffect(() => {
    if (formRegisterStep > 9) {
      if (dataOrder && dataOrder?.orderStore?.transactions.length > 0) {

        layoutContext?.setOrderDetail({...dataOrder?.orderStore, delivery:[dataOrder?.orderStore.delivery_address]});
        transactionDraft = dataOrder?.orderStore?.transactions.filter(
          (transition: any) => transition.status === "draft"
        );
        history.push(`${ ROUTE_TENANT_ORDER_DETAIL()}`);
        setLoading(false);
        window.open(
          `${process.env.REACT_APP_INVOICE}/fatura/${transactionDraft[0]?.external_id}`,
          "_blank"
        );
      } else {

        history.push(`${ ROUTE_TENANT_ORDER_DETAIL()}`);
        layoutContext?.setOrderDetail({...dataOrder?.orderStore, delivery:[dataOrder?.orderStore.delivery_address]});
        setLoading(false);
      }
    }

  }, [dataOrder]);
  console.log('layoutContext?.cartItems',layoutContext?.cartItems)

  return (
    <>
      <Modal modalw={540} onClose={handleClose}>
        {formRegisterStep < 9  &&
          (layoutContext.formRegisterIsEditing ||
            layoutContext.formRegisterStep !== 1) && (
            <ButtonClear
              className={ `${(layoutContext?.customer &&  layoutContext.formRegisterStep === 5) ? 'hidden' : ''} absolute top-0 left-0 ml-2 mt-1 text-3xl`}
              onClick={() => handlePrevOrNext(false)}
            >
              <i className="uil uil-arrow-left text-title" />
            </ButtonClear>
          )}
          { resetPassword && (
          <ResetPassword onFinish={(val: any) => handleNext(val)} resetPassword={() => setResetPassword(!resetPassword)} />
        )}
        {formRegisterStep === 1 && !resetPassword && (
          <FormEmail onFinish={(val: any) => handleNext(val)} resetPassword={() => setResetPassword(!resetPassword)}/>
        )}
        {formRegisterStep === 2 && (
          <PersonType onFinish={(val: any) => handleNext(val)} />
        )}
        {formRegisterStep === 3 && (
          <FormData handlePrevOrNext={( isNext: boolean, val: any) => handlePrevOrNext(isNext, val)} onFinish={(val: any) => handleNext(val)} />
        )}
        {formRegisterStep === 4 && (
          <FormAddress handlePrevOrNext={( isNext: boolean, val: any) => handlePrevOrNext(isNext, val)} onFinish={(val: any) => handlePrevOrNext(val)} />
        )}
        {formRegisterStep === 5 && (
          <FormAddressDelivery onFinish={(val: any) => handleNext(val)} />
        )}
        {formRegisterStep === 6 && (
          <DataNfe onFinish={(val: any) => handleNext(val)} />
        )}
        {formRegisterStep === 7 && (
          <FreightForm onFinish={(val: any) => handleNext(val)} />
        )}
        {formRegisterStep === 8 &&
          (
            wineSteps === 1 ? <PaymentType onFinish={(val: any) => handleNext(val)} /> :
            wineSteps === 2 ? <EventDate onFinish={(val: any) => handleNext(val)} /> :
            wineSteps === 3 ? <TypeDelivery onFinish={(val: any) => handleNext(val)} /> : null
          )
        }
        {formRegisterStep === 9 && (
          <FormConfirm
            loading={loading}
            onFinish={form => handlePrevOrNext(true, form)}
          />
        )}
        {formRegisterStep === 10 && (
          <FormSuccess
            transaction={transactionDraft}
            loading={loading}
            onFinish={handleClose}
          />
        )}
      </Modal>
    </>
  );
};

export { FormRegister };
