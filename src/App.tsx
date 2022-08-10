import * as React from 'react';
import { ThemeProvider } from 'styled-components';
import Content from './Content';
import { SocketContext, socket } from './context/socket';
import GlobalStyles, { theme } from './assets/GlobalStyles';

function App(): React.ReactElement {
    return (
        <SocketContext.Provider value={socket}>
            <ThemeProvider theme={theme}>
                <GlobalStyles />
                <Content />
            </ThemeProvider>
        </SocketContext.Provider>
    );
}

export default App;
