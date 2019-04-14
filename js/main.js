var channels = ['Kyle']; // Channels to initially join

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
    var chan = dehash(channel),
        name = user.username,
        msg = formatEmotes(message, user.emotes);

	$('.container-chat').append('<div class="msg">' + user["display-name"] + ': ' + msg + '</div>');
	$('html,body').scrollTop(100000000000000000);
}

function formatEmotes(text, emotes) {
    var splitText = text.split('');
    for(var i in emotes) {
        var e = emotes[i];
        for(var j in e) {
            var mote = e[j];
            if(typeof mote == 'string') {
                mote = mote.split('-');
                mote = [parseInt(mote[0]), parseInt(mote[1])];
                var length =  mote[1] - mote[0],
                    empty = Array.apply(null, new Array(length + 1)).map(function() { return '' });
                splitText = splitText.slice(0, mote[0]).concat(empty).concat(splitText.slice(mote[1] + 1, splitText.length));
                splitText.splice(mote[0], 1, '<img style="height:28px; width:28px;" class="emoticon" src="http://static-cdn.jtvnw.net/emoticons/v1/' + i + '/3.0">');
            }
        }
    }
    return splitText.join('');
}
client.addListener('message', handleChat);

client.connect();