
const Discord = require("discord.js");
const weather = require('weather-js');
const fs = require('fs');
const client = new Discord.Client();


const commands = JSON.parse(fs.readFileSync('Storage/commands.json', 'utf8'));
const pokeList = fs.readFileSync('commands/poke++.txt','utf8');
const AbsolQuest = fs.readFileSync('commands/Absol.txt','utf8');
const searchquest = fs.readFileSync('commands/Searchquest.txt','utf8');
const welcome = fs.readFileSync('commands/welcome.txt','utf8');


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
//~

 
const config  = require("./config.json");
const poke_db = require("./gen_name_cp_iv_raidboss_egg_quest.json");


client.on("ready", () => {

  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 

  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildCreate", guild => {

  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {

  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});


client.on("message", async message => {
    let msg = message.content.toUpperCase();
    let sender = message.author; 
    let cont = message.content.slice(prefix.length).split(" ");
//poke++ 
if (msg === 'POKE++' || msg === prefix + 'POKEGO2'){
    message.channel.send(pokeList)
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

    if(message.content.indexOf(config.prefix) !== 0) return;
    

    if(message.author.bot) return;
    

    const args = message.content.slice(config.prefix.length).trim().toLowerCase().split(/ +/g);
    const command = args.shift();

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
                       
                        embed.addField(`${commands[cmd].name}`, `**Mô Tả:** ${commands[cmd].desc}\n**Sử dụng:** ${prefix + commands[cmd].usage}`); 
                    }
    
                }
    
    
                embed.setFooter(`Hiện đang hiển thị các lệnh người dùng. Để xem một nhóm khác làm gõ ${prefix}help [group / command]`)
                embed.setDescription(`**${commandsGotcha} lệnh được tìm thấy** - <> => bắt buộc, [] => ko bắt buộc`)
    
               
                message.author.send({embed})
             
                message.channel.send({embed: {
                    color: 0xFF99CC,
                    description: `**Đọc Inbox đi ${message.author} Đẹp Troai!**`
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
                            
                            embed.addField(`${commands[cmd].name}`, `**Mô Tả:** ${commands[cmd].desc}\n**Sử Dụng:** ${prefix + commands[cmd].usage}`); // This will output something like <commandname>[title] [newline] desc: <description> [newline] usage: <usage
                        }
    
                    }
    
                    
                    embed.setFooter(`Hiện đang hiển thị ${groupGotcha} lệnh. Để xem một nhóm khác làm ${prefix}help [group / command]`)
                    embed.setDescription(`**${commandsGotcha} lệnh được tìm thấy** - <> => có nghĩa là bắt buộc, [] => có nghĩa là tùy chọn .`)
    
                    
                    message.author.send({embed})
                   
                    message.channel.send({embed: {
                        color: 0x00FF00,
                        description: `**Đọc Inbox đi ${message.author} Đẹp Troai!**`
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
                        description:`**Không có nhóm hoặc lệnh \`${args.join(" ")}\` được tìm thấy có tiêu đề,bạn có thể gõ check.help để biết thêm chi tiết.**`,
                        color: 0x00FF00,
                    }})
    
                }
    
               
                message.channel.send({embed: {
                    title:'<>  bắt buộc, [] ko bắt buộc',
                    color: 0x00FF00,
                    fields: [{
                        name:commandGotcha,
                        value:`**Mô tả:** ${commandDesc}\n**Sử dụng:** ${commandUsage}\n**Mục:** ${commandGroup}`
                    }]
                }})
    
                return;
    
            }
    
        }
    
    });
    
    
    client.on('ready', () => {
    
        // We can post into the console that the bot launched.
        console.log('Cen Đẹp Troai Runing')
        client.user.setStatus('Online')
        client.user.setGame('Gotcha Mod');
        //bot.user.setGame('Hello', 'https://www.youtube.com/watch?v=5GL9JoH4Sws');
    
    });
    // server status 
    client.on('guildMemberAdd', member => {
    
        if (member.guild.id !== serverStats.guildID) return;
    
        client.channels.get(serverStats.totalUserID).setName(`Tổng Số Người : ${member.guild.memberCount}`);
        client.channels.get(serverStats.memberCountID).setName(`Số Lượng Thành Viên : ${member.guild.members.filter(m => !m.user.bot).size}`);
        client.channels.get(serverStats.botCountID).setName(`Số Lượng Bot : ${member.guild.members.filter(m => m.user.bot).size}`);
    
    });
    
    client.on('guildMemberRemove', member => {
        if (member.guild.id !== serverStats.guildID) return;
    
        client.channels.get(serverStats.totalUserID).setName(`Tổng Số Người : ${member.guild.memberCount}`);
        client.channels.get(serverStats.memberCountID).setName(`Số Lượng Thành Viên  : ${member.guild.members.filter(m => !m.user.bot).size}`);
        client.channels.get(serverStats.botCountID).setName(`Số Lượng Bot : ${member.guild.members.filter(m => m.user.bot).size}`);
        
    });
    //member join
    client.on('guildMemberAdd', member => {
        console.log('User' + member.username + 'Join Gotcha Team')
     
        var role = member.guild.roles.find('name', 'New Gotcha');
    //oke iv
    if (command === "iv") {
        poke_name = args[0].charAt(0).toUpperCase() + args[0].slice(1);
        if (poke_db[args[0]] === undefined) {
            message.channel.send('Pokemon not found');
        } else if (poke_db[args[0]] !== undefined && poke_db[args[0]][args[1]] === undefined) {
            if (Number(args[1]) > 0) {
                message.channel.send('Cannot found Raid/Egg/Quest ' + poke_name + ' with CP=' + args[1]);
            } else {
                message.channel.send('CP is not correct number');
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
            embed.setAuthor("Gotcha Mod", "https://i.imgur.com/KEp12Kc.png");
            embed.setFooter("Made by Gotcha Team ✔", "https://i.imgur.com/KEp12Kc.png");
            embed.setThumbnail("https://i.imgur.com/EOnPmfh.png");
            message.channel.send(embed);
        }
    }
});
client.login(config.token);