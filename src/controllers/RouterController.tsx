import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';

import { isAuthenticated } from './AuthController';
import LayoutController from './LayoutController';
import Pages from './PagesController';
import Page404 from '../pages/404';
import { ROUTE_TENANT, PARAMS_TENANT_ID } from '../constants';
import client from '../services/apollo';

interface RouteProps {
  /**
   * Component thas represents a page will render in router
   */
  component: React.ComponentType<any>;
  /**
   * Name of layout thats will render
   */
  layout: string;
  /**
   * Any other props will be passed
   */
  rest?: any;
  /**
   * Url Page
   */
  path?: string;
  /**
   * Determines whether the page is available
   */
  active?: boolean;
  /**
   * When true, will only match if the path matches the location.pathname exactly.
   */
  exact?: boolean;
  /**
   * Determines the type of access
   */
  type?: string;
}

/**
 *
 * @param conponent Component thas represents a page will render in router
 * @param layout Name of layout thats will render
 * @param rest any other props will be passed
 */
const PublicRoute: React.FC<RouteProps> = ({ component: Component, layout, ...rest }) =>
  <Route
    {...rest}
    render={({ ...props }) =>
      <Component {...props} />
    }
  />;

const PrivateRoute: React.FC<RouteProps> = ({ component: Component, layout, ...rest }) =>
  <Route
    {...rest}
    render={({ ...props }) => isAuthenticated() ? (
      <Component {...props} />
    ) :
      <Redirect to={{ pathname: "/", state: { from: props.location } }} />
    }
  />;

const RouterProvider: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path={ROUTE_TENANT()} children={({ match }) => {
          if (!match?.params[PARAMS_TENANT_ID]) {
            return null;
          }
          return (
            <BrowserRouter basename={ROUTE_TENANT(match?.params[PARAMS_TENANT_ID])}>
              <ApolloProvider client={client(match?.params[PARAMS_TENANT_ID])}>
                <LayoutController name="home" external={match?.params[PARAMS_TENANT_ID]}>
                  <Switch>
                    {
                      Pages.map((item, index) => {
                        if (item.active) {
                          return item.type === 'private' ? (
                            <PrivateRoute key={`privateRoute${index}`} {...item} />
                          ) : (
                              <PublicRoute key={`publicRoute${index}`} {...item} />
                            )
                        }
                        return null;
                      })
                    }
                    <Route path="*" component={() => <Page404 />} />
                  </Switch>
                </LayoutController>
              </ApolloProvider>
            </BrowserRouter>
          )
        }} />
      </Switch>
    </BrowserRouter >
  )
};

export default RouterProvider;
