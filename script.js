window.addEventListener("DOMContentLoaded", start)
window.addEventListener("DOMContentLoaded", disp)

const apikey = "	5e956ce0436377171a0c22fc";
const url = "https://exercise-ea67.restdb.io/rest/chatsystem";

async function start() {
    let arrayis = [];
    const messages = await fetch(url, {
        method: "get",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "x-apikey": apikey,
            "cache-control": "no-cache"
        }
    }).then(e => e.json())
        .then(e => retu(e));


    function retu(e) {
        arrayis.push(e)
    }
    return arrayis;
}

async function disp() {
    const e = await start();
    e[0].forEach(t => {
        const temp = document.querySelector("template").content;
        const clone = temp.cloneNode(true);
        const mess = clone.querySelector("[data-message]");
        mess.dataset.messageID = t.id;
        mess.textContent = t.body;
        const depo = document.querySelector(".messages")
        depo.appendChild(clone)
    })
}

async function displayPost() {
    const po = await start().then(z => {
        const messages = document.querySelectorAll("[data-message]")
        let messageid = [];
        messages.forEach(e => {

            messageid.push(e.dataset.messageID)
        });
        let poarr = [];
        z[0].forEach(e2 => {
            poarr.push(e2.id.toString())
        })

        const array3 = poarr.filter(function (obj) { return messageid.indexOf(obj) == -1; });
        z[0].forEach(e5 => {

            if (array3 == e5.id.toString()) {
                const temp = document.querySelector("template").content;
                const clone = temp.cloneNode(true);
                const mess = clone.querySelector("[data-message]");
                mess.dataset.messageID = e5.id;
                mess.textContent = e5.body;
                const depo = document.querySelector(".messages")
                depo.appendChild(clone)
            }
        });
    })
}
document.querySelector(".chatfrom").addEventListener("submit", async function (event) {
    event.preventDefault();
    const data = {
        body: this.querySelector("textarea").value
    }
    const postData = JSON.stringify(data);
    fetch(url, {
        method: "post",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "x-apikey": apikey,
            "cache-control": "no-cache"
        },
        body: postData
    })
    await displayPost();
}, false);

