import React from 'react';

import RouterProvider from './controllers/RouterController';
import ThemeController from './controllers/ThemeController';

const App: React.FC = () =>(
    <ThemeController>
        <RouterProvider />
    </ThemeController>
);  

export default App;
