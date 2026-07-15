const Memory = {

save(messages){

localStorage.setItem(
"messages",
JSON.stringify(messages)
);

},

load(){

const data =
localStorage.getItem("messages");

if(!data) return [];

return JSON.parse(data);

},

clear(){

localStorage.removeItem("messages");

}

};
