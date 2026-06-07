const appBtn = document.getElementById("appBtn");

const apkUrl = "https://alantv.my.id/app.apk";
const appScheme = "alantv://open";

const isAndroid = /Android/i.test(navigator.userAgent);

appBtn.innerText = "Get App";

if(isAndroid){

appBtn.addEventListener("click", function(e){
e.preventDefault();

let opened = false;

const onVisibilityChange = function(){
if(document.hidden){
opened = true;
appBtn.innerText = "Launch App";
}
};

document.addEventListener(
"visibilitychange",
onVisibilityChange,
{ once:true }
);

window.location.href = appScheme;

setTimeout(function(){

if(!opened){

appBtn.innerText = "Get App";
window.location.href = apkUrl;

}

},1800);

});

}else{

appBtn.innerText = "Get App";
appBtn.href = apkUrl;
appBtn.setAttribute("download","app.apk");

}

function showImage(){

const img = document.getElementById("sawitImage");

if(img.style.display === "block"){
img.style.display = "none";
}else{
img.style.display = "block";
}

}

function openPlaylistPopup(){

const overlay = document.getElementById("playlistOverlay");
const popup = document.getElementById("playlistPopup");

renderPlaylistList();
overlay.classList.add("show");
popup.classList.add("show");

}

function closePlaylistPopup(){

const overlay = document.getElementById("playlistOverlay");
const popup = document.getElementById("playlistPopup");

overlay.classList.remove("show");
popup.classList.remove("show");

}

function renderPlaylistList(){

const listBox = document.getElementById("playlistList");

if(!listBox || listBox.dataset.loaded === "true") return;

listBox.innerHTML = playlistLinks.map(item => `
<button class="playlist-item" onclick="copyLink('${item.url}')">
  <span class="playlist-info">
    <strong>${item.name}</strong>
    <span>${item.url}</span>
  </span>
  <span class="copy-badge">COPY</span>
</button>
`).join("");

listBox.dataset.loaded = "true";

}

function copyLink(url){

const done = () => {

const toast = document.getElementById("toast");

toast.innerText = "Playlist copied!";
toast.classList.add("show");
closePlaylistPopup();

setTimeout(() => {
toast.classList.remove("show");
},2000);

};

if(navigator.clipboard && window.isSecureContext){

navigator.clipboard.writeText(url)
.then(done)
.catch(() => fallbackCopy(url, done));

}else{

fallbackCopy(url, done);

}

}

function fallbackCopy(text, callback){

const textarea = document.createElement("textarea");
textarea.value = text;
textarea.style.position = "fixed";
textarea.style.left = "-9999px";
document.body.appendChild(textarea);
textarea.focus();
textarea.select();

try{
document.execCommand("copy");
callback();
}catch(e){
alert("Copy gagal, salin manual: " + text);
}

document.body.removeChild(textarea);

}

const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");
const musicPlayer = document.getElementById("musicPlayer");

window.addEventListener("load", () => {

music.volume = 0.55;

const playPromise = music.play();

if(playPromise !== undefined){

playPromise.catch(() => {

setPaused();

document.addEventListener("click", () => {

music.play();
setPlaying();

},{ once:true });

});

}

});

function toggleMusic(){

if(music.paused){

music.play();
setPlaying();

}else{

music.pause();
setPaused();

}

}

function setPlaying(){

musicBtn.innerText = "⏸";
musicPlayer.classList.remove("paused");

}

function setPaused(){

musicBtn.innerText = "▶";
musicPlayer.classList.add("paused");

}