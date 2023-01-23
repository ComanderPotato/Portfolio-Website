const headersEl = document.querySelector(
  ".timeline__headers"
) as HTMLDivElement;
const sectionArr = document.querySelectorAll(
  "section"
) as NodeListOf<HTMLElement>;
const timelineEl = document.querySelector(".timeline__bar") as HTMLDivElement;
const skillsCards = document.querySelectorAll(
  ".skills__card"
) as NodeListOf<HTMLDivElement>;
let delay = getComputedStyle(document.documentElement).getPropertyValue(
  "--delay"
);

let delayDefault = 0;
let transitionDefault = 0;
skillsCards.forEach((card) => {
  card.style.transition = `scale 200ms ease-in-out, opacity 500ms ease-in-out ${(delayDefault += 400)}ms`;
});
document.addEventListener("scroll", fillTimeLine);

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const liEl = document.querySelectorAll("li");
    entries.forEach((entry) => {
      let entryTarget = entry.target as HTMLDivElement;
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
  },
  { threshold: window.screen.availWidth >= 1200 ? 0.6 : 0.1 }
);
const images = document.querySelectorAll(
  ".projects__image"
) as NodeListOf<HTMLDivElement>;

const lazyLoader = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      let entryTarget = entry.target as HTMLDivElement;
      if (entry.isIntersecting) {
        entryTarget.style.backgroundImage = `url(${entryTarget.dataset.src})`;
      }
    });
  },
  {
    rootMargin: "500px",
  }
);

images.forEach((image) => lazyLoader.observe(image));
function getElementRatio(element: HTMLElement): number {
  return (
    element.getBoundingClientRect().height /
    (document.documentElement.scrollHeight -
      document.documentElement.clientHeight)
  );
}

sectionArr.forEach((el) => {
  sectionObserver.observe(el);
});

const ul = document.createElement("ul");
headersEl.insertAdjacentElement("afterbegin", ul);
sectionArr.forEach((el) => {
  console.log(getPadding(el));
  let markup = `
  <li data-title=${
    el.dataset.title
  } class="timeline__list-item"style='height: ${getPadding(el)}%'>
    <a href="#${el.id}">${el.children[0].textContent}</a>
  </li>
  `;
  ul.insertAdjacentHTML("beforeend", markup);
});

function fillTimeLine(): void {
  let scrollPercentage =
    (document.documentElement.scrollTop + document.body.scrollTop) /
    (document.documentElement.scrollHeight -
      document.documentElement.clientHeight);
  timelineEl.style.height = `${100 * scrollPercentage}%`;
}
window.addEventListener("resize", () => {
  console.log(window);

  const listItems = document.querySelectorAll(
    ".timeline__list-item"
  ) as NodeListOf<HTMLLIElement>;
  sectionArr.forEach((section) => {
    listItems.forEach((li) => {
      if (section.dataset.title === li.dataset.title) {
        li.style.height = `${getPadding(section)}%`;
      }
    });
  });
});
function getPadding(section: HTMLElement) {
  return (
    (section.getBoundingClientRect().height /
      document.documentElement.scrollHeight) *
    100
  );
}
