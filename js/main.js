var channels = ['moonmoon_ow']; // Channels to initially join

fetch('https://api.betterttv.net/2/channels/'+channels[0])
.then(json => json.json())
.then(data => {
    console.log(data);
    if (!data.status || data.status != 404) {
        for (var index = 0; index < data.emotes.length; index++) {
            var emote = data.emotes[index];
            bttvEmotes[emote.code] = emote.id;
        }
    }
})

var clientOptions = {
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

function handleChat(channel, user, message, self) {
    //console.log(user);
    /*if (message.length < 20 && user.badges && user.badges.subscriber && user.badges.subscriber !== '0' && Math.random() > 0.9) {
        ctx.fillStyle = '#fff';
        ctx.globalAlpha = 1;
        ctx.font = 'bold 100px monospace';
        ctx.fillText(message, canvas.width/2.5, canvas.height - canvas.height/10, canvas.width/2);
    }*/
    var chan = dehash(channel),
        name = user.username;

    console.log(user + ": " + message);
}

client.addListener('message', handleChat);

client.connect();