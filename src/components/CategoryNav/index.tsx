/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Props } from "./types";
import { Content, Container } from "../Grid";
import { useLayout } from "../../contexts/layout";
// import { Container, Content } from './style';

const CategoryNav: React.FC<Props> = ({ ...props }) => {
  const layoutContext = useLayout();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // if(!layoutContext.menuSelected) {
    // const selected = layoutContext?.menuItems?.find(
    //   item => item.id === layoutContext.menuSelected
    // );
    setTitle(
      layoutContext?.catalog?.currentCollection
        ? layoutContext?.catalog?.currentCollection.name
        : "Categorias"
    );
    // }
  }, [layoutContext]);

  useEffect(() => {
    setLoading(true);
    if (layoutContext?.catalog?.collections) {
      setLoading(false);
    }
  }, [layoutContext?.catalog?.collections]);

  const handleOpen = () => {
    if (layoutContext.setMenuOpen) {
      layoutContext?.setMenuOpen(!layoutContext.menuOpen);
    }
  };

  return (
    <Container className="bg-primary text-white" style={{ boxShadow: `0 2px 4px 0 rgb(0 0 0 / 20%)`}}>
      <Content>
        <ul className="flex py-3">
          <li className="mr-2 flex items-center">
            <Link to="/" className="focus:outline-none">
              Home <i className="uil uil-angle-right-b" />
            </Link>
          </li>
          {loading && <li className="mr-2 flex items-center">Carregando...</li>}
          {!loading && (
            <li className="mr-2 flex items-center">
              <button
                onClick={handleOpen}
                className="focus:outline-none inline-flex items-center"
              >
                {title}
                <i
                  className={`uil uil-angle-down text-2xl transition-all duration-300 transform ${
                    layoutContext?.menuOpen ? "-rotate-180" : ""
                  }`}
                />
              </button>
            </li>
          )}
        </ul>
      </Content>
    </Container>
  );
};

export { CategoryNav };
