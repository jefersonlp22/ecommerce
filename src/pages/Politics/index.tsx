/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import { Container, Content } from "../../components/Grid";
import { Title } from "../../components/Typograph";
import { useHistory } from "react-router-dom";
import { useLayout } from "../../contexts/layout";

// import { Container } from './styles';

const Politics: React.FC = () => {
  const history = useHistory();

  const layoutContext = useLayout();
  const { catalog, setCatalog, tenant} = layoutContext;

  useEffect(() => {
    setCatalog({ ...catalog, currentCollection: {name: 'Politica de privacidade'} });
  }, [])

  return (
    <Container className="flex-1 px-40 justify-evenly" >

      <Content className="flex-1 relative items-center justify-center h-full pb-32 lg:pb-20">
        <div className="flex  py-4 fixed  left-auto  mt-3 lg:ml-4  text-title text-4xl ">
          <button
            type="button"
            onClick={() => {history.goBack(); setCatalog({ ...catalog, currentCollection: "" })}}
            className="focus:outline-none"
          >
            <i className="uil uil-arrow-left" />
          </button>
        </div>

        <div className="text-center py-10"><Title className="text-title min-w-full">Política de Privacidade</Title></div>
        <div className="text-center py-8"><div dangerouslySetInnerHTML={{ __html: tenant?.term_of_use ? tenant?.term_of_use : <br/>}} className="min-w-full px-32 text-left text-title"></div></div>

      </Content>
    </Container>
  );
}

export default Politics;
