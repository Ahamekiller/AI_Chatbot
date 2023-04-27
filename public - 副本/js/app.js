document.addEventListener('DOMContentLoaded', () => {
  const inputMessage = document.getElementById('input-message');
  const sendButton = document.getElementById('send-button');
  const chatWindow = document.getElementById('chat-window');
  const loadingElement = document.getElementById('loading');

  let sessionId = localStorage.getItem('sessionId');

  if (!sessionId) {
    sessionId = generateUUID();
    localStorage.setItem('sessionId', sessionId);
  }

  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  const introMessage = `我是您的私人助理，您可以向我提出任何问题，我将给您需要的答案。

如：

推荐我十部人工智能题材的电影，按关注度高低排序。

我想写一篇《猪脑存储数据的可行性方案》的论文，请先列出大纲，然后按大纲指导我写细节内容。

我叫韩梅梅，今年23岁，毕业于广州外国语学院，请帮我写一份简历。

请写一个《小马过河》的教案。`;

  appendMessage(introMessage, 'ai');

  sendButton.addEventListener('click', () => {
    const message = inputMessage.value;
    if (!message) return;

    appendMessage(message, 'user');
    displayLoading(true);

    fetch('/api/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message, sessionId }) // 添加 sessionId 到请求
    })
      .then(response => response.json())
      .then(data => {
        displayLoading(false);
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

    messageDiv.appendChild(iconImg);
    messageDiv.appendChild(messageText);
    chatWindow.appendChild(messageDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    if (sender === 'ai') {
      messageText.textContent = '';
      let index = 0;
      function typeWriter() {
        if (index < message.length) {
          messageText.textContent += message.charAt(index);
          index++;
          setTimeout(typeWriter, 25);
        }
      }
      typeWriter();
    } else {
      messageText.textContent = message;
    }
  }

  function displayLoading(isVisible) {
    loadingElement.style.display = isVisible ? 'block' : 'none';
  }
});
