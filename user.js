// ==UserScript==
// @name         Soundcloud Anti Repost
// @version      1.2.3
// @author       Redcrafter
// @description  Remove reposts from soundcloud
// @license      MIT
// @include      https://soundcloud.com/stream
// @run-at       document-end
// @namespace    https://github.com/Redcrafter/
// ==/UserScript==

function removeReposts() {
    for (const item of document.querySelectorAll(".soundList__item")) {
        if (item.querySelector(".soundContext__repost")) {
            item.remove();
        }
    }
    if(document.querySelectorAll(".soundList__item").length < 100) {
        window.scrollTo(0, document.body.scrollHeight);
    }
}

// Searches for the playerManager module
function module(e, t, _require) {
    let modules = _require.c;

    for (let moduleid in modules) {
        if (modules.hasOwnProperty(moduleid)) {
            let el = _require(moduleid);

            if (typeof el.playCurrent === 'function') {
                init(el);
                break;
            }
        }
    }
}

function init(playManager) {
    // Inject a function to check for reposts
    let oldSet = playManager.setCurrentItem;
    playManager.setCurrentItem = (e, t) => {
        let r = false;
        try {
            // Not sure if this safe
            r = e._submodels[0]._events["change:user"][1].context.options.actionType === "repost";
        } catch (error) {
            // console.error("An Exception occoured while trying to determine repost status");
        }

        if (r) {
            playManager.removeItem(e);
            playManager.playNext();
        } else {
            oldSet(e, t);
        }
    };

}

setInterval(removeReposts, 500);

// injection our own module
unsafeWindow.webpackJsonp.push([[1000000], { 1000000: module }, [[1000000]]]);
