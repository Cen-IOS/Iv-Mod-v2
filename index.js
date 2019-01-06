// Calling Packages
const Discord = require('discord.js');
const bot = new Discord.Client();
const weather = require('weather-js');
const fs = require('fs');
const poke_db = require("./cen_base.json");
const commands = JSON.parse(fs.readFileSync('Storage/commands.json', 'utf8'));
const pokeList = fs.readFileSync('commands/poke++.txt','utf8');
const Ispoofer = fs.readFileSync('commands/Ispoofer.txt','utf8');
const AbsolQuest = fs.readFileSync('commands/Absol.txt','utf8');
const Spinda = fs.readFileSync('commands/Spinda.txt','utf8');
const searchquest = fs.readFileSync('commands/Searchquest.txt','utf8');
const welcome = fs.readFileSync('commands/welcome.txt','utf8');
bot.msgs = require ('./msgs.json');
// Global Settings
const prefix = '-'; 

// stats channel
const serverStats = {
    guildID: '361853339257929729',
    totalUserID: '458186563688333314',
    memberCountID: '458186704424271872',
    botCountID: '458186765463977984',
}
// Functions
function hook(channel, title, message, color, avatar) { 

    
    if (!channel) return console.log('Channel not specified.');
    if (!title) return console.log('Title not specified.');
    if (!message) return console.log('Message not specified.');
    if (!color) color = '00FF00'; 
    if (!avatar) avatar = 'https://media.discordapp.net/attachments/367295988546666509/382454680158076930/2.png' 


    color = color.replace(/\s/g, '');
    avatar = avatar.replace(/\s/g, '');


    channel.fetchWebhooks() 
        .then(webhook => {

            
            let GotchaHook = webhook.find('name', 'Webhook'); 

            
            if (!GotchaHook) {
                channel.createWebhook('Webhook', 'https://media.discordapp.net/attachments/367295988546666509/382454680158076930/2.png') 
                    .then(webhook => {
                        
                        webhook.send('', {
                            "username": title,
                            "avatarURL": avatar,
                            "embeds": [{
                                "color": parseInt(`0x${color}`),
                                "description":message
                            }]
                        })
                            .catch(error => { 
                                console.log(error);
                                return channel.send('**Something went wrong when sending the webhook. Please check console.**');
                            })
                    })
            } else { 
                GotchaHook.send('', { 
                    "username": title,
                    "avatarURL": avatar,
                    "embeds": [{
                        "color": parseInt(`0x${color}`),
                        "description":message
                    }]
                })
                    .catch(error => { 
                        console.log(error);
                        return channel.send('**Something went wrong when sending the webhook. Please check console.**');
                    })
                }

        })

}


