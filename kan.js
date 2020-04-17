window.addEventListener("DOMContentLoaded", startkan)
window.addEventListener("DOMContentLoaded", dispkan)

const urlKanban = "https://exercise-ea67.restdb.io/rest/kanban";
const urlCards = "https://exercise-ea67.restdb.io/rest/cards"
async function startkan() {
    console.log("hello")
    let Kanarrayis = [];
    await fetch(urlKanban, {
        method: "get",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "x-apikey": apikey,
            "cache-control": "no-cache"
        }
    }).then(e => e.json())
        .then(e => retu(e));
    function retu(e) {
        Kanarrayis.push(e)
    }
    return Kanarrayis;
}

async function getCardsAPI() {
    console.log("run check getCardsAPI ")
    let cardrrayis = [];
    await fetch(urlCards, {
        method: "get",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "x-apikey": apikey,
            "cache-control": "no-cache"
        }
    }).then(e => e.json())
        .then(e => retu(e));
    function retu(e) {
        cardrrayis.push(e)
    }
    return cardrrayis;
}

async function dispkan() {
    await startkan().then(e => {
        e[0].forEach(e => {
            const temp = document.querySelector(".KanbanTemp").content;
            const clone = temp.cloneNode(true);
            const section = clone.querySelector(".Kansection");
            section.dataset.KanbanSection = e.Header;
            section.dataset.kanbanId = e.d;
            const header = clone.querySelector(".kanhead")
            header.textContent = e.Header;
            const kandepo = document.querySelector(".main")
            kandepo.appendChild(clone)
        })
    }).then(getcards);
}
async function getcards(what, form) {
    console.log("run check getcards(what, form) ")
    await getCardsAPI().then(e => {
        console.log(e)
        let cardidArr = [];
        let APIidArr = [];
        e[0].forEach(et => {
            if (what == "update") {
                const cards = document.querySelectorAll(".card");
                cards.forEach(c => {
                    cardidArr.push(c.dataset.cardid)
                })
                APIidArr.push(et.id.toString())
            } else if (what == null) {
                const temp = document.querySelector(".cardTemp").content;
                const clone = temp.cloneNode(true);
                const cardText = clone.querySelector(".cardText");
                const card = clone.querySelector(".card");
                card.dataset.cardid = et.id;
                cardText.textContent = et.Title;
                const kan = document.querySelector(`[data--kanban-section ="` + et.Kanban + `"]`)
                kan.querySelector(".carContainer").appendChild(clone)
            }
        })

        const array5 = APIidArr.filter(function (obj) { return cardidArr.indexOf(obj) == -1; });

        if (what == "update") {
            console.log("what == update")
            e[0].forEach(ey => {
                array5.forEach(se => {
                    if (ey.id == se) {
                        const temp = document.querySelector(".cardTemp").content;
                        const clone = temp.cloneNode(true);
                        const cardText = clone.querySelector(".cardText");
                        const card = clone.querySelector(".card");
                        card.dataset.cardid = ey.id;
                        cardText.textContent = ey.Title;
                        const kan = document.querySelector(`[data--kanban-section ="` + ey.Kanban + `"]`)
                        kan.querySelector(".carContainer").appendChild(clone)
                    }
                })
            })
            const inputs = document.querySelectorAll("textarea");
            inputs.forEach(e => {
                e.value = "";
            })
        }
    }).then(addplus).then(e => {
        if (what == "update") {
            for (let i = 0; i < form.length; i++) {
                form[i].disabled = false;
            }
        }
    })
};

function addplus() {
    console.log("run check addplus() ")
    const kanban = document.querySelectorAll(".Kansection");
    kanban.forEach(e => {
        if (e.querySelector(".card") != undefined) {
            const cardf = e.querySelector(`[data-form="addcardForm"]`);
            cardf.querySelector("textarea").setAttribute("placeholder", "Add another card");
        }
    })
    listenforCards();
}



const hover = function () {
    const btn = this.querySelector(".edit")
    btn.classList.remove("hidden")
}
const out = function () {
    const btn = this.querySelector(".edit")
    btn.classList.add("hidden")
}
const fixheight = function () {
    this.style.height = '20px';
    const computed = window.getComputedStyle(this);
    const height = parseInt(computed.getPropertyValue('border-top-width'), 10)
        + parseInt(computed.getPropertyValue('padding-top'), 10)
        + this.scrollHeight
        + parseInt(computed.getPropertyValue('padding-bottom'), 10)
        + parseInt(computed.getPropertyValue('border-bottom-width'), 10);

    this.style.height = height + 'px';

};
const openedidmodule = function () {
    console.log(this.parentElement.queryselector("p").textContent)
}


function listenforCards() {
    console.log("run check listenforCards() ")
    const addCforms = document.querySelectorAll(`[data-form="addcardForm"]`)
    addCforms.forEach(e => {
        e.addEventListener("submit", function (event) {
            console.log("is it here")
            event.preventDefault();
            val = this.querySelector("textarea").value;
            this.querySelector("textarea").value = "";
            const form = this.getElementsByTagName("*")

            for (let i = 0; i < form.length; i++) {
                form[i].disabled = true;
            }
            const data = {
                Title: val,
                Kanban: this.parentElement.dataset.KanbanSection
            }
            const postData = JSON.stringify(data);
            fetch(urlCards, {
                method: "post",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                    "x-apikey": apikey,
                    "cache-control": "no-cache"
                },
                body: postData
            })
            getcards("update", form);
        }, false);

    })

    const card = document.querySelectorAll(`.card`)
    card.forEach(e => {
        e.addEventListener("mouseover", e = hover)
    })
    card.forEach(e => {
        e.addEventListener("mouseleave", e = out)
    })
    const addCformsheihgt = document.querySelectorAll(`.cardText`)
    addCformsheihgt.forEach(e => {
        e.addEventListener("input", e = fixheight)
    })
    const edidbtn = document.querySelectorAll("[data-edidbtn]");
    edidbtn.forEach(e => {
        e.addEventListener("click", openedidmodule)
    })
};

