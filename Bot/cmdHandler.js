const fs = require("fs")
//Lanceur de commandes
module.exports.run = (command, message, args) => cmdHandler(command, message, args).then(module.exports.launch, module.exports.fail)
function cmdHandler(command, message, args) {
    const users = JSON.parse(fs.readFileSync(__dirname + "/users.json")) //Liste des différents utilisateurs
    const guilds = JSON.parse(fs.readFileSync(__dirname + "/guilds.json")) // Liste des ID des différents serveurs
    console.log("Commande \"" + command.name + "\" lancée par l'utilisateur \"" + message.author + "\" avec les arguments [\"" + args.join('", "') + "\"].") //Log du lancement de la commande
    module.exports.fail = function fail(reason) { //Commande non lancée ou erreur
        console.log("\nCommande non exécutée. Raison : \n" + reason.fr) //Log de la raison de l'annulation
        let text = {
            fr: "Commande non exécutée car : " + reason.fr,
            en: "The command wasn't used. Reason : " + reason.en
        }
        message.channel.send(text[users[message.author.id].lang]) //Envoi du message pour l'utilisateur
        const red = (256^2 * 110), green = (256 * 0), blue = 0, color = red + green + blue //Définition des couleurs pour l'embed
        let embed = {
            title: "Commande non lancée",
            description: "Une commande n'a pas été exécutée.",
            color: color,
            author: {
                name: message.author.tag,
                icon_url: message.author.avatarURL
            },
            fields: [
                {
                    name: "Nom de la commande",
                    value:  command.name,
                    inline: true
                },
                {
                    name: "Utilisateur",
                    value:  message.author.tag,
                    inline: true
                },
                {
                    name: "Raison",
                    value:  reason,
                    inline: true
                }
            ]
        }
        channel.sendEmbed(embed) //Envoi de l'embed dans le salon de logs
    }
    module.exports.launch = function launch(reason = "Non définie") {
        console.log("\nCommande exécutée. Raison (optionnelle) : \n" + reason + "\n\n") //Log du lancement de la commande
        let channel = message.guild.channels.get(guilds[message.guild.id].channels.logsCmds) //Détection du salon de logs
        if(!channel.available) return console.log("Channel de logs non défini sur \"" + message.guild.name + "\".")
        const red = (256^2 * 0), green = (256 * 110), blue = 0, color = red + green + blue //Couleurs pour l'embed
        let embed = {
            title: "Commande lancée",
            description: "Une commande a été exécutée.",
            color: color,
            author: {
                name: message.author.tag,
                icon_url: message.author.avatarURL
            },
            fields: [
                {
                    name: "Nom de la commande",
                    value:  command.name,
                    inline: true
                },
                {
                    name: "Utilisateur",
                    value:  message.author.tag,
                    inline: true
                },
                {
                    name: "Raison (optionnelle)",
                    value:  reason,
                    inline: true
                }
            ]
        }
        channel.sendEmbed(embed) //Envoi de l'embed dans le salon de logs
    }
    return new Promise((resolve, reject) => {
        if(command.roles) {
            let finded = 0;
            let roles = []
            command.roles.forEach(e => {
                roles.push()
                if (typeof e === "number") {
                    let role = message.guild.roles.get(e.toString())
                    if(!role) return reject({
                        fr: "Le rôle avec l'id \"" + e.toString() + "\" n'est pas sur le serveur \"" + message.guild.name + "\".",
                        en: "The role with the id \"" + e.toString() + "\" isn't on the server \"" + message.guild.name + "\"."
                    })
                    roles.push(role.name)
                    if(message.member.roles.find(r => r.id(e.toString()))) finded = 1
                } else if (typeof e === "string") {
                    let role = message.guild.roles.get(guilds[message.guild.id].roles)
                    if(!role) return reject({
                        fr: "Le rôle avec l'id \"" + e.toString() + "\" n'est pas sur le serveur \"" + message.guild.name + "\".",
                        en: "The role with the id \"" + e.toString() + "\" isn't on the server \"" + message.guild.name + "\"."
                    })
                    roles.push(role.name)
                    if(message.member.roles.find(r => r.id(guilds[message.guild.id].roles[e]))) finded = 1
                }
                
            })
            if(finded === 0) {
                reject("Rôle(s) manquant")
            }
        }
        try { //Commande lancée
            let cmd = require(__dirname + command.path) //Chemin vers la commande
            let params = {
                Discord: Discord,
                bot: bot,
                message: message,
                args: args
            } //Liste des différents paramètres pour la commande
            let results = cmd.run(params) //Lancement de la commande
            if(results.error) {
                reject(results.reason)
            }
            resolve()
        } catch(err) {
            console.log("Erreur dans le code de la commande : \"" + command.name + "\" : \n" + err)
            reject({
                fr: "Erreur dans le code de la commande \"" + command.name + "\".",
                en: "Error in the code of command \"" + command.name + "\"."
            })
        }
    })
}

function cmdHandlerAdmin(guild) {
    const type = JSON.parse(fs.readFileSync(__dirname + "/type.json"))
    return new Promise(resolve, reject => {
        try {
            const guilds = JSON.parse(fs.readFileSync(__dirname + "/guilds.json"))
            if(!guilds[guild.id]) {
                guilds[guild.id] = {channels: {}, roles: {}, members: {}, xpMultiplier: 1}
            }
            let target = guilds[guild.id]
            if(!target.channels) target.channels = {}
            if(!target.roles) target.roles = {}
            if(!target.members) {
                target.members = {}
            }
            if(!target.xpMultiplier) guilds[guild.id].xpMultiplier = 1
            guild.members.array().forEach(e => {
                if(ta)
                guilds[guild.id].members[e.id] = type
            })
            fs.writeFileSync(__dirname + "/guilds.json", JSON.stringify(guilds))
        } catch(err) {
            reject({
                fr: "Erreur lors de la réécriture du fichier d'informations des serveurs.",
                en: "Error in the file create to overwrite servers infos."
            })
        }
    })
}