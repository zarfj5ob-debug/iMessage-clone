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
            type: message.classList.contains("blue") ? "blue" : "gray",
            time: timeElement ? timeElement.textContent : currentTime()
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
            "You can talk to me about anything.",
            "gray"
        );

        saveChat();
        return;
    }

    messages.forEach(message => {
        // Support the older version of the chat memory
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

function send() {
    const text = input.value.trim();

    if (text === "") return;

    createMessage(text, "blue");
    saveChat();

    input.value = "";

    typing.classList.remove("hidden");

    const delay =
        Math.floor(
            Math.random() *
            (APP_CONFIG.typing.maximumDelay -
            APP_CONFIG.typing.minimumDelay)
        ) +
        APP_CONFIG.typing.minimumDelay;

    setTimeout(() => {
        typing.classList.add("hidden");

        const reply = botReply(text);

        createMessage(reply, "gray");
        saveChat();

    }, delay);
}

function botReply(message) {
    const text = message.toLowerCase();

    if (text.includes("what is your name") ||
        text.includes("what's your name") ||
        text === "name") {
        return `My name is ${personality.name} 😊`;
    }

    if (text.includes("favorite color")) {
        return `My favorite color is ${personality.favoriteColor} 💙`;
    }

    if (text.includes("favorite food") ||
        text.includes("what food")) {
        return `I love ${personality.favoriteFood}! 🍣`;
    }

    if (text.includes("hobby") ||
        text.includes("hobbies")) {
        return `I enjoy ${personality.hobbies.join(", ")}.`;
    }

    if (text.includes("what do you like") ||
        text.includes("what do you like?")) {
        return `I like ${personality.likes.join(", ")} 😊`;
    }

    if (text.includes("hello") ||
        text === "hey" ||
        text === "hi" ||
        text.includes("hey ")) {
        return "Heyyy 😊 what's up?";
    }

    if (text.includes("how are you")) {
        return "I'm doing pretty good 😊 How are you?";
    }

    if (text.includes("good morning")) {
        return "Good morninggg ☀️😊";
    }

    if (text.includes("good night")) {
        return "Goodnight ❤️ sleep well!";
    }

    return "That's interesting 👀 tell me more.";
}
