const chat = document.getElementById("chat");
const input = document.getElementById("messageInput");
const button = document.getElementById("sendButton");
const typing = document.getElementById("typing");

let messages = Memory.load();

function currentTime() {
    return new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit"
    });
}

function createMessage(text, type) {

    const wrapper = document.createElement("div");

    wrapper.className = "message " + type;

    wrapper.innerHTML = `
        ${text}
        <div class="time">${currentTime()}</div>
    `;

    chat.appendChild(wrapper);

    chat.scrollTo({
        top: chat.scrollHeight,
        behavior: "smooth"
    });

    return wrapper;
}

function saveChat(){

    const data=[];

    document.querySelectorAll(".message").forEach(m=>{

        data.push({

            html:m.innerHTML,

            class:m.className

        });

    });

    Memory.save(data);

}

function loadChat(){

    messages.forEach(msg=>{

        const div=document.createElement("div");

        div.className=msg.class;

        div.innerHTML=msg.html;

        chat.appendChild(div);

    });

    chat.scrollTop=chat.scrollHeight;

}

loadChat();

button.onclick=send;

input.addEventListener("keydown",e=>{

    if(e.key==="Enter"){

        send();

    }

});

function send(){

    if(input.value.trim()==="") return;

    const text=input.value;

    createMessage(text,"blue");

    saveChat();

    input.value="";

    typing.classList.remove("hidden");

    const delay=Math.floor(

        Math.random()*1200

    )+1200;

    setTimeout(()=>{

        typing.classList.add("hidden");

        createMessage(botReply(text),"gray");

        saveChat();

    },delay);

}

function botReply(message){

    message=message.toLowerCase();

    if(message.includes("name"))
        return `My name is ${personality.name} 😊`;

    if(message.includes("favorite color"))
        return `My favorite color is ${personality.favoriteColor}.`;

    if(message.includes("food"))
        return `I love ${personality.favoriteFood}!`;

    if(message.includes("like"))
        return "I like " + personality.likes.join(", ");

    if(message.includes("hobby"))
        return "I enjoy " + personality.hobbies.join(", ");

    return "That's really interesting. Tell me more!";
}
