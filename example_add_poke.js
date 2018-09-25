const fs      = require("fs");
const Pfunc   = require("./pokemon_func.js");
const poke_db = require("./gen_name_cp_iv_raidboss_egg_quest.json");

Pfunc.add_poke(poke_db,"Deoxys",[345,115,100]);

fs.writeFile('gen_name_cp_iv_raidboss_egg_quest.json', JSON.stringify(poke_db), function (err) {
    if (err) throw err;
    console.log('Saved!');
});