bot.on('message', message => {

    
    let msg = message.content.toUpperCase();
//poke++ 
if (msg === 'POKE++' || msg === prefix + 'POKEGO2'){
    message.channel.send(pokeList)
}
 if (msg === 'ISFREE' || msg === prefix + 'ISPOOFER'){
    message.channel.send(Ispoofer)
}
 if (msg === 'SPINDA' || msg === prefix + 'SPINDA'){
    message.channel.send(Spinda)
}
if (msg === 'QUEST ABSOL' || msg === prefix + 'COOR QUEST'){
    message.channel.send(AbsolQuest)
}
if (msg === 'SEARCH QUEST' || msg === prefix + 'SEARCH QUEST'){
    message.channel.send(searchquest)
}
if (msg === 'HI CEN' || msg === prefix + 'HI CEN'){
    message.channel.send(welcome)
}

if (message.content.startsWith ('save')) {
    editedmessage = message.content.slice (8);

    bot.msgs [message.author.username] = {
        message: editedmessage
    }
    fs.writeFile ('./msgs.json', JSON.stringify (bot.msgs, null,4), err => {
        if (err) throw err;
        message.channel.send ('Cảm Ơn Bạn ' + message.author + ' Đã Gửi Thông Tin Tới Cho ❥一 ϻя.Ƭ ✔  ')
    });
}

    if (message.content.startsWith ('get')) {
        let _message = bot.msgs[message.author.username].message;
        message.channel.send('Catch @here =>>' +  _message);

    }

if(message.author.bot) return;

try {
    let commandFile = require(`./commands/${cmd}.js`); // This will assign that filename to commandFile
    commandFile.run(bot, message, args, func); // This will add the functions, from the functions.js file into each commandFile.
} catch (e) { // If an error occurs, this will run.
    console.log(e.message); // This logs the error message
} finally { // This will run after the first two clear up
    console.log(`${message.author.username} ran the command: ${cmd}`);
}
const args = message.content.slice(prefix.length).trim().toLowerCase().split(/ +/g);
const command = args.shift();
if (command === "iv") {
    poke_name = args[0].charAt(0).toUpperCase() + args[0].slice(1);
    if (poke_db[args[0]] === undefined) {
        message.channel.send('Pokemon not found');
    } else if (poke_db[args[0]] !== undefined && poke_db[args[0]][args[1]] === undefined) {
        if (Number(args[1]) > 0) {
            message.channel.send('Cannot Found Raid/Egg/Quest ' + poke_name + ' With CP=' + args[1]);
        } else {
            message.channel.send('CP is incorrect, please enter correct CP');
        }
    } else if (poke_db[args[0]][args[1]] !== undefined) {
        var embed = new Discord.RichEmbed();
        embed.setColor(0xff3399);
        poke_lvl  = poke_db[args[0]][args[1]];
        lvl_keys  = Object.keys(poke_lvl);
        if (lvl_keys.length == 1) {
            if (lvl_keys[0] === '15') {
                embed.setTitle('Quest pokemon ' + poke_name + ' level 15, CP ' + args[1]);
            } else if (lvl_keys[0] === '20') {
                embed.setTitle('Raid boss (No weather boost) ' + poke_name + ' level 20, CP ' + args[1]);
            } else if (lvl_keys[0] === '25') {
                embed.setTitle('Raid boss (Weather boost) ' + poke_name + ' level 25, CP ' + args[1]);
            }
            suffix = 0;
        } else { // Current database don't have this case
            embed.setTitle('Quest/Raid/Egg poke ' + poke_name + 'CP ' + args[1]);
            suffix = 1;
        }
        i = 0;
        for (lvl in poke_lvl) {
            stat_array = poke_lvl[lvl];
            no_stat    = stat_array.length;
            if (no_stat == 1 && suffix == 0) {
                stat   = stat_array[0];
                embed.addField('Gotcha:',':point_right: IV=' + stat[0] + '% Atk=' + stat[1] + ' Def=' +  stat[2] + ' Stm=' + stat[3] + ' (HP=' + stat[4] + ')');
            } else {
                for (j=0;j<no_stat;j++) {
                    i++;
                    stat = stat_array[j];
                    embed.addField('Gotcha ' + i + ':',':point_right: IV=' + stat[0] + '% Atk=' + stat[1] + ' Def=' +  stat[2] + ' Stm=' + stat[3] + ' (HP=' + stat[4] + (suffix ? ') (Lvl='+lvl : ')'));
                }
            }
        }
        embed.setTimestamp(new Date());
        embed.setAuthor("Gotcha Mod", "https://i.imgur.com/4DgyfEUs.png");
        embed.setFooter("Made by Gotcha Team !", "https://i.imgur.com/4DgyfEUs.png");
        embed.setThumbnail("https://cdn.discordapp.com/attachments/367295988546666509/531445440697073664/Sun_11.gif");
        message.channel.send(embed);
    }
}
    // Commands

    // Ping
    if (msg === prefix + 'PING') { 

        
        message.channel.send('Ping!'); 
    }

    // Purge
    if (msg.startsWith(prefix + 'PURGE')) { 
       
        async function purge() {
            message.delete(); 

         
            if (!message.member.roles.find("name", "Admin")) { 
                message.channel.send('You need the \`Admin\` role to use this command.'); 
                return; 
            }

            
            if (isNaN(args[0])) {
               
                message.channel.send('Please use a number as your arguments. \n Usage: ' + prefix + 'purge <amount>'); 
               
                return;
            }

            const fetched = await message.channel.fetchMessages({limit: args[0]}); 
            console.log(fetched.size + ' messages Gotcha, deleting...'); 

           
            message.channel.bulkDelete(fetched)
                .catch(error => message.channel.send(`Error: ${error}`)); 

        }

        
        purge(); 

    }

   

    if (msg.startsWith(prefix + 'WEATHER')) {

        weather.find({search: args.join(" "), degreeType: 'F'}, function(err, result) { 
            if (err) message.channel.send(err);

            
            if (result === undefined || result.length === 0) {
                message.channel.send('**Please enter a valid location.**') 
                return;
            }

            // Variables
            var current = result[0].current; 
            var location = result[0].location; 

           
            const embed = new Discord.RichEmbed()
                .setDescription(`**${current.skytext}**`) 
                .setAuthor(`Weather for ${current.observationpoint}`) 
                .setThumbnail(current.imageUrl) 
                .setColor(0x00AE86) 
                .addField('Timezone',`UTC${location.timezone}`, true) 
                .addField('Degree Type',location.degreetype, true)
                .addField('Temperature',`${current.temperature} Degrees`, true)
                .addField('Feels Like', `${current.feelslike} Degrees`, true)
                .addField('Winds',current.winddisplay, true)
                .addField('Humidity', `${current.humidity}%`, true)

               
                message.channel.send({embed});
        });
    }

    
    if (msg.startsWith(prefix + 'HOOK')) { 

        
        message.delete();

        if (msg === prefix + 'HOOK') { 
            return hook(message.channel, 'Hook Usage', `${prefix}hook <title>, <message>, [HEXcolor], [avatarURL]\n\n**<> is required\n[] is optional**`,'FC8469','https://cdn4.iconfinder.com/data/icons/global-logistics-3/512/129-512.png') // Remeber that \n means new line. This is also using a custom HEX id, and an image.
        }

        let hookArgs = message.content.slice(prefix.length + 4).split(","); 

        hook(message.channel, hookArgs[0], hookArgs[1], hookArgs[2], hookArgs[3]); 
    }

   
    if (msg.startsWith(prefix + 'HELP')) {

        
        if (msg === `${prefix}HELP`) { 

           
            const embed = new Discord.RichEmbed()
                .setColor(0xFF99CC)

            // Variables
            let commandsGotcha = 0; 

            
            for (var cmd in commands) { 

               
                if (commands[cmd].group.toUpperCase() === 'USER') {
                    
                    commandsGotcha++
                   
                    embed.addField(`${commands[cmd].name}`, `**Describe:** ${commands[cmd].desc}\n**Use:** ${prefix + commands[cmd].usage}`); 
                }

            }


            embed.setFooter(`Gotcha user commands. To see another group do typing ${prefix}help [group / command]`)
            embed.setDescription(`**${commandsGotcha} Cen Gotcha** - <> => Required, [] => No required`)

           
            message.author.send({embed})
         
            message.channel.send({embed: {
                color: 0xFF99CC,
                description: `**Check Inbox ${message.author} Handsome!**`
            }})

            

        } else if (args.join(" ").toUpperCase() === 'GROUPS') {

            // Variables
            let groups = '';

            for (var cmd in commands) {
                if (!groups.includes(commands[cmd].group)) {
                    groups += `${commands[cmd].group}\n`
                }
            }

            message.channel.send({embed: {
                description:`**${groups}**`,
                title:"Groups",
                color: 0x00FF00,
            }})

            return; 


        } else {
           

            
            let groupGotcha = '';

            for (var cmd in commands) { 

                if (args.join(" ").trim().toUpperCase() === commands[cmd].group.toUpperCase()) {
                    groupGotcha = commands[cmd].group.toUpperCase(); 
                    break;
                }

            }

            if (groupGotcha != '') { 

                
                const embed = new Discord.RichEmbed()
                    .setColor(0x00FF00) 

                
                let commandsGotcha = 0; 


                for (var cmd in commands) {

                   
                    if (commands[cmd].group.toUpperCase() === groupGotcha) {
                       
                        commandsGotcha++
                        
                        embed.addField(`${commands[cmd].name}`, `**Describe:** ${commands[cmd].desc}\n**Use:** ${prefix + commands[cmd].usage}`); // This will output something like <commandname>[title] [newline] desc: <description> [newline] usage: <usage
                    }

                }

                
                embed.setFooter(`Gotcha ${groupGotcha} command. To see another group do ${prefix}help [group / command]`)
                embed.setDescription(`**${commandsGotcha} Cen Gotcha** - <> => Required, [] => No Required.`)

                
                message.author.send({embed})
               
                message.channel.send({embed: {
                    color: 0x00FF00,
                    description: `**Check Inbox ${message.author} Handsome!**`
                }})

                
                return; 

                
            }

            

            // Variables
            let commandGotcha = '';
            let commandDesc = '';
            let commandUsage = '';
            let commandGroup = '';

            for (var cmd in commands) { 

                if (args.join(" ").trim().toUpperCase() === commands[cmd].name.toUpperCase()) {
                    commandGotcha = commands[cmd].name; 
                    commandDesc = commands[cmd].desc;
                    commandUsage = commands[cmd].usage;
                    commandGroup = commands[cmd].group;
                    break;
                }

            }

            // Lets post in chat if nothing is Gotcha!
            if (commandGotcha === '') {
                message.channel.send({embed: {
                    description:`**There are no groups or commands \`${args.join(" ")}\` found with title, you can type -help for more details.**`,
                    color: 0x00FF00,
                }})

            }

           
            message.channel.send({embed: {
                title:'<>  Require, [] No require',
                color: 0x00FF00,
                fields: [{
                    name:commandGotcha,
                    value:`**Describe:** ${commandDesc}\n**Use:** ${commandUsage}\n**Item:** ${commandGroup}`
                }]
            }})

            return;

        }

    }

});


