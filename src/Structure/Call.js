class Call {
	constructor(r, options) {
		this.r = r;
		this.id = options.id;
		this.accepted = options.accepted;
		this.caller = options.caller;
		this.callerChannel = options.callerChannel;
		this.callee = options.callee;
		this.calleeChannel = options.calleeChannel;
	}

	isCall(msg) {
		return this.callerChannel.id === msg.channel.id || this.calleeChannel.id === msg.channel.id;
	}

	acceptCall() {
		this.accepted = true;
		return this.r.table('calls').get(this.id).update({ accepted: true }).run();
	}

	chat(msg) {
		(msg.channel.id === this.caller.id ? this.calleeChannel : this.callerChannel).createMessage('**' + msg.author.username + '#' + msg.author.discriminator + '**: ' + msg.content);
	}

	endCall() {
		return this.r.table('calls').get(this.id).delete().run();
	}
}

module.exports = Call;