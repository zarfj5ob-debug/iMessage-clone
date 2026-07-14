const chat = document.getElementById("chat");
const input = document.getElementById("messageInput");
const button = document.getElementById("sendButton");
const typing = document.getElementById("typing");

button.onclick = send;

input.addEventListener("keydown", e=>{
if(e.key==="Enter"){
send();
}
});

function send(){

if(input.value==="") return;

const mine=document.createElement("div");

mine.className="message blue";

mine.textContent=input.value;

chat.appendChild(mine);

typing.classList.remove("hidden");

const text=input.value;

input.value="";

setTimeout(()=>{

typing.classList.add("hidden");

const reply=document.createElement("div");

reply.className="message gray";

reply.textContent=botReply(text);

chat.appendChild(reply);

chat.scrollTop=chat.scrollHeight;

},1500);

}

function botReply(message){

message=message.toLowerCase();

if(message.includes("hi")) return "Hi 😊";

if(message.includes("hello")) return "Hello!";

if(message.includes("how are you")) return "I'm doing great!";

return "Tell me more!";
}
