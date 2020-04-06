const fs = require("fs")
const canvas = require('canvas')
const FortniteAPI = require("fortnite-api-com");
const configFtn = {
  apikey: "4653b02160bea3cf10fffa2faa72e239a5ed0a4f42915cfb9ad8cdec0375e9db",
  language: "fr"
};
const Fortnite = new FortniteAPI(configFtn);
    const date = new Date()

module.exports.getShop = function getShop(params) {
    var day = date.getDate(), month = date.getMonth() + 1, year = date.getFullYear()
    const mois_pleins = [1, 3, 5, 7, 8, 10, 12]
    function today() {
        if(date.getHours() < 1 || date.getMinutes() < 5) {
            if(day === 1) {
                if(mois_pleins.includes(month)) {
                    day = 31
                } else if(month === 3) {
                    if(year % 4 === 0) {
                        day = 29
                    } else {
                        day = 28
                    }
                } else {
                    day = 30
                }
            } else {
                day = day - 1
            }
        } 
        if(month < 10) month = "0" + month 
    }
    today()
    var dateStr = `${day.toString()}/${month.toString()}/${year.toString()}`
    const shop = JSON.parse(fs.readFileSync(__dirname + "/shop.json"))
    const canv = canvas.createCanvas(500, 1500)
    const ctx = canv.getContext('2d')
    let targetShop = (params.args[0]) ? shop[params.args[0]]: shop[dateStr];
    if(!targetShop) return {
        err: true,
        reason: {
            fr: "Date inconnue (La date doit être donnée en JJ/MM/AAAA).",
            en: "Unknown date (The date must be in format DD/MM/YYYY)."
        }
    }

}
module.exports.setShop = function() {
    if(date.getHours() !== 1 || date.getMinutes() !== 5 || date.getSeconds() !== 0) {
        //setTimeout(module.exports.setShop(), 10000)
    }
    let shop = JSON.parse(fs.readFileSync(__dirname + "/shop.json"))
    Fortnite.Shop("fr")
    .then(res => {
        var day = date.getDate(), month = date.getMonth() + 1, year = date.getFullYear()
        if(month < 10) month = "0" + month 
        const dateStr = `${day.toString()}/${month.toString()}/${year.toString()}`
        if(shop[dateStr]) return;
        shop[dateStr] = {
            featured: res.data.featured,
            daily: res.data.daily,
            votes: res.data.votes,
            voteWinners: res.data.voteWinners
        }
        fs.writeFileSync(__dirname + "/shop.json", JSON.stringify(shop))
        console.log(shop);
    }).catch(err => {
        console.log(err);
    });
    //module.exports.setShop()
}

module.exports.setShop()
module.exports.getShop({args: []})