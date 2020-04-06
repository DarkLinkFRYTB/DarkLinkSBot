const Discord = require('discord.js'), bot = new Discord.Client()
bot.login(process.env.token)
const fs = require('fs')
const config = JSON.parse(fs.readFileSync(__dirname + "/config.json"))

//Ready
bot.on("ready", function() {
    const guilds = JSON.parse(fs.readFileSync(__dirname + "/guilds.json")) //Les différents serveurs
    for(const guildID in guilds) {
        let guild = bot.guilds.get(guildID) //Le serveur actuel
        if(!guild.available) return console.log(guildID + " : serveur introuvable.") //Si le serveur actuel est introuvable ou indisponible
        if(!guilds[guild.id].channels.captcha) return console.log(guild.name + " : channel captcha non défini.") //Si le salons de captcha n'est pas défini sur le serveur
    }
    bot.user.setActivity(config.prefix + "help", {type: "STREAMING", url: "https://twitch.com/dtdarklink"}) //Pour définir l'activité du bot
    console.log("Mon bot est fait !") //Log pour prévenir que le bot est fonctionnel
})

//Bot ajouté à un serveur
bot.on("guildCreate", guild => {
    console.log("Le bot rejoins le serveur \"" + guild.name + "\".") //Log comme quoi le bot est ajouté à un serveur
    const guilds = JSON.parse(fs.readFileSync(__dirname + "/guilds.json")) //Les ID des différents serveurs
    guilds[guild.id] = {
        channels: {},
        roles: {}
    }
    fs.writeFileSync(__dirname + "/guilds.json", JSON.stringify(guilds)) //Écriture des données dans le fichier JSON
})

//Quand le bot est retiré d'un serveur
bot.on("guildDelete", guild => {
    console.log("Le bot quitte le serveur \"" + guild.name + "\".") //Log comme quoi le bot quitte un serveur
    const guilds = JSON.parse(fs.readFileSync(__dirname + "/guilds.json")) //Les ID des différents serveurs
    delete guilds[guild.id] //Suppression des données sur le serveur
    fs.writeFileSync(__dirname + "/guilds.json", JSON.stringify(guilds)) //Ré-écriture des données dans le fichier
})