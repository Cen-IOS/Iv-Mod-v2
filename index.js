
const Discord = require("discord.js");


const client = new Discord.Client();


const config  = require("./config.json");
const poke_db = require("./gen_name_cp_iv_raidboss_egg_quest.json");

client.on("ready", () => {

  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 

  client.user.setActivity(` ${client.guilds.size} Gotcha Mod Use`);
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

    if(message.content.indexOf(config.prefix) !== 0) return;
    

    if(message.author.bot) return;
    

    const args = message.content.slice(config.prefix.length).trim().toLowerCase().split(/ +/g);
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
            embed.setAuthor("Gotcha Mod", "https://i.imgur.com/KEp12Kc.png");
            embed.setFooter("Made by Gotcha Team ✔", "https://i.imgur.com/KEp12Kc.png");
            embed.setThumbnail("https://i.imgur.com/EOnPmfh.png");
            message.channel.send(embed);
        }
    }
});

client.login(process.env.BOT_TOKEN);
