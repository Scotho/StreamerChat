var channels = ['moonmoon_ow']; // Channels to initially join

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
        name = user.username;
    console.log('---------');
    console.log(user);
    console.log(message);
    console.log(self);
    console.log(channel);
    console.log('---------');

}

client.addListener('message', handleChat);

client.connect();