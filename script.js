const chat = document.getElementById("chat");
const input = document.getElementById("messageInput");
const button = document.getElementById("sendButton");
const typing = document.getElementById("typing");

let messages = [];

try {
    messages = Memory.load() || [];
} catch (error) {
    messages = [];
}

function currentTime() {
    return new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit"
    });
}

function createMessage(text, type, time = currentTime()) {
    const wrapper = document.createElement("div");
    wrapper.className = "message " + type;

    const textElement = document.createElement("div");
    textElement.textContent = text;

    const timeElement = document.createElement("div");
    timeElement.className = "time";
    timeElement.textContent = time;

    wrapper.appendChild(textElement);
    wrapper.appendChild(timeElement);

    chat.appendChild(wrapper);

    chat.scrollTo({
        top: chat.scrollHeight,
        behavior: "smooth"
    });
}

function saveChat() {
    const data = [];

    document.querySelectorAll(".message").forEach(message => {
        const textElement = message.querySelector("div");
        const timeElement = message.querySelector(".time");

        if (!textElement) return;

        data.push({
            text: textElement.textContent,
            type: message.classList.contains("blue")
                ? "blue"
                : "gray",
            time: timeElement
                ? timeElement.textContent
                : currentTime()
        });
    });

    Memory.save(data);
}

function loadChat() {

    if (!Array.isArray(messages) || messages.length === 0) {

        createMessage(
            `Hey! I'm ${personality.name} 😊`,
            "gray"
        );

        createMessage(
            "What's up?",
            "gray"
        );

        saveChat();
        return;
    }

    messages.forEach(message => {

        if (message.text) {

            createMessage(
                message.text,
                message.type || "gray",
                message.time || currentTime()
            );

        }

    });

    chat.scrollTop = chat.scrollHeight;
}

loadChat();

button.addEventListener("click", send);

input.addEventListener("keydown", event => {

    if (event.key === "Enter") {
        send();
    }

});

async function send() {

    const text = input.value.trim();

    if (!text) return;

    createMessage(text, "blue");

    saveChat();

    input.value = "";

    typing.classList.remove("hidden");

    try {

        const reply = await getAIReply(text);

        typing.classList.add("hidden");

        createMessage(
            reply,
            "gray"
        );

        saveChat();

    } catch (error) {

        console.error(error);

        typing.classList.add("hidden");

        createMessage(
            "Sorry, I couldn't connect right now. 😕",
            "gray"
        );

        saveChat();
    }
}

async function getAIReply(message) {

    const endpoint = APP_CONFIG.backend.apiEndpoint;

    if (!endpoint) {
        throw new Error("AI endpoint has not been connected.");
    }

    const recentMessages = messagesForAI();

    const response = await fetch(endpoint, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            message: message,

            history: recentMessages,

            personality: personality

        })

    });

    if (!response.ok) {

        const errorText = await response.text();

        throw new Error(
            "AI server error: " + errorText
        );
    }

    const data = await response.json();

    if (!data.reply) {
        throw new Error("No AI reply received.");
    }

    return data.reply;
}

function messagesForAI() {

    const saved = Memory.load();

    if (!Array.isArray(saved)) {
        return [];
    }

    return saved.slice(-20);
}
