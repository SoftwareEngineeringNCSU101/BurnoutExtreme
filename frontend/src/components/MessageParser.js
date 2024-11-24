class MessageParser {
    constructor(actionProvider, state) {
        this.actionProvider = actionProvider;
        this.state = state;
    }
  
    parse(message) {
        
            
            this.handleGeneralMessage(message);
        
    }
  
    async handleGeneralMessage(message) {
        const response = await this.actionProvider.fetchResponse(message);
        this.actionProvider.handleResponse(response);
    }
  }
  
  export default MessageParser;
  