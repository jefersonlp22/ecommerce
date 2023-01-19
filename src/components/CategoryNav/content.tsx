/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useLayout } from "../../contexts/layout";
import { Content } from "../Grid";
import { NavContainer, NavContent } from "./style";
import { ROUTE_TENANT_PRODUCTS } from "../../constants";
import { Collection } from "../../ModelTyping/Collection";

export const CategoryNavContent: FC = ({ ...props }) => {
  const layoutContext = useLayout();
  const { catalog, setCatalog } = layoutContext;
  const history = useHistory();
  const [rootCollections, setRootCollections] = useState([]);

  useEffect(() => {
    if (catalog?.collections?.length) {
      setRootCollections([
        { name: "Todas as categorias", id: false },
        ...catalog?.collections
      ]);
    }
  }, [catalog]);

  const handleClose = () => {
    if (layoutContext.setMenuOpen) {
      layoutContext?.setMenuOpen(false);
    }
  };

  const handleClick = (collection: Collection) => {
    if (collection.id) {
      setCatalog({ ...catalog, currentCollection: collection });
      history.push(`${ROUTE_TENANT_PRODUCTS()}?tipo=${collection?.id}`);
      handleClose();
    } else {
      setCatalog({ ...catalog, currentCollection: "" });
      history.push(`${ROUTE_TENANT_PRODUCTS()}`);
      handleClose();
    }
  };

  const renderItems = () => {
    if (catalog?.collections?.length) {
      return rootCollections.map((collection: any, index: any) => (
        <li key={index} className="my-1 sm:w-1/3 lg:w-1/4">
          <button
            type="button"
            onClick={() => handleClick(collection)}
            className="opacity-75 hover:opacity-100"
          >
            {collection?.name}
          </button>
        </li>
      ));
    }
    return null;
  };

  return (
    <>
      <NavContainer
        className="absolute w-full transition-all duration-300 overflow-hidden max-h-0 z-20"
        open={!!layoutContext?.menuOpen}
      >
        <NavContent className="w-full flex flex-col text-white py-2 overflow-hidden">
          <Content className="h-full w-full flex flex-1">
            <ul className="relative flex-1 flex flex-col flex-wrap justify-start items-start text-lg font-medium content-start last:mb-0">
              {renderItems()}
              <li className="my-1 sm:w-1/3 lg:w-1/4 text-right absolute right-0 bottom-0 text-sm">
                <button
                  onClick={handleClose}
                  className="opacity-75 hover:opacity-100 focus:outline-none inline-flex items-center"
                >
                  <span className="hidden sm:block">Ocultar</span>
                  <i className="uil uil-angle-up text-2xl"></i>
                </button>
              </li>
            </ul>
          </Content>
        </NavContent>
      </NavContainer>
      {layoutContext.menuOpen && (
        <div className="absolute h-full w-full opacity-50 z-10">
          <div
            onClick={e => {
              e.preventDefault();
              handleClose();
            }}
            className="h-full w-full bg-black animate__animated animate__fadeIn animate__faster"
          />
        </div>
      )}
    </>
  );
};
