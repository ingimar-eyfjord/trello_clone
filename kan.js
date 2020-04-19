window.addEventListener("DOMContentLoaded", startkan)
window.addEventListener("DOMContentLoaded", dispkan)
const urlKanban = "https://exercise-ea67.restdb.io/rest/kanban";
const urlCards = "https://exercise-ea67.restdb.io/rest/cards"
async function startkan() {
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
            section.dataset.kanbanId = e._id;
            const header = clone.querySelector(".kanhead")
            header.textContent = e.Header;
            const kandepo = document.querySelector(".main")
            section.querySelector("form").dataset.formbelongs = e.Header;
            kandepo.appendChild(clone)
        })
    }).then(getcards);
}
async function getcards(what, form) {
    await getCardsAPI().then(e => {
        let cardidArr = [];
        let APIidArr = [];
        e[0].forEach(et => {
            if (what == "update") {
                const cards = document.querySelectorAll(".card");
                cards.forEach(c => {
                    cardidArr.push(c.dataset.cardid)
                })
                APIidArr.push(et._id.toString())
            } else if (what == null) {
                const temp = document.querySelector(".cardTemp").content;
                const clone = temp.cloneNode(true);
                const cardText = clone.querySelector(".cardText");
                const card = clone.querySelector(".card");
                card.dataset.cardid = et._id;
                cardText.textContent = et.Title;
                card.dataset.cardkanban = et.Kanban;
                card.dataset.duedate = et.Due_date;
                card.dataset.cardstate = "rest"
                card.dataset.cardcolor = "none";
                if (!et.Color == "") {
                    const circle = card.querySelector(".colorCircle")
                    circle.style.backgroundColor = et.Color
                    circle.classList.remove("displaynone")
                    card.dataset.cardcolor = et.Color;
                }
                if (et.Due_date != "no") {
                    if (/\S/.test(et.Due_date)) {
                        const clock = card.querySelector(".clock");
                        clock.classList.remove("displaynone")
                        clock.setAttribute("title", et.Due_date)
                        clock.innerHTML += et.Due_date;
                    }
                }
                card.cardtemplate = "active";
                const kan = document.querySelector(`[data--kanban-section ="` + et.Kanban + `"]`)
                kan.querySelector(".carContainer").appendChild(clone)
            }
        })
        const array5 = APIidArr.filter(function (obj) { return cardidArr.indexOf(obj) == -1; });
        if (what == "update") {
            e[0].forEach(ey => {
                array5.forEach(se => {
                    if (ey._id == se) {
                        const temp = document.querySelector(".cardTemp").content;
                        const clone = temp.cloneNode(true);
                        const cardText = clone.querySelector(".cardText");
                        const card = clone.querySelector(".card");
                        card.dataset.cardid = ey._id;
                        cardText.textContent = ey.Title;
                        card.dataset.cardkanban = ey.Kanban;
                        card.dataset.duedate = ey.Due_date;
                        card.cardtemplate = "active";
                        card.dataset.cardcolor = "none";
                        card.dataset.cardstate = "rest"
                        if (!ey.Color == "") {
                            const circle = card.querySelector(".colorCircle")
                            circle.style.backgroundColor = ey.Color
                            circle.classList.remove("displaynone")
                            card.dataset.cardcolor = ey.Color;
                        }
                        if (ey.Due_date != "no") {
                            if (/\S/.test(ey.Due_date)) {
                                const clock = card.querySelector(".clock");
                                clock.classList.remove("displaynone")
                                clock.setAttribute("title", ey.Due_date)
                                card.dataset.duedate = ey.Due_date;
                                clock.innerHTML += ey.Due_date;
                            }
                        }
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
    }).then(listenforCards)
};

async function addplus() {
    const kanban = document.querySelectorAll(".Kansection");
    kanban.forEach(e => {
        if (e.querySelector(".card") != undefined) {
            const cardf = e.querySelector(`[data-form="addcardForm"]`);
            cardf.querySelector("textarea").setAttribute("placeholder", "Add another card");
        }
    })
}
const hover = function () {
    if (this.dataset.cardstate == "rest") {
        const btn = this.querySelector(".edit")
        btn.classList.remove("hidden")
    }
}
const out = function () {
    if (this.dataset.cardstate == "rest") {
        const btn = this.querySelector(".edit")
        btn.classList.add("hidden")
    }
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
    const card = this.parentElement
    const date = card.dataset.duedate;
    const cardcolor = card.dataset.cardcolor;
    card.style.borderRadius = "10px";
    card.dataset.cardstate = "edit"
    const cardp = card.querySelector("p")
    const cardtext = cardp.textContent;
    const formbelongs = this.parentElement.dataset.cardkanban;
    card.innerHTML = "";
    const thisform = document.createElement("form");
    thisform.setAttribute("onsubmit", "formsFuncEdit(event)");
    thisform.dataset.formbelongs = formbelongs;
    thisform.dataset.form = "addcardForm";
    thisform.dataset.formState = "edit";
    thisform.style.backgroundColor = "transparent"
    thisform.dataset.nohover;
    thisform.dataset.colorisset = "";
    thisform.dataset.duedate = "";
    const thisbutton = document.createElement("button");
    thisbutton.dataset.submitBtn;
    thisbutton.setAttribute("type", "submit")
    thisbutton.textContent = " +";
    thisbutton.dataset.modalfunc = "options"
    thisbutton.dataset.modalif = "open"
    thisbutton.classList.add("bigplus")
    thisbutton.style.backgroundColor = "transparent"
    const thisspan = document.createElement("span");
    thisspan.classList.add("input");
    thisspan.setAttribute("role", "textbox");
    thisspan.contentEditable = true;
    thisspan.textContent = cardtext;
    thisspan.style.backgroundColor = "transparent"
    const thisdiv = document.createElement("div");
    thisdiv.dataset.modalfunc = "options"
    thisdiv.classList.add("optionTag");
    thisdiv.textContent = "..."
    thisdiv.style.backgroundColor = "transparent"
    const thisinfodiv = document.createElement("div");
    thisinfodiv.classList.add("infodivs")
    const clock = document.createElement("div");
    clock.classList.add("clock")
    clock.setAttribute("title", date)
    const i = document.createElement("i");
    i.classList.add("fa")
    i.classList.add("fa-clock")
    clock.classList.add("displaynone")
    if (date != "no") {
        if (/\S/.test(date)) {
            clock.classList.remove("displaynone")
        }
    }
    const colorcirlce = document.createElement("div");
    colorcirlce.classList.add("colorCircle")
    if (cardcolor != "none") {
        colorcirlce.style.backgroundColor = cardcolor
    } else {
        colorcirlce.classList.add("displaynone")
    }
    clock.appendChild(i)
    clock.innerHTML += date;
    thisinfodiv.appendChild(clock)
    thisinfodiv.appendChild(colorcirlce)
    card.appendChild(thisinfodiv)
    thisform.appendChild(thisbutton)
    thisform.appendChild(thisspan)
    thisform.appendChild(thisdiv)
    card.prepend(thisform)
    listenforCards()
}
function formsFuncEdit(event) {
    event.preventDefault();
    that = event.target;
    const color = that.dataset.colorisset;
    const dueDate = that.dataset.duedate;
    const payLoad = {
        Title: event.target.querySelector("span").textContent,
        Kanban: event.target.parentElement.dataset.cardkanban,
        Color: color,
        Due_date: dueDate
    };
    const _id = event.target.parentElement.dataset.cardid
    const postData = JSON.stringify(payLoad);
    fetch(`` + urlCards + `/` + _id + ``, {
        method: "put",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "x-apikey": apikey,
            "cache-control": "no-cache"
        },
        body: postData
    })
        .then(res => res.json())
        .then(ey => {
            const where = event.target.parentElement
            const remove = event.target;
            remove.remove()
            const temp = document.querySelector(".cardTemp").content;
            const clone = temp.cloneNode(true);
            const cardText = clone.querySelector(".cardText");
            const card = clone.querySelector(".card");
            card.dataset.cardid = ey._id;
            cardText.textContent = ey.Title;
            card.dataset.cardkanban = ey.Kanban;
            card.dataset.duedate = ey.Due_date;
            card.cardtemplate = "active";
            card.dataset.cardcolor = "none";
            card.dataset.cardstate = "rest"
            if (!ey.Color == "") {
                const circle = card.querySelector(".colorCircle")
                circle.style.backgroundColor = ey.Color
                circle.classList.remove("displaynone")
                card.dataset.cardcolor = ey.Color;
            }
            if (ey.Due_date != "no") {
                if (/\S/.test(ey.Due_date)) {
                    const clock = card.querySelector(".clock");
                    clock.classList.remove("displaynone")
                    clock.setAttribute("title", ey.Due_date)
                    clock.innerHTML += ey.Due_date;
                }
            }
            where.parentNode.insertBefore(clone, where.nextSibling);
            where.remove()
            listenforCards()
        });
}


const option = function () {
    const wrapper = this.parentElement
    const parent = wrapper.parentElement
    const form = parent.dataset.formbelongs
    const seeform = document.querySelectorAll("form")
    seeform.forEach(e => {
        if (e.dataset.formbelongs == form) {
            if (e.dataset.orignalform == "yes") {
                if (this.dataset.option == "setcolor") {
                    const circle = e.querySelector(".colorCircle");
                    e.addEventListener("mouseover", a => {
                        circle.classList.remove("displaynone")
                    })
                    e.addEventListener("mouseleave", b => {
                        circle.classList.add("displaynone")
                    })
                    circle.style.backgroundColor = this.value;
                    e.dataset.colorisset = this.value
                }
                if (this.dataset.option == "setdate") {
                    const clock = e.querySelector(".clock");
                    e.addEventListener("mouseover", a => {
                        clock.classList.remove("displaynone")
                    })
                    e.addEventListener("mouseleave", b => {
                        clock.classList.add("displaynone")
                    })
                    e.dataset.duedate = this.value
                }
            } else {
                const formparent = e.parentElement;
                const circle = formparent.querySelector(".colorCircle");
                if (this.dataset.option == "setcolor") {
                    if (circle.classList.contains("displaynone")) {
                        circle.classList.remove("displaynone")
                    }
                    circle.style.backgroundColor = this.value;
                    e.dataset.colorisset = this.value
                }
                if (this.dataset.option == "setdate") {
                    e.dataset.duedate = this.value
                    const clock = e.parentElement.querySelector(".clock");
                    clock.classList.remove("displaynone")
                }
            }
        }
    })
}

const modalfunction = function () {
    const x = event.pageX;
    const y = event.pageY;
    const thisModal = document.querySelector(`.` + this.dataset.modalfunc + ``);
    thisModal.dataset.modalbelongs = this.parentElement.parentElement.dataset.cardid
    thisModal.style.top = y + "px";
    thisModal.style.left = x + "px";

    if (this.dataset.modalif == "open") {
        if (!thisModal.classList.contains("displaynone"))
            thisModal.classList.add("displaynone");
    }
    else {
        if (thisModal.classList.contains("displaynone"))
            thisModal.classList.remove("displaynone");
        else {
            thisModal.classList.add("displaynone");
        }
        thisModal.dataset.formbelongs = this.parentElement.dataset.formbelongs

        document.querySelector(".colorval").addEventListener("change", e = option)
        document.querySelector(".dateval").addEventListener("change", e = option)
    }
    if (this.parentElement.parentElement.dataset.cardstate == "edit") {
        const deleted = thisModal.querySelector(".deleteC");
        deleted.classList.remove("displaynone")
    } else {
        const deleted = thisModal.querySelector(".deleteC");
        deleted.classList.add("displaynone")
    }
}



function listenforCards() {
    const card = document.querySelectorAll(`.card`)

    card.forEach(e => {
        if (e.dataset.cardstate == "rest") {
            e.addEventListener("mouseover", e = hover)
        }
    })
    card.forEach(e => {
        if (e.dataset.cardstate == "rest") {
            e.addEventListener("mouseleave", e = out)
        }
    })

    const addCformsheihgt = document.querySelectorAll(`.cardText`)
    addCformsheihgt.forEach(e => {
        e.addEventListener("input", e = fixheight)
    })
    const edidbtn = document.querySelectorAll("[data-edidbtn]");
    edidbtn.forEach(e => {
        e.addEventListener("click", openedidmodule)
    })
    const modal = document.querySelectorAll(`[data-modalfunc]`);
    modal.forEach(e => {
        e.addEventListener("click", modalfunction)
    });
};

function formsFunc(event) {
    event.preventDefault();
    that = event.target;
    const color = that.dataset.colorisset;
    const dueDate = that.dataset.duedate;
    val = that.querySelector("textarea").value
    that.querySelector("textarea").value = "";
    const form = that.getElementsByTagName("*")
    for (let i = 0; i < form.length; i++) {
        form[i].disabled = true;
    }
    const data = {
        Title: val,
        Kanban: that.parentElement.dataset.KanbanSection,
        Color: color,
        Due_date: dueDate
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
    }, false);
    getcards("update", form);
    that.dataset.colorisset = "";
    that.dataset.duedate = "";
    that.style.backgroundColor = "transparent";
    for (let i = 0; i < form.length; i++) {
        form[i].style.backgroundColor = "transparent";
    }
}


const deletefunc = function () {
    deletefuncAPI(urlCards, this.parentElement.parentElement.dataset.modalbelongs)
}
document.querySelector(`[data-deletebutton]`).addEventListener("click", e = deletefunc)

function deletefuncAPI(url, id) {
    console.log(id.toString())
    console.log(`` + url + `/` + id.toString() + ``)
    fetch(url + "/" + id.toString(), {
        method: "delete",
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'x-apikey': apikey,
            "cache-control": "no-cache"
        }
    })
        .then(removeCard(id))
}
function removeCard(id) {
    const card = document.querySelector(`[data-cardid="` + id + `"]`)
    card.remove()
}