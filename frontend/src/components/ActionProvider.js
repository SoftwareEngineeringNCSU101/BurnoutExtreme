class ActionProvider {
    constructor(createChatBotMessage, setState) {
      this.createChatBotMessage = createChatBotMessage;
      this.setState = setState;
    }
  
    async fetchResponse(message) {
      try {
        const res = await fetch("/chatbot", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ question: message }),
        });
  
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
  
        const data = await res.json();
        return data.answer; 
      } catch (error) {
        console.error("Error fetching chatbot response:", error);
        return "An error occurred while fetching the response."; 
      }
    }
  
    async handleResponse(response) {
        const message = this.createChatBotMessage(response);
        this.setState((prev) => ({
            ...prev,
            messages: [...prev.messages, message],
        }));
    }
    }
  
  export default ActionProvider;