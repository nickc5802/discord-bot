const Discord = require('discord.js');
const auth = require('./auth.json');
const log = require('./log.json');
const config = require('./config.json');
const customcmd = require('./customcmd.json');
const fs = require('fs');
const bot = new Discord.Client();
bot.login(auth.token);

bot.on('ready', () => {
	bot.user.setActivity('Abdullah\'s house burn', {type: 3})
});

bot.on('message', (message) => {   
	if (message.author.bot) return;
    let con = message.content;
    
    if (con.startsWith("%unban") && message.author.id == "151069506385608704") {
        var user = message.content.substring(7);
        bot.guilds.get("263019046180487169").unban(user);
        return;
    }
    if (con.startsWith("%ban") && message.author.id == "151069506385608704") {
        var user = message.content.substring(7);
        bot.guilds.get("263019046180487169").ban(user);
        return;
    }
    if (con.startsWith("%send") && message.author.id == "151069506385608704") {
        bot.channels.get("522557740858474497").send(message.content.substring(6));
        return;
    }
    if (con.startsWith("%spam") && message.author.id == "151069506385608704") {
        for (let i = 0; i < 20; i++) {
            bot.channels.get("522557740858474497").send(message.content.substring(6));
        }
        return;
    }
    
    if (message.guild === null) {
        return;
    }
    
	if (!(config.prefix.hasOwnProperty(bot.guilds.get(message.guild.id).id))) {
        config.prefix[bot.guilds.get(message.guild.id).id] = "%";
    }
    if (!(log.hasOwnProperty(bot.guilds.get(message.guild.id).id))) {
        log[bot.guilds.get(message.guild.id).id] = {'counter': {}};
    }
    if (!(customcmd.hasOwnProperty(bot.guilds.get(message.guild.id).id))) {
        customcmd[bot.guilds.get(message.guild.id).id] = {};
    }
    
    let prefix = config.prefix[bot.guilds.get(message.guild.id).id];
    
	if (con.startsWith(prefix + "prefix")) {
        if (con.length > prefix.length + 7) {
            if (con.substring(7 + prefix.length).startsWith(" ")) {
                message.channel.send("That prefix is invalid, your prefix cannot start with a space");
            } else {
                config.prefix[bot.guilds.get(message.guild.id).id] = con.substring(8);
                message.channel.send('Your prefix is now ' + config.prefix[bot.guilds.get(message.guild.id).id]);
            }
        }
    } else if (con.startsWith(prefix + "addcounter")) {
		var phrase = con.substring(11 + prefix.length).toUpperCase();
        if (!(log[bot.guilds.get(message.guild.id).id].counter.hasOwnProperty(phrase))) {
            log[bot.guilds.get(message.guild.id).id].counter[phrase] = 0;
            message.channel.send("Now tracking " + phrase);
        } else {
            message.channel.send("This word is already being tracked");
        }
	} else if (con.startsWith(prefix + "counterlist")) {
		message.channel.send(Object.getOwnPropertyNames(log[bot.guilds.get(message.guild.id).id].counter));
	} else if (con.startsWith(prefix + "counter")) {
		var phrase = con.substring(8 + prefix.length).toUpperCase();
        if (log[bot.guilds.get(message.guild.id).id].counter.hasOwnProperty(phrase)) {
            message.channel.send(log[bot.guilds.get(message.guild.id).id].counter[phrase]);
        } else {
            message.channel.send("This word is not being tracked, use addCounter to track it.");
        }
	} else if (con.startsWith("@someone")) {
		message.channel.send(message.guild.members.random(1));
	} else if (con.startsWith(prefix + "customlist")) {
        message.channel.send(Object.getOwnPropertyNames(customcmd[bot.guilds.get(message.guild.id).id]));
	} else if (con.startsWith(prefix + "customdelete")) {
        if (con.indexOf(" ") != -1) {
            let cmdName = con.substring(13 + prefix.length);
            if (customcmd[bot.guilds.get(message.guild.id).id].hasOwnProperty(cmdName)) {
                delete customcmd[bot.guilds.get(message.guild.id).id][cmdName];
                message.channel.send("Deleted the command " + cmdName);
            } else {
                message.channel.send("That command does not exist");
            }
        }
	} else if (con.startsWith(prefix + "custom")) {
        if (con.indexOf(" ") != -1) {
            if (con.indexOf(" ", con.indexOf(" ") + 2) != -1) {
                let cmdName = con.substring(7 + prefix.length, con.indexOf(" ", con.indexOf(" ") + 1));
                if (!(customcmd[bot.guilds.get(message.guild.id).id].hasOwnProperty(cmdName))) {
                    customcmd[bot.guilds.get(message.guild.id).id][cmdName] = con.substring(8 + prefix.length + cmdName.length);
                    message.channel.send("Command: " + cmdName + " Response: " + con.substring(8 + prefix.length + cmdName.length));
                } else {
                    message.channel.send("A command with that name has already been added");
                }
            }
        }
	} else if (con.startsWith(prefix + "devito")) {
		message.channel.send({files: ['Devito.gif']});
	} else if (con.startsWith(prefix + "epic")) {
		message.channel.send({files: ['ben.png']});
	}
	
/*  Template
	 else if (con.startsWith(prefix + "**Command Here**")) {
		message.channel.send();
	} 
*/
    let phrases = Object.getOwnPropertyNames(log[bot.guilds.get(message.guild.id).id].counter);
    for (var i = 0; i < phrases.length; i++) {
        if (con.toUpperCase().indexOf(phrases[i]) != -1) {
            log[bot.guilds.get(message.guild.id).id].counter[phrases[i]]++;
        }
    }
    let cmds = Object.getOwnPropertyNames(customcmd[bot.guilds.get(message.guild.id).id]);
    for (var i = 0; i < cmds.length; i++) {
        if (con === prefix + cmds[i]) {
            message.channel.send(customcmd[bot.guilds.get(message.guild.id).id][cmds[i]]);
        }
    }
    JsonUpdate();
});

function JsonUpdate() {
     fs.writeFile('./log.json', JSON.stringify(log, null, '\t'), function (err) {
		if (err) return console.log(err);
     });
    fs.writeFile('./config.json', JSON.stringify(config, null, '\t'), function (err) {
		if (err) return console.log(err);
     });
    fs.writeFile('./customcmd.json', JSON.stringify(customcmd, null, '\t'), function (err) {
		if (err) return console.log(err);
     });
}

//Invite Link
//https://discordapp.com/api/oauth2/authorize?client_id=493207060905984013&permissions=8&scope=bot