/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Container, Content, Line } from "../../components/Grid";
import { Title } from "../../components/Typograph";
import { Animate } from "../../components/Animate";
import { useLayout } from "../../contexts/layout";

export default () => {
  const layoutContext = useLayout();

  useEffect(() => {
    setMenuSelected("categories");
    return () => {
      setMenuSelected(undefined);
    };
  }, []);

  const setMenuSelected = (value?: string) => {
    if (layoutContext?.setMenuSelected) {
      layoutContext.setMenuSelected(value);
    }
  };

  return (
    <Animate>
      <Container>
        <Content>
          <Line />
          <Title>Categorias</Title>
        </Content>
      </Container>
    </Animate>
  );
};
