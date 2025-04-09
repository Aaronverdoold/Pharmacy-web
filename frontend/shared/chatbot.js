document.addEventListener('DOMContentLoaded', function() {
  const chatbotToggle = document.querySelector('.chatbot-toggle');
  const chatbotContent = document.querySelector('.chatbot-content');
  const closeChatbot = document.querySelector('.close-chatbot');
  const chatbotInput = document.querySelector('.chatbot-input input');
  const sendButton = document.querySelector('.chatbot-input button');
  const messagesContainer = document.querySelector('.chatbot-messages');

  // Create typing indicator
  const typingIndicator = document.createElement('div');
  typingIndicator.className = 'typing-indicator';
  typingIndicator.innerHTML = '<span class="text">Chatbot is typing</span><span></span><span></span><span></span>';
  messagesContainer.appendChild(typingIndicator);

  // Toggle chatbot panel
  chatbotToggle.addEventListener('click', function() {
    chatbotContent.classList.add('active');
    // Add welcome message when opening chat
    if (messagesContainer.children.length === 1) { // Only typing indicator
      setTimeout(() => {
        addMessage('Hello! How can I help you today?', 'bot');
      }, 500);
    }
  });

  // Close chatbot panel
  closeChatbot.addEventListener('click', function() {
    chatbotContent.classList.remove('active');
  });

  // Close chatbot when clicking outside
  document.addEventListener('click', function(event) {
    if (!chatbotContent.contains(event.target) && 
        !chatbotToggle.contains(event.target) && 
        chatbotContent.classList.contains('active')) {
      chatbotContent.classList.remove('active');
    }
  });

  // Handle sending messages
  function sendMessage() {
    const message = chatbotInput.value.trim();
    if (message) {
      // Add user message
      addMessage(message, 'user');
      
      // Clear input
      chatbotInput.value = '';
      
      // Show typing indicator
      typingIndicator.classList.add('active');
      
      // Simulate bot response (you can replace this with actual API call)
      setTimeout(() => {
        typingIndicator.classList.remove('active');
        addMessage('Thank you for your message. How can I help you today?', 'bot');
      }, 1500);
    }
  }

  // Add message to chat
  function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.textContent = text;
    
    // Remove typing indicator before adding new message
    if (typingIndicator.classList.contains('active')) {
      typingIndicator.classList.remove('active');
    }
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Send message on button click
  sendButton.addEventListener('click', sendMessage);

  // Send message on Enter key
  chatbotInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
}); 