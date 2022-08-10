import * as React from 'react';
import { Helmet } from 'react-helmet';
import Chessboard from 'chessboardjsx';
import styled from 'styled-components';
import { AppThemeProps, theme } from './assets/GlobalStyles';
import UCI from './components/UCI';
import { SocketContext } from './context/socket';
import { Move } from 'chess.js';
import ChatBox from './components/Chat';

export interface WebSocketPlayer {
    clockTime: number;
    depth: number;
    lastMove?: Move;
    name: string;
    nodes: number;
    pv: string[];
    pvMoveNumber: number;
    score: number;
    startTime: number;
    usedTime: number;
}

export interface WebSocketGame {
    fen: string;
    moveNumber: number;
    name: string;
    site: string;
    stm: 'w' | 'b';
    white: WebSocketPlayer;
    black: WebSocketPlayer;
}

export interface WebSocketData {
    chat: string[];
    spectators: string[];
    browserCount: number;
    menu: { [key: string]: string };
    game: WebSocketGame;
}

const Container = styled.div<AppThemeProps>`
    width: 100%;
    max-width: ${props => props.theme.containerMax}px;
    margin: 0 auto;
`;

const Main = styled.main<AppThemeProps>`
    display: grid;
    grid-template-columns: 400px minmax(auto, 100vh) 400px;
    grid-template-areas: 'chat board uci' '. fen .';
    grid-gap: ${props => props.theme.standardMargin}px;
    margin: ${props => props.theme.standardMargin}px;
`;

const BoardWrapper = styled.div<AppThemeProps>`
    overflow: hidden;
    grid-area: board;
    border-radius: ${props => props.theme.borderRadius};
    position: relative;
`;

const UCIContainer = styled.div<AppThemeProps>`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

function useWindowSize(): { width: number, height: number } {
    const [windowSize, setWindowSize] = React.useState<{ width: number, height: number }>({ width: 0, height: 0});

    React.useEffect(() => {
        function handleResize() {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        }

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }), [];

    return windowSize;
}

function Content(): React.ReactElement | null {
    const socket = React.useContext(SocketContext);
    const [game, setGame] = React.useState<WebSocketGame>();
    const [chat, setChat] = React.useState<string[]>([]);
    const size = useWindowSize();

    React.useEffect(() => {
        socket.on('connect', () => socket.emit('join', { port: 16092, user: 'jay' }));

        socket.on('update', (data: WebSocketData) => {
            setGame(data.game);
            setChat(data.chat);
        });
    }, [socket]);

    if (!game) return null;

    const { fen, site, white, black, stm } = game;

    const lastMove = stm === 'w' ? black.lastMove : white.lastMove;
    const fromSquare = lastMove?.from || '';
    const toSquare = lastMove?.to || '';

    const width = Math.min(size.height, Math.min(920, size.width - 880));

    return (
        <Container>
            <Helmet>
                <title>
                    {white.name} vs {black.name} ({site})
                </title>
            </Helmet>
            <Main>
                <ChatBox chat={chat} onNickname={_ => _} onMessage={msg => socket.emit('chat', msg)} height={width} />
                <BoardWrapper>
                    <Chessboard
                        position={fen}
                        lightSquareStyle={{ backgroundColor: theme.boardLight }}
                        darkSquareStyle={{ backgroundColor: theme.boardDark }}
                        draggable={false}
                        showNotation={false}
                        squareStyles={{
                            [fromSquare]: { backgroundColor: `${theme.lastMove}80` },
                            [toSquare]: { backgroundColor: `${theme.lastMove}80` },
                        }}
                        width={width}
                    />
                </BoardWrapper>
                <UCIContainer>
                    <UCI {...black} color="b" onMove={stm === 'b'} />
                    <UCI {...white} color="w" onMove={stm === 'w'} />
                </UCIContainer>
            </Main>
        </Container>
    );
}

export default Content;
