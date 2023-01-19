/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { HeaderProps } from "./types";
import {
  Container,
  Content,
  Col,
  Avatar,
  Identity,
  BrandImage,
  AvatarDefault
} from "./style";
import VMasker from "vanilla-masker";
import defaultBrandImg1x from "./defaultBrandImg@1x.png";
import defaultBrandImg2x from "./defaultBrandImg@2x.png";
import defaultBrandImg3x from "./defaultBrandImg@3x.png";

import { Search } from "../Search";
import { IconCart } from "../Icons/Cart";
import { IconUser } from "../Icons/User";
import { Modal } from "../Modal";
import { Link } from "react-router-dom";
import { ButtonContact, ButtonClear } from "../Buttons";
import { useLayout } from "../../contexts/layout";
import { ROUTE_TENANT_HOME, ROUTE_TENANT_ORDERS } from "../../constants";
import { useHistory } from "react-router-dom";

const Header: React.FC<HeaderProps> = ({ ...props }) => {
  const layoutContext = useLayout();
  const [showContact, setShowContact] = useState<boolean>(false);
  const history = useHistory();
  const [firstName, setFirstName] = useState([]);

  const handleClickProfileContact = () => {
    setShowContact(true);
  };

  const handleCart = () => {
    if (layoutContext?.setCartOpen) {
      layoutContext?.setCartOpen(true);
    }
  };

  const handleUser = () => {
    if (layoutContext?.setFormRegisterOpen) {
      if (layoutContext?.customer) {
        history.push(`${ ROUTE_TENANT_ORDERS()}`)
      }else{
        layoutContext?.setFormRegisterOpen(!layoutContext?.formRegisterOpen);
        layoutContext?.setFormRegisterStep(1)
      }
    }
  };

  const linkPhone = () => {
    window.open(`tel:${layoutContext?.ambassador?.phone}`, "_blank");
  };

  const linkZap = () => {
    window.open(
      `https://api.whatsapp.com/send?phone=+55${layoutContext?.ambassador?.phone}`,
      "_blank"
    );
  };

  const linkMail = () => {
    window.location.href = `mailto:${layoutContext?.ambassador?.email}`;
  };
  const renderModal = () => {
    if (showContact) {
      return (
        <Modal onClose={() => setShowContact(false)}>
          <div className="flex flex-col jstify-center items-center w-full">
            {layoutContext?.ambassador?.picture_url ? (
              <Avatar src={layoutContext?.ambassador?.picture_url} size={80} />
            ) : (
              <AvatarDefault>
                <IconUser cursor="pointer" bulletFill="#FFF" />
              </AvatarDefault>
            )}
            <h3 className="text-xl mt-3 text-primary mb-2">
              {layoutContext?.ambassador?.name}
            </h3>
            <h2 className="text-xl text-center font-bold mb-5 text-title">
              {layoutContext?.tenant?.name} {layoutContext?.tenant?.name === 'Wine Eventos' ? 'Embaixador' :  'Lover'}
            </h2>
            {layoutContext?.ambassador?.phone && (
              <>
                <ButtonContact onClick={linkPhone} icon="phone-alt">
                  {VMasker.toPattern(
                    layoutContext?.ambassador?.phone,
                    "(99) 99999-9999"
                  )}
                </ButtonContact>
                <ButtonContact onClick={linkZap} icon="whatsapp">
                  {VMasker.toPattern(
                    layoutContext?.ambassador?.phone,
                    "(99) 99999-9999"
                  )}
                </ButtonContact>
              </>
            )}

            <ButtonContact onClick={linkMail} icon="envelope-alt">
              {layoutContext?.ambassador?.email}
            </ButtonContact>
          </div>
        </Modal>
      );
    }
    return null;
  };

  useEffect(() => {
    if (layoutContext?.ambassador?.name) {
      setFirstName(layoutContext?.ambassador?.name.split(' '))
    }
  }, [layoutContext?.ambassador?.name]);

  return (
    <>
      {renderModal()}
      <Container>
        <Content>
          <Col className="overflow-hidden">
            <button
              onClick={handleClickProfileContact}
              className="flex focus:outline-none flex-col items-center  justify-center md:flex-row max-w-full"
            >
              {layoutContext?.ambassador?.picture_url ? (
                <Avatar
                  className="sm:mr-6"
                  src={layoutContext?.ambassador?.picture_url}
                  alt={layoutContext?.ambassador?.name}
                />
              ) : (
                <AvatarDefault>
                  <IconUser cursor="pointer" bulletFill="#FFF" />
                </AvatarDefault>
              )}
              <Identity className="text-left max-w-full overflow-hidden">
                <h1 className="text-xs md:text-lg text-primary truncate w-full">
                  {firstName[0]}
                </h1>
                <span className="text-silver-1 hidden md:block text-sm">
                  Entrar em contato &#9656;
                </span>
              </Identity>
            </button>
          </Col>
          <Col justify="center">
            <Link to={ROUTE_TENANT_HOME} className="df">
              {props.brandUri ? (
                <BrandImage className=" w-full md:w-1/2">
                  <img className="h-12 ml-4 md:m-0" src={props.brandUri} alt="My Brand" />
                </BrandImage>
              ) : (
                <BrandImage>
                  <source
                    media="(max-width: 425px)"
                    srcSet={defaultBrandImg1x}
                  />
                  <source
                    media="(min-width: 800px)"
                    srcSet={defaultBrandImg3x}
                  />
                  <img src={defaultBrandImg2x} alt="Default Brand" />
                </BrandImage>
              )}
            </Link>
          </Col>
          <Col className="overflow-hiddens" justify="flex-end">
            <Search />
            <IconCart
              notification={layoutContext.cartItems.length > 0}
              onClick={handleCart}
              cursor="pointer"
              fill="#000"
              bulletFill="#FFF"
            />
            <div onClick={() => handleUser()} className="flex flex-col md:flex-row pl-3 items-center justify-center text-2xl text-title cursor-pointer">
              <ButtonClear className="h-10 md:h-full" onClick={() => handleUser()} >
                <i className="uil uil-user-circle mr-1 text-title text-3xl" />
              </ButtonClear>
              <div className="text-xs md:text-sm">
                {layoutContext?.customer ? layoutContext?.customer.name : 'Login'}
              </div>
            </div>
          </Col>
        </Content>
      </Container>
    </>
  );
};

export { Header };
