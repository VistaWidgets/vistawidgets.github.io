const jsonPeople = [
    "Vastina",
    "The Bunkerbots"
]
const archive = "archive/"
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
siteMap.set("boundaries",   "https://steamcommunity.com/sharedfiles/filedetails/?id=3717482414");
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
async function buildTwitter() {
    const fetch = await fetch("archive/archive.json");
    const JSON = fetch.json();

    // note to self: iterate thru each arc, 
}