bot.on('ready', () => {

    // We can post into the console that the bot launched.
    //console.log('Cen Đẹp Troai Runing')
    //bot.user.setStatus('Online')
    //bot.user.setGame('Gotcha Mod');
    //bot.user.setGame('Hello', 'https://www.youtube.com/watch?v=5GL9JoH4Sws');
    console.log(`Cen Đẹp Troai Runing, with ${bot.users.size} users, in ${bot.channels.size} channels of ${bot.guilds.size} guilds.`); 

    bot.user.setActivity(` ${bot.guilds.size} Gotcha Mod Use`);

});
// server status 
bot.on('guildMemberAdd', member => {

    if (member.guild.id !== serverStats.guildID) return;

    bot.channels.get(serverStats.totalUserID).setName(`Tổng Số Người : ${member.guild.memberCount}`);
    bot.channels.get(serverStats.memberCountID).setName(`Số Lượng Thành Viên : ${member.guild.members.filter(m => !m.user.bot).size}`);
    bot.channels.get(serverStats.botCountID).setName(`Số Lượng Bot : ${member.guild.members.filter(m => m.user.bot).size}`);

});

bot.on('guildMemberRemove', member => {
    if (member.guild.id !== serverStats.guildID) return;

    bot.channels.get(serverStats.totalUserID).setName(`Tổng Số Người : ${member.guild.memberCount}`);
    bot.channels.get(serverStats.memberCountID).setName(`Số Lượng Thành Viên  : ${member.guild.members.filter(m => !m.user.bot).size}`);
    bot.channels.get(serverStats.botCountID).setName(`Số Lượng Bot : ${member.guild.members.filter(m => m.user.bot).size}`);
    
});
//member join
bot.on('guildMemberAdd', member => {
    console.log('User' + member.username + 'Join Gotcha Team')
 
    var role = member.guild.roles.find('name', 'New Gotcha');
 
 });
bot.login(process.env.BOT_TOKEN);
