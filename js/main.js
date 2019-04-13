const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

const skull = new Image(1333, 1333);
skull.src = 'skull.png';

skull.half = skull.width/2;


const circ = [];
for (let index = 0; index < 11; index++) {
    circ[index] = new Image(2000, 2000);
    circ[index].src = 'circ'+index+'.png';

    circ[index].half = 1000;
}

const easeInOutSine = (currentIteration, startValue, changeInValue, totalIterations) => {
    return changeInValue / 2 * (1 - Math.cos(Math.PI * currentIteration / totalIterations)) + startValue;
}

const scale = 3;
let halfx = canvas.width/2;
let halfy = canvas.height/2;
let skullwidth = 100;

let direction = 0;
let directFlip = false;

const paint = () => {
    if (directFlip) direction++;
    else direction--;
    if (Math.abs(direction) >= 360) directFlip = !directFlip;

    console.log(Math.round(direction/36));
    ctx.drawImage(circ[Math.abs(Math.floor(direction/36))], 0, 0, canvas.width, canvas.height);


    ctx.save();
    ctx.translate(halfx,halfy);
    ctx.rotate(Math.abs(direction/800 + 0.75)*Math.PI/180);
    ctx.globalAlpha = 0.25;
    ctx.drawImage(canvas, -halfx+scale, -halfy+scale, canvas.width - (scale*2), canvas.height - (scale*2));
    ctx.restore();
    ctx.fillStyle = "#000000";
    ctx.globalAlpha = 0.01;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.globalAlpha = 0.5;
    ctx.drawImage(skull, easeInOutSine(direction, 0, 36, 360), halfy - skullwidth/2, skullwidth, skullwidth);
    ctx.globalAlpha = 1;


    /*ctx.fillStyle = "HSL("+Math.abs(direction)+", 100%, 50%)";
    ctx.fillRect(0,0,canvas.width, 1);
    ctx.fillRect(0,canvas.height-1,canvas.width, 1);

    ctx.fillRect(0,0,1, canvas.height);
    ctx.fillRect(canvas.width-1,0, 1, canvas.height);*/

    window.requestAnimationFrame(paint);
}


window.addEventListener('load', ()=>{
    document.body.appendChild(canvas);
    resize();
    paint();
})

let emoteRange = {x: 0, y: 0};
const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    halfx = canvas.width/2;
    halfy = canvas.height/2;
    skullwidth = Math.min(canvas.width, canvas.height)*0.9;

    emoteRange.x = halfx;
    emoteRange.maxX = halfx;
    emoteRange.y = 0;
    emoteRange.maxY = window.innerHeight;
}
window.addEventListener('resize', resize)



/******************
 * 
 * 
 * 
 * Start chat handler
 * 
 * 
 * **************** */

const drawEmote = (url) => {
    if(url !== '') {
        let image = new Image();
        image.addEventListener('load', ()=>{
            ctx.drawImage(image, emoteRange.x + Math.floor(Math.random()*skullwidth*1.5),emoteRange.y + Math.floor(Math.random()*skullwidth*1.5));
        })
        image.src = url;
    } else {
        if (Math.random()>0.5) ctx.fillStyle = '#000';
        else ctx.fillStyle = '#fff';
        ctx.fillRect(
            emoteRange.x + Math.floor(Math.random()*emoteRange.maxX),
            emoteRange.y + Math.floor(Math.random()*emoteRange.maxY),
            skullwidth/50, skullwidth/50);
    }
}



let channels = ['moonmoon_ow']; // Channels to initially join

let myhash = window.location.hash;

if (window.location.hash) {
    channels = [window.location.hash.replace('#', '')];
}
setInterval(()=>{
    if (window.location.hash !== myhash) {
        window.location.reload();
    }
}, 1000);
const broadcasterMatch = new RegExp(channels[0], 'i');
const bttvEmotes = {};

fetch('https://api.betterttv.net/2/channels/'+channels[0])
.then(json => json.json())
.then(data => {
    console.log(data);
    if (!data.status || data.status != 404) {
        for (let index = 0; index < data.emotes.length; index++) {
            const emote = data.emotes[index];
            bttvEmotes[emote.code] = emote.id;
        }
    }
})

clientOptions = {
        options: {
                debug: false
            },
            connection: {
                reconnect: true,
                secure: true,
            },
        channels: channels
    },
client = new tmi.client(clientOptions);

function dehash(channel) {
return channel.replace(/^#/, '');
}

function capitalize(n) {
return n[0].toUpperCase() +  n.substr(1);
}

const checkBTTV = (text)=>{
    const split = text.split(' ');
    const emotes = {};
    for (let index = 0; index < split.length; index++) {
        const element = split[index];
        if (bttvEmotes[element] && !emotes[element]) {
            emotes[element] = true;
            drawEmote('https://cdn.betterttv.net/emote/'+bttvEmotes[element]+'/3x');
        }
    }
} 
function formatEmotes(text, emotes) {
    for(let i in emotes) {
        drawEmote('http://static-cdn.jtvnw.net/emoticons/v1/' + i + '/3.0');
    }
    checkBTTV(text)
}


function handleChat(channel, user, message, self) {
    //console.log(user);
    /*if (message.length < 20 && user.badges && user.badges.subscriber && user.badges.subscriber !== '0' && Math.random() > 0.9) {
        ctx.fillStyle = '#fff';
        ctx.globalAlpha = 1;
        ctx.font = 'bold 100px monospace';
        ctx.fillText(message, canvas.width/2.5, canvas.height - canvas.height/10, canvas.width/2);
    }*/
    let chan = dehash(channel),
        name = user.username;
    formatEmotes(message, user.emotes);
    drawEmote('');
}


client.addListener('message', handleChat);

client.connect();