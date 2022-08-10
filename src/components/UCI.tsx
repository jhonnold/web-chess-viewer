import * as React from 'react';
import styled from 'styled-components';
import { AppThemeProps } from '../assets/GlobalStyles';
import { WebSocketPlayer } from '../Content';

const UCICardAbove = styled.div<AppThemeProps>`
    display: flex;
    justify-content: space-between;
    align-items: center;

    h2 {
        font-size: 20px;
        font-weight: bold;
    }
`;

const Time = styled.div<AppThemeProps>`
    padding: 10px;
    color: ${props => props.theme.defaultWhite};
    font-size: 20px;
    font-weight: bold;
    letter-spacing: 2.5px;
    position: relative;
    margin: 5px 0;
    opacity: ${props => props.active ? 1 : 0.4};

    &::before {
        content: '';
        top: 0;
        left: 0;
        position: absolute;
        width: 100%;
        height: 100%;
        background: ${props => props.active ? props.theme.primaryColor : props.theme.defaultWhite};
        opacity: ${props => props.active ? 0.5 : 0.1};
        border-radius: 4px;
        z-index: -1;
    }
`;

const UCICard = styled.div<AppThemeProps>`
    background-color: ${props => props.theme.surfaceColor};
    border: 2px solid ${props => props.theme.surfaceColorHover};
    border-radius: ${props => props.theme.borderRadius};
    padding: 10px;

    div {
        display: flex;
    }
`;

const UCIPVWrapper = styled.div<AppThemeProps>`
    font-size: 14px;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    margin-top: 10px;
    height: 64px;
    overflow: hidden;

    strong {
        color: ${props => props.theme.secondaryColor};
        font-weight: 700;
    }

    p {
        flex: 0 1 25%;
        line-height: 1.5;
        white-space: nowrap;
    }
`;

const UCIDataWrapper = styled.div<AppThemeProps>`
    flex: 1;
    border-right: 1px solid ${props => props.theme.surfaceColorHover};
    padding: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;

    &:last-of-type {
        border-right: none;
    }

    label {
        font-size: 12px;
    }

    p {
        color: ${props => props.theme.defaultWhite};
        font-weight: bold;
        line-height: 1.5;
    }
`;

interface UCIDataProps {
    label: string;
    value: number | string;
}

function msToString(ms: number): string {
    const s = Math.floor((ms / 1000) % 60);
    const m = Math.floor(ms / 1000 / 60);
  
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

function displayString(value: number): string {
    return `${(value / 1e7).toFixed(2)}M`;
}

function UCIData({ label, value }: UCIDataProps): React.ReactElement {
    return (
        <UCIDataWrapper>
            <label>{label}</label>
            <p>{value}</p>
        </UCIDataWrapper>
    );
}

function UCIPV(props: { pv: string[]; pvMoveNumber: number; color: 'w' | 'b' }): React.ReactElement {
    const { pv, pvMoveNumber, color } = props;

    const moves = color === 'w' ? [...pv] : ['...', ...pv];
    let combined: string[] = [];
    for (let i = 0; i < moves.length; i += 2)
        combined[Math.floor(i / 2)] = `${moves[i]} ${moves[i + 1] || ''}`;

    return (
        <UCIPVWrapper>
            {combined.map((move, idx) => (
                <p>
                    <strong>{pvMoveNumber + idx}.</strong>
                    {' '}{move}
                </p>
            ))}
        </UCIPVWrapper>
    );
}

function UCI(props: WebSocketPlayer & { color: 'w' | 'b', onMove: boolean }): React.ReactElement {
    const { name, score, depth, nodes, usedTime, pv, pvMoveNumber, color, onMove, startTime, clockTime } = props;
    const nps = (1e4 * nodes) / usedTime;

    const counter = React.useRef<NodeJS.Timeout>();
    const [now, setNow] = React.useState<number>(new Date().getTime());

    React.useEffect(() => {
        setNow(new Date().getTime());

        if (onMove && !counter.current)
            counter.current = setInterval(() => setNow(new Date().getTime()), 1000);
        else {
            clearInterval(counter.current);
            counter.current = undefined;
        }

        return () => clearInterval(counter.current);
    }, [onMove]);

    const used = now - startTime;
    const time = Math.max(0, clockTime - used);

    return (
        <div>
            <UCICardAbove>
                <h2>{name}</h2>
                <Time active={onMove}>{msToString(time)}</Time>
            </UCICardAbove>
            <UCICard>
                <div>
                    <UCIData label="Score" value={score.toFixed(2)} />
                    <UCIData label="Depth" value={depth} />
                    <UCIData label="Nodes" value={displayString(nodes)} />
                    <UCIData label="NPS" value={displayString(nps)} />
                </div>
                <UCIPV pv={pv} pvMoveNumber={pvMoveNumber} color={color} />
            </UCICard>
        </div>
    );
}

export default UCI;
