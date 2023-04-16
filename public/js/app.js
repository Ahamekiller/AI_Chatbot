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

    const iconImg = document.createElement('img');
    iconImg.src = sender === 'user' ? 'img/user-icon.png' : 'img/ai-icon.png';
    iconImg.alt = sender === 'user' ? 'User Icon' : 'AI Icon';
    iconImg.className = sender === 'user' ? 'user-icon' : 'ai-icon';

    const messageText = document.createElement('pre');
    messageText.textContent = message;

    messageDiv.appendChild(iconImg);
    messageDiv.appendChild(messageText);
    chatWindow.appendChild(messageDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    if (sender === 'ai') {
      messageText.textContent = ''; // 添加这一行，确保开始时文本内容为空
      let index = 0;
      function typeWriter() {
        if (index < message.length) {
          messageText.textContent += message.charAt(index);
          index++;
          setTimeout(typeWriter, 50);
        }
      }
      typeWriter();
    }
  }
});
