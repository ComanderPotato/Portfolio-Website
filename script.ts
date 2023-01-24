const navDesktop = document.querySelector(".nav__desktop") as HTMLDivElement;
const navMobile = document.querySelector(".nav__mobile") as HTMLDivElement;
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

const paths = document.querySelectorAll(".ass") as NodeListOf<SVGPathElement>;
for (let i = 0; i < paths.length; i++) {
  paths[i].style.strokeDasharray = `${paths[i].getTotalLength()}`;
  paths[i].style.strokeDashoffset = `${paths[i].getTotalLength()}`;
}
paths.forEach((a) => console.log(a.style));
let delayDefault = 0;
let transitionDefault = 0;

skillsCards.forEach((card) => {
  card.style.transition = `scale 200ms ease-in-out, opacity 500ms ease-in-out ${(delayDefault += 400)}ms, transform 400ms ease-in-out ${delayDefault}ms`;
});
document.addEventListener("scroll", fillTimeLine);

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      let entryTarget = entry.target as HTMLDivElement;
      if (entryTarget.dataset.title === "skills" && entry.isIntersecting) {
        skillsCards.forEach((card) => {
          card.classList.add("skills__card--active");
          // console.log(card.children[0].firstElementChild);
        });
      }
    });
  },
  {
    threshold: 0.5,
  }
);
const lazyLoader = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      let entryTarget = entry.target as HTMLDivElement;
      if (entry.isIntersecting) {
        entryTarget.style.backgroundImage = `url(${entryTarget.dataset.src})`;
        lazyLoader.unobserve(entryTarget);
      }
    });
  },
  {
    rootMargin: "200px",
  }
);
(
  document.querySelectorAll(".projects__image") as NodeListOf<HTMLDivElement>
).forEach((image) => lazyLoader.observe(image));

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

function getHeightPercentage(section: HTMLElement): number {
  return (
    (section.getBoundingClientRect().height /
      document.documentElement.scrollHeight) *
    100
  );
}

// Nav builder desktop / mobile
(function () {
  const ulMobile = document.createElement("ul");
  const ulDesktop = document.createElement("ul");
  navDesktop.insertAdjacentElement("afterbegin", ulDesktop);
  navMobile.insertAdjacentElement("afterbegin", ulMobile);
  sectionArr.forEach((element) => {
    let mobileMarkup = createNav(element, false);
    let desktopMarkup = createNav(element, true);
    ulMobile.insertAdjacentHTML("beforeend", mobileMarkup);
    ulDesktop.insertAdjacentHTML("beforeend", desktopMarkup);
  });
  function createNav(element: HTMLElement, isDesktop: boolean): string {
    return `
    <li data-title=${element.dataset.title} class="${
      isDesktop ? "nav__item nav__item--desktop" : "nav__item nav__item--mobile"
    }" style='height: ${
      isDesktop ? `${getHeightPercentage(element)}%` : `auto`
    }'>
      <a href="#${element.id}">${element.children[0].textContent}</a>
    </li>
    `;
  }
})();

window.addEventListener("scroll", activeNav);
function activeNav() {
  const liEl = document.querySelectorAll("li");
  let current: HTMLElement;
  sectionArr.forEach((section) => {
    const sectionTop = section.offsetTop;
    if (scrollY >= sectionTop) {
      current = section;
    }
  });
  liEl.forEach((li) => {
    li.classList.remove("nav__desktop--active");
    li.classList.remove("nav__mobile--active");
    if (li.dataset.title === current.dataset.title) {
      if (li.classList.contains("nav__item--desktop")) {
        li.classList.add("nav__desktop--active");
      } else {
        li.classList.remove("nav__desktop--active");
      }
      if (li.classList.contains("nav__item--mobile")) {
        li.classList.add("nav__mobile--active");
      } else {
        li.classList.remove("nav__mobile--active");
      }
    }
  });
}
window.addEventListener("resize", () => {
  const listItems = document.querySelectorAll(
    ".timeline__list-item"
  ) as NodeListOf<HTMLLIElement>;
  sectionArr.forEach((section) => {
    listItems.forEach((li) => {
      if (section.dataset.title === li.dataset.title) {
        li.style.height = `${getHeightPercentage(section)}%`;
      }
    });
  });
});

function fillTimeLine(): void {
  let scrollPercentage =
    (document.documentElement.scrollTop + document.body.scrollTop) /
    (document.documentElement.scrollHeight -
      document.documentElement.clientHeight);
  timelineEl.style.height = `${100 * scrollPercentage}%`;
}
function init() {
  activeNav();
  fillTimeLine();
}
init();
