"use strict";
const headersEl = document.querySelector(".timeline__headers");
const sectionArr = document.querySelectorAll("section");
const timelineEl = document.querySelector(".timeline__bar");
const skillsCards = document.querySelectorAll(".skills__card");
let delay = getComputedStyle(document.documentElement).getPropertyValue("--delay");
let delayDefault = 0;
let transitionDefault = 0;
skillsCards.forEach((card) => {
    card.style.transition = `scale 200ms ease-in-out, opacity 500ms ease-in-out ${(delayDefault += 400)}ms`;
});
document.addEventListener("scroll", fillTimeLine);
const sectionObserver = new IntersectionObserver((entries) => {
    const liEl = document.querySelectorAll("li");
    entries.forEach((entry) => {
        let entryTarget = entry.target;
        if (entryTarget.dataset.title === "skills" && entry.isIntersecting) {
            skillsCards.forEach((card) => {
                card.classList.add("skills__card-active");
            });
        }
        liEl.forEach((li) => {
            if (li.dataset.title === entryTarget.dataset.title) {
                li.classList.toggle("active", entry.isIntersecting);
            }
        });
    });
}, { threshold: 0.5 });
const images = document.querySelectorAll(".projects__image");
const lazyLoader = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        let entryTarget = entry.target;
        if (entry.isIntersecting) {
            entryTarget.style.backgroundImage = `url(${entryTarget.dataset.src})`;
        }
    });
}, {
    rootMargin: "500px",
});
images.forEach((image) => lazyLoader.observe(image));
function getElementRatio(element) {
    return (element.getBoundingClientRect().height /
        (document.documentElement.scrollHeight -
            document.documentElement.clientHeight));
}
sectionArr.forEach((el) => {
    sectionObserver.observe(el);
});
const ul = document.createElement("ul");
headersEl.insertAdjacentElement("afterbegin", ul);
sectionArr.forEach((el) => {
    let markup = `
  <li data-title=${el.dataset.title}>
    <a href="#${el.id}">${el.children[0].textContent}</a>
  </li>
  `;
    ul.insertAdjacentHTML("beforeend", markup);
});
function fillTimeLine() {
    let scrollPercentage = (document.documentElement.scrollTop + document.body.scrollTop) /
        (document.documentElement.scrollHeight -
            document.documentElement.clientHeight);
    timelineEl.style.height = `${100 * scrollPercentage}%`;
}
