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

// DISCLAIMER:
// panels are dated by their Current Epoch Unix Timestamp!

const template_tweet = document.getElementById("template_tweet");
const template_fanart = document.getElementById("template_fanart");

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
        console.log("Global JSON undefined; fetching...")
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
        console.error("Failed to find arc by ID; aborting...")
    } else {
        var requested = document.getElementById(selected);
        var all = document.getElementById("twt");
        for (container of all.children) {
            container.style.display = "none";
        }
        if (requested) {
            requested.style.display = "contents";
        } else {
            for (arc of JSON.arcs) {
                if (arc.id == selected) {
                    await twitter(arc);
                    break;
                }
            }
        }
        for (arc of JSON.arcs) {
            if (arc.id == selected) {
                document.getElementById("description").innerHTML = arc.description;
                break;
            }
        }
    }
}
async function twitter(arc) {
    var container = document.createElement("div");
    container.id = arc.id;
    for (panel of arc.panels) {
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
                            elm                 = document.createElement("video");
                            src                 = document.createElement("source");
                            src.src             = archive + arc.directory + file;
                            src.type            = "video/mp4";
                            elm.appendChild(src);
                            elm.controls        = true;
                            elm.muted           = true;
                            elm.autoplay        = true;
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
            if (panel == arc.panels[0]) {
                clone.id = arc.id;
            }
            container.appendChild(clone)
    }
    document.getElementById("twt").appendChild(container);
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

const fanartArea = document.getElementById("fanart");
async function fanartHandlr() {
    var data    = await getJSON();

    for (artist of data.fanart.artists) {
        for (art of data.fanart.art[artist[0]]) {
            var clone   = document.importNode(template_fanart.content, true);
            var body    = clone.querySelector("article");
            var media   = body.querySelector("img");
            var link    = body.querySelector("a");
            var label   = body.querySelector("label");
            if (art.slice(-3) == "mov" || art.slice(-3) == "mp4") {
                body.removeChild(media);
                var video           = document.createElement("video");
                    video.controls  = true;
                    video.muted     = true;
                    video.autoplay  = true;
                    video.loop      = true;
                    video.preload   = "none";
                    video.loading   = "lazy";
                    video.classList.add("gold");
                var source          = document.createElement("source");
                source.src          = d.fanart + art;
                video.appendChild(source);
                body.insertBefore(video, link);
            } else {
                media.src = d.fanart + art;
            }
            

            link.href = artist[1];
            label.innerHTML = "@" + artist[0];

            fanartArea.appendChild(clone);
        }
    }
}

function loadPage(page) {
    switch (page) {
        case "tweets":
            twitterHandlr("win7");
            document.getElementById("arcSelect").addEventListener("change", (event) => {
                var option = event.target.value;
                twitterHandlr(option);
            })
            break;
        case "fanart":
            fanartHandlr();
            break;
    }
}
