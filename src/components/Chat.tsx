import * as React from 'react';
import styled from 'styled-components';
import { AppThemeProps } from '../assets/GlobalStyles';

const Aside = styled.aside<AppThemeProps>`
    grid-area: chat;

    max-height: ${props => props.height}px;
    scrollbar-width: thin;
    display: flex;
    flex-direction: column;
`;

const ChatArea = styled.div<AppThemeProps>`
    scrollbar-width: thin;
    box-sizing: border-box;
    background-color: ${props => props.theme.surfaceColor};
    border: 2px solid ${props => props.theme.surfaceColorHover};
    border-radius: ${props => props.theme.borderRadius};
    padding: 10px 15px;
    overflow-y: auto;
`;

const ChatInputContainer = styled.div<AppThemeProps>`
    display: flex;
    margin-top: 10px;
`;

const ChatInput = styled.input<AppThemeProps>`
    flex: 1;
    margin-right: 10px;
    font-family: 'Red Hat Text';
    color: ${props => props.theme.textColor};
    border: 2px solid ${props => props.theme.surfaceColorHover};
    background-color: ${props => props.theme.surfaceColor};
    border-radius: 4px;
`;

const ChatSendButton = styled.button<AppThemeProps>`
    color: ${props => props.theme.defaultWhite};
    background-color: ${props => props.theme.primaryColor}A0;
    border: none;
    font-weight: 700;
    font-size: 16px;
    padding: 5px 15px;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        background-color: ${props => props.theme.primaryColor}80; 
    }
`;

const Message = styled.p<AppThemeProps>`
    margin-top: 10px;
    line-height: 1.1;

    strong {
        color: ${props => props.theme.secondaryColor};
        font-weight: 700;
        margin-right: 2px;
    }
`;

export interface ChatBoxProps {
    chat: string[];
    height: number;
    onNickname: (s: string) => void;
    onMessage: (s: string) => void;
}

const tlcvMatcher = /\[(.*)\]\s+-\s+\((.*)\)\s+(.*)/i;

function ChatBox(props: ChatBoxProps): React.ReactElement {
    const { chat, height, onMessage } = props;

    const [msg, setMsg] = React.useState<string>('');

    const modifiedChat = chat.map(msg => {
        if (msg.startsWith('[tlcv.net')) {
            const res = tlcvMatcher.exec(msg);
            if (res) return `[${res[2]}] - ${res[3]}`;
        }

        return msg;
    });

    return (
        <Aside height={height}>
            <ChatArea>
                {modifiedChat.map(msg => {
                    const split = msg.split('-');
                    const name = split.shift();
                    const rest = split.join('-');

                    return (
                        <Message>
                            <strong>{name}</strong>
                            {rest}
                        </Message>
                    );
                })}
            </ChatArea>
            <ChatInputContainer>
                <ChatInput value={msg} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMsg(e.target.value)} />
                <ChatSendButton onClick={() => {
                    if (msg) {
                        onMessage(msg);
                        setMsg('');
                    }
                }}>Send</ChatSendButton>
            </ChatInputContainer>
        </Aside>
    );
}

export default ChatBox;
