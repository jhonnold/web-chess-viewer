import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

export const theme = {
    primaryColor: '#9FC0A2',
    backgroundColor: '#272a2c',
    surfaceColor: '#333538',
    surfaceColorHover: '#404246',
    secondaryColor: '#f5c276',
    tertiaryColor: '#d36d6d',
    defaultWhite: '#F2F5F3',
    textColor: '#aaaaaa',
    mainShadow: '0 4px 76px -15px rgba(0, 0, 0, 0.5)',
    lastMove: '#99d69e',
    boardDark: '#71828F',
    boardLight: '#c7c7c7',
    borderRadius: '8px',
    containerMax: 1800,
    standardMargin: 20,
};

export type AppThemeProps = {
    theme: typeof theme;
};

export default createGlobalStyle<AppThemeProps>`
${reset}

html {
    background-color: ${props => props.theme.backgroundColor};
    box-sizing: border-box;
    color-scheme: dark;
    color: ${props => props.theme.textColor};
    font-family: "Red Hat Text", sans-serif;
    font-weight: 300;
    scrollbar-color: ${props => props.theme.surfaceColorHover} ${props => props.theme.surfaceColor};
    scrollbar-width: thin;
}
`;
