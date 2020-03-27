require('dotenv').config()
const Discord = require('discord.js')
const ytdl = require('ytdl-core')

var duckingEnabled = []
var usersSpeaking = new Set()

const bot = new Discord.Client()

bot.once("ready", () => {
    console.log("Ready!")
})

bot.on('message', async message => {
    args = message.content.split(' ')
    if (args) {
        if (args[0] === '!play_test') {
            if (args.length < 2) {
                return "Please provide a youtube video URL"
            }

            if (!message.member.voice.channel) {
                return "You are not in a voice channel"
            }

            const connection = await message.member.voice.channel.join()

            connection.on('error', console.error)

            const dispatcher = connection.play(ytdl(args[1], { filter: 'audioonly' }))

            dispatcher.once('finish', () => {
                connection.disconnect()
            })

            connection.on('speaking', (user, speaking) => {
                if (speaking.has("SPEAKING")) {
                    usersSpeaking.add(user)
                    dispatcher.setVolumeLogarithmic(0.5)
                } else {
                    usersSpeaking.delete(user)
                    if (usersSpeaking.size === 0) {
                        dispatcher.setVolumeLogarithmic(1.0)
                    }
                }
            })
        }
    }
})

// bot.registerCommand("play_test", (msg, args) => {
//     if (args.length === 0) {
//         return "Please provide a youtube video URL"
//     }

//     if (!msg.member.voiceState.channelID) {
//         return "You are not in a voice channel"
//     }

//     bot.joinVoiceChannel(msg.member.voiceState.channelID).catch((err) => {
//         return
//     }).then((connection) => {
//         connection.on('error', (err) => {
//             console.log(err)
//         })

//         connection.on('speakingStart', (userID) => {
//             if (duckingEnabled[msg.member.guild.id]) {
//                 console.log(`speakingStart: ${String(usersSpeaking)}`)
//                 usersSpeaking.add(userID)
//                 connection.setVolume(0.5)
//             }
//         })
        
//         connection.on('speakingStop', (userID) => {
//             if (duckingEnabled[msg.member.guild.id]) {
//                 console.log(`speakingStop: ${String(usersSpeaking)}`)
//                 usersSpeaking.delete(userId)
//                 if (usersSpeaking.size === 0) {
//                     connection.setVolume(1.0)
//                 }
//             }
//         })

//         connection.setVolume(1.0)

//         if (connection.playing) {
//             connection.stopPlaying()
//         }
        
//         connection.play(ytdl(args[0], { filter: 'audioonly' }), { inlineVolume: 'true' } )
//         connection.once('end', () => {
//             bot.leaveVoiceChannel(msg.member.voiceState.channelID)
//         })
//     })
// }, {
//     description: "Play audio from a youtube video"
// })

// bot.registerCommand("kys", (msg, args) => {
//     if (!msg.member.voiceState.channelID) {
//         return "You are not in a voice channel"
//     }

//     bot.leaveVoiceChannel(msg.member.voiceState.channelID)
// })

// bot.registerCommand("volume_test", (msg, args) => {
//     if (!msg.member.voiceState.channelID) {
//         return "You are not in a voice channel"
//     }

//     if (isNaN(args[0]) || args[0] < 0 || args[0] > 1.0) {
//         return "Value must be a number between 0.0 and 1.0"
//     }
    
//     let connection = bot.voiceConnections.get(msg.member.guild.id)
//     if (connection) {
//         connection.setVolume(args[0])
//     }
// })

// bot.registerCommand("ducking", (msg, args) => {
//     let guild_id = msg.member.guild.id
//     if (duckingEnabled[guild_id])
//     {
//         duckingEnabled[guild_id] = false
//         return "Audio ducking disabled"
//     } else {
//         duckingEnabled[guild_id] = true
//         return "Audio ducking enabled"
//     }
// })

bot.login(process.env.DISCORD_TOKEN)