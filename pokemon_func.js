var list_cpm   = [0.094000000, 0.135137432, 0.166397870, 0.192650919, 0.215732470, 0.236572661, 0.255720050, 0.273530381, 0.290249880, 0.306057377, 0.321087600, 0.335445036, 0.349212680, 0.362457751, 0.375235590, 0.387592406, 0.399567280, 0.411193551, 0.422500010, 0.432926419, 0.443107550, 0.453059958, 0.462798390, 0.472336083, 0.481684950, 0.490855800, 0.499858440, 0.508701765, 0.517393950, 0.525942511, 0.534354330, 0.542635767, 0.550792690, 0.558830576, 0.566754520, 0.574569153, 0.582278910, 0.589887917, 0.597400010, 0.604818814, 0.612157290, 0.619399365, 0.626567130, 0.633644533, 0.640652950, 0.647576426, 0.654435630, 0.661214806, 0.667934000, 0.674577537, 0.681164920, 0.687680648, 0.694143650, 0.700538673, 0.706884210, 0.713164996, 0.719399090, 0.725571552, 0.731700000, 0.734741009, 0.737769480, 0.740785574, 0.743789430, 0.746781211, 0.749761040, 0.752729087, 0.755685510, 0.758630378, 0.761563840, 0.764486065, 0.767397170, 0.770297266, 0.773186500, 0.776064962, 0.778932750, 0.781790055, 0.784636970, 0.787473578, 0.790300010, 0.79311]; // from matlab: lvl1 -> 40.5
var list_candy = [1,   1,   1,   1,   1,   1,   1,   1,   1,    1,    2,    2,    2,    2,    2,    2,    2,    2,    2,    2,    3,    3,    3,    3,    3,    4,    4,    4,    4,    4,    6,    6,    8,    8,    10,   10,   12,   12,   15,    15];
var list_dust  = [200, 200, 400, 400, 600, 600, 800, 800, 1000, 1000, 1300, 1300, 1600, 1600, 1900, 1900, 2200, 2200, 2500, 2500, 3000, 3000, 3500, 3500, 4000, 4000, 4500, 4500, 5000, 5000, 6000, 6000, 7000, 7000, 8000, 8000, 9000, 9000, 10000, 10000];

// lvl : 2->80
// stats : [att, def, sta]
function cal_cp(stats, iv, lvl) {
    cpm = list_cpm[lvl - 2];
    //cp = max(10,floor(att*sqrt(def)*sqrt(sta)*ecpm*ecpm/10));
    return Math.max(10, Math.floor((stats[0] + iv[0]) * Math.pow((stats[1] + iv[1]) * (stats[2] + iv[2]), 0.5) * cpm * cpm * 0.1));
}

function cal_hp(stats, iv, lvl) {
    cpm = list_cpm[lvl - 2];
    //hp = max(10,floor(sta*ecpm));
    return Math.max(10, Math.floor((stats[2] + iv[2]) * cpm));
}

function candy_lvl(lvl) {
    if (lvl > 80) lvl = 80;
    if (lvl < 2) lvl = 2;
    return list_candy[Math.floor(lvl / 2 - 1)];
}

function dust_lvl(lvl) {
    if (lvl > 80) lvl = 80;
    if (lvl < 2) lvl = 2;
    return list_dust[Math.floor(lvl / 2 - 1)];
}

function gen_db (stats) {
    var db = {}, lvl, att_iv, def_iv, sta_iv;
    [15,20,25].forEach( lvl => {
        for (att_iv = 10; att_iv < 16; att_iv++) {
            for (def_iv = 10; def_iv < 16; def_iv++) {
                for (sta_iv = 10; sta_iv < 16; sta_iv++) {
                    cp = cal_cp(stats,[att_iv,def_iv,sta_iv],lvl*2);
                    hp = cal_hp(stats,[att_iv,def_iv,sta_iv],lvl*2);
                    iv = Math.round((att_iv + def_iv + sta_iv)/0.45);
                    if (db[cp]      === undefined) db[cp]      = {};
                    if (db[cp][lvl] === undefined) db[cp][lvl] = [];
                    db[cp][lvl].push([iv,att_iv,def_iv,sta_iv,hp]);
                    //console.log([cp,lvl,iv,att_iv,def_iv,sta_iv,hp]);
                }
            }
        }
    })
    for (cp in db) {
        for (lvl in db[cp]) {
            db[cp][lvl] = db[cp][lvl].sort().reverse();
        }
    }
    return db;
}

function add_poke (poke_db,name,stats) {
    if (poke_db[name] !== undefined) {
        console.log(`Error: ${name} already in poke_db`);
    } else {
        poke_db[name] = gen_db(stats);
    }
}

function del_poke (poke_db,name,stats) {
    if (poke_db[name] === undefined) {
        console.log(`Error: ${name} is not existed in poke_db`);
    } else {
        delete poke_db[name];
    }
}

function change_stat (poke_db,name,stats) {
    if (poke_db[name] === undefined) {
        console.log(`Error: ${name} is not existed in poke_db`);
    } else {
        delete poke_db[name];
        poke_db[name] = gen_db(stats);
    }
}

module.exports = {
    gen_db      : gen_db,
    cal_cp      : cal_cp,
    cal_hp      : cal_hp,
    add_poke    : add_poke,
    del_poke    : del_poke,
    change_stat : change_stat
}
