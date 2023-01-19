/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import { Container } from "../../components/Grid";
import { useHistory } from "react-router-dom";
import { useLayout } from "../../contexts/layout";
import { Content, Card, Status, Line, TextStatus, Link, Detail} from "./style";
import CardInfo from "../../components/FormRegister/card";
import { ButtonClear  } from "../../components/Buttons";
import { ROUTE_TENANT_ORDERS} from "../../constants/";
import moment from 'moment';
import VMasker from "vanilla-masker";

//import  currency from "currency.js"


// import { Container } from './styles';

const OrderDetail: React.FC = () => {
  const history = useHistory();

  const layoutContext = useLayout();
  const { catalog, setCatalog, orderDetail, ambassador, customer} = layoutContext;

  useEffect(() => {
    setCatalog({ ...catalog, currentCollection: {name: 'Detalhe do pedido'} });
  }, [])

  const handleBack = () => {
    history.push(`${ ROUTE_TENANT_ORDERS()}`)
  }

  const handleInvoce = () => {
    window.open(
      `${process.env.REACT_APP_INVOICE}/fatura/${orderDetail?.transactions[0]?.external_id}`,
      "_blank"
    );
  }

  console.log('oderdeetail',orderDetail)
  useEffect(() => {
    if (orderDetail) {
      
    }else{
      history.push(`${ ROUTE_TENANT_ORDERS()}`)
    }
  }, [orderDetail]);

  let description = orderDetail?.approved_at ? 'Pedido liberado!' :  orderDetail?.paid_at ? 'Pagamento confirmado' : 'Só um momentinho!'
  let msg = orderDetail?.approved_at ? 'Falta muito pouco!' :  orderDetail?.paid_at ? 'Estamos finalizando os últimos detalhes do seu pedido.' : 'Em pouco tempo a marca deve liberar o seu pedido.'


  return (
    <Container className="flex justify-center items-center relative flex-col" >
      <ButtonClear
        className="absolute top-0 left-0  ml-10 md:ml-40 md:mt-1 text-3xl"
        onClick={() => handleBack()}
      >
        <i className="uil uil-arrow-left text-white" />
      </ButtonClear>
      <div className="flex  py-24 bg-top justify-center items-center w-full bg-primary text-title text-4xl ">
      </div>
      <Content className="flex flex-col z-10 w-5/6 md:w-7/12 -mt-32  md:-mt-40 justify-center items-start">
          <p className="text-white text-sm">{description}</p>
          <p className="text-white text-xl">{msg}</p>
          <Card className="flex relative px-10 md:px-0 py-10 md:py-20 my-4 justify-center items-baseline md:items-center flex-col md:flex-row bg-white shadow-sm">
            <div className="flex md:w-full my-4 justify-start md:justify-center items-center flex-col md:flex-row bg-white">
              <Status className='bg-success'>
                <TextStatus className="text-silver-1 w-40 md:w-20 text-xs ml-10 md:ml-0 md:mt-10 " >Aguardando aprovação</TextStatus>
              </Status>
              <Line className={` ${orderDetail?.approved_at ? 'bg-success' : 'bg-silver-1'} h-10 md:h-1  w-1 md:w-2/12`} ></Line>
              <Status className={`${orderDetail?.approved_at ? 'bg-success' : 'bg-silver-1'}`}>
                <TextStatus className="text-silver-1 w-40 md:w-20 text-xs  ml-10 md:ml-0 md:mt-10" >Aguardando pagamento</TextStatus>
              </Status>
              <Line className={` ${orderDetail?.paid_at ? 'bg-success' : 'bg-silver-1'} h-10 md:h-1 w-1 md:w-2/12`}></Line>
              <Status className={`${orderDetail?.paid_at ? 'bg-success' : 'bg-silver-1'}`}>
                <TextStatus className="text-silver-1 w-40 md:w-20 text-xs ml-10 md:ml-0 md:mt-10" >Aguardando envio</TextStatus>
              </Status>
              <Line className={` ${orderDetail?.shipped_at ? 'bg-success' : 'bg-silver-1'} h-10 md:h-1 w-1 md:w-2/12`}></Line>
              <Status className={`${orderDetail?.shipped_at ? 'bg-success' : 'bg-silver-1'}`}>
                <TextStatus className="text-silver-1 w-40 md:w-20 text-xs ml-10 md:ml-0 md:mt-10" >Aguardando entrega</TextStatus>
              </Status>
              <Line className={` ${orderDetail?.delivered_at ? 'bg-success' : 'bg-silver-1'} h-10 md:h-1 w-1 md:w-2/12`}></Line>
              <Status className={`${orderDetail?.delivered_at ? 'bg-success' : 'bg-silver-1'}`}>
                <TextStatus className="text-silver-1 w-40 md:w-20 text-xs ml-10 md:ml-0 md:mt-10" >Entregue</TextStatus>
              </Status>
            </div>
          </Card>
          <Link onClick={()  => handleInvoce()} className={` ${orderDetail?.paid_at || orderDetail?.transactions?.length < 1 ? 'hidden' : ''} flex cursor-pointer items-center justify-between  px-5 py-4 text-white  mb-5`}>
            Clique aqui para acessar o link de pagamento! 
            <i className="uil uil-arrow-right text-white" />
          </Link>
          <div className="grid grid-cols-1 w-full gap-4 mb-10 md:grid-cols-2">
            <div>
            <p className="text-silver-1 mb-5 text-sm">Detalhes</p>
              <CardInfo
                  headerLeft={<i className="uil uil-user" />}
                  header={<span>Embaixador: {ambassador?.name}</span>}
                >
              </CardInfo>
              <CardInfo
                  headerLeft={<i className="uil uil-user" />}
                  header={<span>{customer?.email}</span>}
                  
                  >
              </CardInfo>
              <CardInfo
                  headerLeft={<i className="uil uil-map-marker" />}
                  header={<span>Endereço</span>}
              >
                <p>
                  {orderDetail?.delivery[0]?.address}, {orderDetail?.delivery[0]?.number}
                </p>
                <p>
                  {orderDetail?.delivery[0]?.district} - {orderDetail?.delivery[0]?.state}
                </p>
              </CardInfo>
              {orderDetail?.shippings[0]?.desired_delivery_at &&
                <CardInfo
                  headerLeft={<i className="uil uil-schedule" />}
                  header={<span>Evento: {moment(orderDetail?.shippings[0]?.desired_delivery_at).format("DD/MM/YYYY")}</span>}
                >
                </CardInfo>
              }
              <CardInfo
                headerLeft={<i className="uil uil-truck" />}
                header={<span>Entrega: {orderDetail?.shippings[0]?.shipping_method}</span>}
              >
                <p>
                {/* { parseInt(orderDetail?.shippings[0]?.shipping_price, 10) < 1 ? '' :  currency(parseInt(orderDetail?.shippings[0]?.shipping_price, 10) / 100, {
                      decimal: ',',
                      separator: '.',
                    })
                } */}
                </p>
                <p>
                  Previsão: {moment(orderDetail?.shippings[0]?.delivery_estimate).format("DD/MM/YYYY")}
                </p>
              </CardInfo>

            </div>
            <div>
              <p className="text-silver-1 mb-5 text-sm">Itens</p>

              { orderDetail?.items?.map( (item, index) =>
                <div key={index} className="shadow rounded-md mb-3 bg-white px-6">
                  <div className="flex py-5 -mx-1">
                    {/* <div className="px-1 rounded-md w-1/6">
                      {item?.featured_asset?.url ? (
                        <ImageBoss
                          uri={item?.product?.featured_asset?.url}
                          height={160}
                          width={100}
                          operation={"cover:contain"}
                        />
                      ) :
                      <div className="img rounded-md">
                        <img className="rounded-md" src={imageDefault} alt="Produto sem imagem" />
                      </div>
                      }
                    </div> */}
                    <div className="px-1 flex flex-1 justify-start flex-col items-between text-xs text-title">
                      <div className="flex-1 flex flex-col justify-between">
                        <Detail className="">{item?.quantity}x {item?.name}</Detail>
                        <p className="text-silver-1">
                          <br />
                          Preço unitário R$ {item?.subtotal}
                        </p>
                        
                      </div>
                      <br/>
                      <div className="flex flex-col justify-between items-start w-full">
                        <p className=" text-left">
                          Total item: R$ {item?.total ||  item.total_formatted}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="shadow rounded-md mb-3 bg-white px-6">
                  <div className="flex py-5 -mx-1">
                    <div className="px-1 flex flex-1 justify-start flex-col items-between text-xs text-title">
                      <div className="flex flex-col justify-between items-start w-full">
                      <p className="text-danger my-1 text-xs">
                       { orderDetail?.discount > 0 ? `- Desconto R$ ${VMasker.toMoney(orderDetail?.discount)}` : ''}
                      </p>
                        <p className=" text-left text-sm">
                          Total: R$ {orderDetail?.total_formatted}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
          </div>
      </Content>
      
    </Container>
  );
}

export default OrderDetail;
