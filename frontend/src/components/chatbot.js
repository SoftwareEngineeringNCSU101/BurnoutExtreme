import React, {useState} from 'react';
import Chatbot from 'react-chatbot-kit';
import MessageParser from './MessageParser.js';
import ActionProvider from './ActionProvider.js';
import 'react-chatbot-kit/build/main.css'; 
import { Card, Button, CardContent} from '@mui/material'; 
import ChatIcon from '@mui/icons-material/Chat';
import "./ChatbotComponent.css"
import { createChatBotMessage } from 'react-chatbot-kit';

const ChatbotComponent = () => {
    const [isOpen, setIsOpen] = useState(false); 

    const toggleChatbot = () => {
        setIsOpen(!isOpen); 
    };

    const config = {
        botName: "Personal Fitness Assistant",
        initialMessages: [createChatBotMessage(`Welcome to your personal AI fitness  advisor!`)],
        customComponents: {
            botAvatar: (props) => <div className='A' >A</div>
        },
    }

    return (
        <div style={{ position: 'fixed', bottom: '40px', right: '40px', zIndex: 1000 }}>
            
            <Button 
                onClick={toggleChatbot} 
                variant="contained" 
                style={{
                    backgroundColor: 'orange', 
                    color: 'white',
                    borderRadius: '50%',
                    width: '60px',
                    height: '60px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <ChatIcon style={{ fontSize: '30px', color: 'white' }} />
            </Button>
                {isOpen && (
                    <Card 
                        style={{
                            borderRadius: '10px', 
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)', 
                            marginTop: '10px', 
                            overflow: 'hidden' 
                        }}
                    >
                    <CardContent>
                        <Chatbot
                            config={config}
                            messageParser={MessageParser}
                            actionProvider={ActionProvider}
                        />
                    </CardContent>
                </Card>
                    
                )}
        </div>
    );
};

export default ChatbotComponent;