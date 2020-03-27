require('dotenv').config()
const Eris = require('eris')
const ytdl = require('ytdl-core')

const bot = new Eris.CommandClient(process.env.DISCORD_TOKEN, {}, {
    description: "a Discord bot",
    owner: "Kasiski",
    prefix: "!"
})

bot.on("ready", () => {
    console.log("Ready!")
})

bot.registerCommand("play_test", (msg, args) => {
    if (args.length === 0) {
        return "Please provide a youtube video URL"
    }

    if (!msg.member.voiceState.channelID) {
        return "You are not in a voice channel"
    }

    bot.joinVoiceChannel(msg.member.voiceState.channelID).catch((err) => {
        return
    }).then((connection) => {
        connection.on('error', (err) => {
            console.log(err)
        })

        if (connection.playing) {
            connection.stopPlaying()
        }
        
        connection.play(ytdl(args[0], { filter: 'audioonly' }))
        connection.once('end', () => {
            bot.leaveVoiceChannel(msg.member.voiceState.channelID)
        })
    })
}, {
    description: "Play audio from a youtube video"
})

bot.registerCommand("kys", (msg, args) => {
    if (!msg.member.voiceState.channelID) {
        return "You are not in a voice channel"
    }

    bot.leaveVoiceChannel(msg.member.voiceState.channelID)
})

bot.registerCommand("volume_test", (msg, args) => {
    if (!msg.member.voiceState.channelID) {
        return "You are not in a voice channel"
    }

    let connection = bot.voiceConnections.get(msg.member.guild.id)
    if (connection) {
        connection.volume = args[0]
    }
})

bot.registerCommand

bot.connect()