require('dotenv').config()
const Eris = require('eris')
const ytdl = require('ytdl-core')

var duckingEnabled = []
var usersSpeaking = new Set()

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

        connection.on('speakingStart', (userID) => {
            if (duckingEnabled[msg.member.guild.id]) {
                console.log(`speakingStart: ${String(usersSpeaking)}`)
                usersSpeaking.add(userID)
                connection.setVolume(0.5)
            }
        })
        
        connection.on('speakingStop', (userID) => {
            if (duckingEnabled[msg.member.guild.id]) {
                console.log(`speakingStop: ${String(usersSpeaking)}`)
                usersSpeaking.delete(userId)
                if (usersSpeaking.size === 0) {
                    connection.setVolume(1.0)
                }
            }
        })

        connection.setVolume(1.0)

        if (connection.playing) {
            connection.stopPlaying()
        }
        
        connection.play(ytdl(args[0], { filter: 'audioonly' }), { inlineVolume: 'true' } )
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

    if (isNaN(args[0]) || args[0] < 0 || args[0] > 1.0) {
        return "Value must be a number between 0.0 and 1.0"
    }
    
    let connection = bot.voiceConnections.get(msg.member.guild.id)
    if (connection) {
        connection.setVolume(args[0])
    }
})

bot.registerCommand("ducking", (msg, args) => {
    let guild_id = msg.member.guild.id
    if (duckingEnabled[guild_id])
    {
        duckingEnabled[guild_id] = false
        return "Audio ducking disabled"
    } else {
        duckingEnabled[guild_id] = true
        return "Audio ducking enabled"
    }
})

bot.registerCommand

bot.connect()