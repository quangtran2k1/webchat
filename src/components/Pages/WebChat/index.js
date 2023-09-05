import { Alert, Button, Col, Form, Input, Row } from 'antd';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import Sidebar from '../../Layout/Sidebar';
import Header from '../../Layout/Header';
import styled from 'styled-components';
import { SendOutlined } from '@ant-design/icons';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import Message from '../../Layout/Message';
import { AppContext } from '../../../Context/AppProvider';
import { addDocument } from '../../../firebase/services';
import { AuthContext } from '../../../Context/AuthProvider';
import useFirestore from '../../../hooks/useFirestore';

const WrapperStyled = styled.div`
    height: 100vh;

    .ant-alert-info {
        background-color: transparent;
        border: 1px solid transparent;
        margin: auto;
    }

    .ant-alert-message {
        font-size: 24px;
        font-weight: bold;
    }
`;
const ContentStyled = styled.div`
    height: calc(100vh - 86px);
    display: flex;
    flex-direction: column;
    padding: 11px;
    justify-content: flex-end;
`;
const FormStyled = styled(Form)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2px 2px 2px 0;
    border: 1px solid #c99fbb;
    border-radius: 10px;

    .ant-form-item {
        flex: 1;
        margin-bottom: 0;
    }
`;
const MessageListStyled = styled.div`
    max-height: 100%;
    overflow-y: auto;
`;

export default function WebChat() {
    const { selectedGroup, selectedFriend } = useContext(AppContext);
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef(null);
    const messageListRef = useRef(null);
    const {
        user: { uid, displayName, photoURL },
    } = useContext(AuthContext);

    const [form] = Form.useForm();

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleOnSubmit = () => {
        addDocument('messages', {
            text: inputValue,
            uid,
            photoURL,
            roomId: selectedGroup.id,
            displayName,
        });

        form.resetFields(['message']);
        if (inputRef?.current) {
            setTimeout(() => {
                inputRef.current.focus();
            });
        }
    };

    const conditions = useMemo(
        () => ({
            fieldName: 'roomId',
            operator: '==',
            compareValues: selectedGroup.id,
        }),
        [selectedGroup.id],
    );

    const messages = useFirestore('messages', conditions);
    useEffect(() => {
        // scroll to bottom after message changed
        if (messageListRef?.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight + 50;
        }
    }, [messages]);

    return (
        <WrapperStyled>
            <Row>
                <Col span={4}>
                    <Sidebar />
                </Col>
                {selectedGroup.id ? (
                    <Col span={20}>
                        <Header />
                        <ContentStyled>
                            <MessageListStyled ref={messageListRef}>
                                {messages.map((message) => (
                                    <Message
                                        key={message.id}
                                        text={message.text}
                                        photoURL={message.photoURL}
                                        displayName={message.displayName}
                                        createdAt={message.createdAt}
                                    />
                                ))}
                            </MessageListStyled>
                            <FormStyled form={form}>
                                <Form.Item name="message">
                                    <Input
                                        ref={inputRef}
                                        onChange={handleInputChange}
                                        onPressEnter={handleOnSubmit}
                                        placeholder="Aa"
                                        bordered={false}
                                        autoComplete="off"
                                    />
                                </Form.Item>
                                <Tippy content="Gửi">
                                    <Button icon={<SendOutlined />} type="text" onClick={handleOnSubmit}></Button>
                                </Tippy>
                            </FormStyled>
                        </ContentStyled>
                    </Col>
                ) : (
                    <Alert message="Hãy chọn một đoạn chat hoặc bắt đầu cuộc trò chuyện mới" />
                )}
            </Row>
        </WrapperStyled>
    );
}
