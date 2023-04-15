document.addEventListener('DOMContentLoaded', () => {
    const inputMessage = document.getElementById('input-message');
    const sendButton = document.getElementById('send-button');
    const chatWindow = document.getElementById('chat-window');
  
    sendButton.addEventListener('click', () => {
      const message = inputMessage.value;
      if (!message) return;
  
      appendMessage(message, 'user');
  
      fetch('/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
      })
        .then(response => response.json())
        .then(data => {
          appendMessage(data.reply, 'ai');
        })
        .catch(error => {
          console.error('Error:', error);
        });
  
      inputMessage.value = '';
    });
  
    function appendMessage(message, sender) {
      const messageDiv = document.createElement('div');
      messageDiv.className = sender === 'user' ? 'user-message' : 'ai-message';
      messageDiv.textContent = message;
      chatWindow.appendChild(messageDiv);
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }
  });
  