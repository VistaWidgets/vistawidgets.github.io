const jsonPeople = [
    "Vastina",
    "The Bunkerbots"
]
const archive = "archive/";
const d = {
    assets:     archive + "assets/",
    fanart:     archive + "fanart/",
    renders:    archive + "renders/",
    twitter:    archive + "twitter/",
    wips:       archive + "wips/",
    misc:       archive + "misc/",
}
const fanart = {
    cider       : d.fanart + "cider/",
    dr_right2   : d.fanart + "dr_right2",
    edgar       : d.fanart + "edgar/",
    jenny       : d.fanart + "jenny/",
    koi         : d.fanart + "koi/",
    lovevirus   : d.fanart + "lovevirus/",
    orion       : d.fanart + "orion/",
    qu3stion    : d.fanart + "qu3stion/",
    starlade    : d.fanart + "starlade/",
    superdave938: d.fanart + "superdave938/",
    viewplus    : d.fanart + "viewplus/",
    vista       : d.fanart + "vista/",
    wuh         : d.fanart + "wuh/",
}

// DISCLAIMER:
// panels are dated by their Current Epoch Unix Timestamp!

const template_tweet = document.getElementById("template_tweet");

const siteMap = new Map();
siteMap.set("home",     "index.html");
siteMap.set("tweets",   "tweets.html");
siteMap.set("assets",   "assets.html");
siteMap.set("fanart",   "fanart.html");
siteMap.set("accounts", "accounts.html");

siteMap.set("vastina",      "https://x.com/VistaWidgets");
siteMap.set("tina",         "https://x.com/VistaWidgetOFFT");
siteMap.set("drone",        "https://x.com/computerlings");
siteMap.set("strawpage",    "https://vistawidgets.straw.page/");
siteMap.set("boundaries",   "https://vistawidgets.straw.page/ooc");
siteMap.set("gmod",   "https://steamcommunity.com/sharedfiles/filedetails/?id=3717482414");
function linkTo(pageName) { // of course I could just use <a> but this lets me add my own logic....... -D
    var page = siteMap.get(pageName);
    if (page) {
        window.location.href = siteMap.get(pageName);
    } else {
        console.error("Page is invalid!");
        // could do something here on-page if page doesn't exist anymore...
        return false;
    }
    
}
var twemojis = new Map()
twemojis.set("\u00F0\u009F\u009F\u00A7", "1f7e7") // orange
twemojis.set("\u00F0\u009F\u0092\u009C", "1f49c") // purple
twemojis.set("\u00F0\u009F\u009F\u00A2", "1f7e2") // green

