document.addEventListener('DOMContentLoaded', function() {
    initSyllabus();
    initTabs();
    initChatbot();
});

function initSyllabus() {
    const unitHeaders = document.querySelectorAll('.unit-header');

    unitHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const unitItem = this.parentElement;
            unitItem.classList.toggle('collapsed');
        });
    });
}

function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');

            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

function initChatbot() {
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendButton');
    const chatMessages = document.getElementById('chatMessages');
    const typingIndicator = document.getElementById('typingIndicator');

    sendButton.addEventListener('click', sendMessage);

    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    async function sendMessage() {
        const message = chatInput.value.trim();

        if (message === '') {
            return;
        }

        addUserMessage(message);
        chatInput.value = '';
        chatInput.focus();

        showTypingIndicator();

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question: message })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            hideTypingIndicator();

            if (data.answer) {
                addBotMessage(data.answer);
            } else if (data.response) {
                addBotMessage(data.response);
            } else if (data.message) {
                addBotMessage(data.message);
            } else {
                addBotMessage('I received your question, but I am having trouble formulating a response.');
            }
        } catch (error) {
            hideTypingIndicator();
            console.error('Error:', error);
            addBotMessage('Sorry, I am having trouble connecting to the server. Please make sure the Flask backend is running and try again.');
        }
    }

    function addUserMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';

        const timestamp = getCurrentTime();

        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${escapeHtml(message)}</p>
                <span class="timestamp">${timestamp}</span>
            </div>
        `;

        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    }

    function addBotMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';

        const timestamp = getCurrentTime();

        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${escapeHtml(message)}</p>
                <span class="timestamp">${timestamp}</span>
            </div>
        `;

        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    }

    function showTypingIndicator() {
        typingIndicator.classList.add('active');
        scrollToBottom();
    }

    function hideTypingIndicator() {
        typingIndicator.classList.remove('active');
    }

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function getCurrentTime() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12;
        hours = hours ? hours : 12;
        const minutesStr = minutes < 10 ? '0' + minutes : minutes;

        return `${hours}:${minutesStr} ${ampm}`;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
