import React from 'react';
import { ThemeProvider } from 'styled-components';
import Themes from '../stylesheets/themes';
export default ({...props}) =>{
    return (
        <ThemeProvider theme={Themes['main']}>
            {props.children}
        </ThemeProvider>
    );
}
    