var JSON                = undefined;
var characters          = undefined;
const characterTemplate   = {
    name    : undefined,
    account : undefined,
    themes  : undefined,
    pfp     : undefined,
}
async function getJSON() {
    if (JSON === undefined) {
        console.log("DRONE [getJSON()]: Global JSON undefined; fetching...")
        const RESPONSE  = await fetch("archive/archive.json");
        JSON            = await RESPONSE.json();
    }
    return JSON;
}
async function readCharacters() {
    var data = await getJSON();
    if (characters === undefined) {
        console.log("Character list undefined; reading JSON data...")
        characters  = new Object();
        for (character of JSON.characters) {
            if (characters[character.name] !== undefined && characters[character.name] !== null) {
                console.log(character.name + " is already registered!")
                continue;
            } else {
                var list = Object.create(characterTemplate);
                list.account                = character.account;
                list.pfp                    = character.pfp;
                list.themes                 = character.themes;
                characters[character.name]  = list;
            }
        }
    }
    return characters;
}
async function twitterHandlr(selected) {
    await readCharacters();
    if (typeof characters != "object") {
        console.error("Failed to get characters; aborting...");
        return;
    }
    if (selected === undefined || selected === null) {
        for (arc of JSON.arcs) {
            await twitter(arc);
        }
    } else {
        for (arc of JSON.arcs) {
            switch (typeof selected) {
                case "array":
                    for (id of selected) {
                        if (arc.id == id) {
                            await twitter(arc);
                        } else {
                            continue;
                        }
                    }
                    break;
                default:
                    if (arc.id == selected) {
                        await twitter(arc);
                    }
                    break;
            }
        };

        //for (arcID of selected) {
        //    await twitter(arc);
        //}
    }

}
async function twitter(arc) {
    for (panel of arc.panels) {
            if (panel.breakpoint == true) {
                return;
            }
            var clone   = document.importNode(template_tweet.content, true);
            var tweet   = clone.querySelector(".tweet");
            
            var avatar  = tweet.querySelector(".avatar").querySelector("img");
            var header  = tweet.querySelector("header").querySelector("a");
            var name    = header.querySelector("b");
            var handle  = header.querySelector("span");
            var main    = tweet.querySelector("main");
            var text    = main.querySelector(".text");
            var media   = main.querySelector(".media");
            var time    = main.querySelector(".time");

            var deco    = main.querySelector(".decoratives");
            header.href     = "https://x.com/" + characters[panel.from].account
            name.innerHTML  = panel.from;
            if (arc.theme && characters[panel.from].themes) {
            // if a theme is defined, AND the character even *has* themes...
                avatar.src      = characters[panel.from].themes[arc.theme];
            } else {
                avatar.src      = characters[panel.from].pfp;
            }
            
            handle.innerHTML= "@" + characters[panel.from].account;
            
            if (panel.text !== null) {
                var processing = panel.text.replaceAll("\n", "<br>");
                twemojis.forEach((value, key, map) => {
                    if (processing.includes(key)) {
                        processing = processing.replaceAll(key, '<img class="emoji" src="assets/twemoji/' + value + '.svg">')
                    } // Completely ridiculous way to go about it, but it gets good results...
                })
                text.innerHTML = processing;
            }
            if (panel.file !== null && panel.file.length != 0) {
                deco.style.marginTop = "5px";
                for (file of panel.file) {
                    var filetype = file.slice(-4);
                    var elm;
                    switch (filetype) {
                        case ".mp4":
                            elm = document.createElement("video");
                            src = document.createElement("source");
                            src.src = archive + arc.directory + file;
                            src.type = "video/mp4";
                            elm.appendChild(src);
                            elm.controls = true;
                            elm.muted = true;
                            elm.autoplay = true;
                            break;
                        case ".png":
                        case ".jpg":
                        case ".gif":
                            elm = document.createElement("img");
                            elm.src = archive + arc.directory + file;
                            break;
                    }
                    elm.loading = "lazy";
                    elm.preload = "none";
                    media.appendChild(elm);
                }
            }
            if (panel.unix !== null) {
                time.innerHTML = await unixHandlr("twitter", panel.unix)
            }
            document.getElementById(arc.id).appendChild(clone)
    }
    return true;
}
const months = {
        0   : "Jan",
        1   : "Feb",
        2   : "Mar",
        3   : "Apr",
        4   : "May",
        5   : "Jun",
        6   : "Jul",
        7   : "Aug",
        8   : "Sep",
        9   : "Oct",
        10  : "Nov",
        11  : "Dec"
    }
async function unixHandlr(format, unix) {
    switch (format) {
        case "twitter":
            var date    = new Date(unix * 1000);
            var hours   = date.getHours();
            var minutes = date.getMinutes();
            var year    = date.getFullYear();
            var month   = date.getMonth();
            var day     = date.getDate();
            var offset  = (Math.floor(date.getTimezoneOffset() / 60)) * -1;

            
            if (minutes < 10) {
                minutes = "0" + minutes;
            }
            if (hours < 10) {
                hours = "0" + hours;
            }

            return months[month] + " " + day + " " + year + " " + hours + ":" + minutes + " (UTC" + offset + ")";
    }
};