/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import { Container, Content } from "../../components/Grid";
import { Title } from "../../components/Typograph";
import { useHistory } from "react-router-dom";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { Animate } from "../../components/Animate";

import { useLayout } from "../../contexts/layout";

// import { Container } from './styles';

const TermOfUse: React.FC = () => {
  const history = useHistory();
  const [term , setTerm] = useState(null);

  const layoutContext = useLayout();
  const { catalog, setCatalog } = layoutContext;


  const GET_TERM_OF_USER = gql`
  query {
    getPlatformTermsOfUse(id: 1){
      terms_of_use
    }
  }
`;

  const { data, loading } = useQuery(GET_TERM_OF_USER, {
    fetchPolicy: "cache-first"
  });

  useEffect(() => {
    if (data) {
      setTerm(data?.getPlatformTermsOfUse?.terms_of_use)
    }
  }, [data])

  useEffect(() => {
    setCatalog({ ...catalog, currentCollection: {name: 'Termos de uso'} });
  }, [])

  if (loading)
    return (
      <Animate>
        <Container>
          <Content>
            <br/>
            <br/>
            <Title>Carregando...</Title>
          </Content>
        </Container>
      </Animate>
    );

  return (
    <Container className="flex-1 px-40 justify-evenly" >

      <Content className="flex-1 relative items-center justify-center h-full pb-32 lg:pb-20">
        <div className="flex fixed  py-4 left-auto mt-3 lg:ml-4  text-title text-4xl ">
          <button
            type="button"
            onClick={() => {history.goBack(); setCatalog({ ...catalog, currentCollection: "" });
          }}
            className="focus:outline-none"
          >
            <i className="uil uil-arrow-left" />
          </button>
        </div>

        <div className="text-center py-10"><Title className="text-title min-w-full">Termos de Uso da Plataforma</Title></div>
        <div className="text-center py-8"><div dangerouslySetInnerHTML={{ __html: term ? term : <br/>}} className="min-w-full px-32 text-left text-title"></div></div>

      </Content>
    </Container>
  );
}

export default TermOfUse;
