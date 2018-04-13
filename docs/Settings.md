# Settings

## Setting Types
* `joinmessages`
    * `joinmessages.enabled`
    * `joinmessages.channel`
    * `joinmessages.message`
* `leavemessages`
    * `leavemessages.enabled`
    * `leavemessages.channel`
    * `leavemessages.message`

## Storage Format
```js
{
    id: String, // guild ID
    joinMessages: {
        enabled: Boolean, // whether join messages are enabled or not
        channelID: String, // channel ID of the join messages
        message: String // messages that should be sent
    },
    leaveMessages: {
        enabled: Boolean, // whether leave messages are enabled or not
        channelID: String, // channel ID of the leave messages
        message: String // messages that should be sent
    }
}
```

## Tags
* `{user.id}`
* `{user.username}`
* `{user.discriminator}`
* `{user.tag}`
* `{user.avatarURL}`
* `{user.createdAt.time}`
* `{user.createdAt.date}`
* `{user.createdAt.datetime}`
* `{user.joinedAt.time}`
* `{user.joinedAt.date}`
* `{user.joinedAt.datetime}`
* `{date}`
* `{time}`
* `{datetime}`
* `{guild.name}`
* `{guild.id}`
* `{guild.members}`
* `{guild.roles}`
* `{guild.emojis}`
* `{guild.createdAt.time}`
* `{guild.createdAt.date}`
* `{guild.createdAt.datetime}`