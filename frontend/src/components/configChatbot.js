import { createChatBotMessage } from 'react-chatbot-kit';

const config = {
    botName: "Personal Fitness Assistant",
    initialMessages: [createChatBotMessage(`Welcome to your personal AI fitness  advisor!`)],
    customComponents: {
        botAvatar: (props) => <div className='A' >A</div>
    },
}
export default config;