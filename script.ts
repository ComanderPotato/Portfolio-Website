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
          if (li.classList.contains("nav__desktop-item")) {
            li.classList.toggle("nav__desktop--active", entry.isIntersecting);
          } else {
            li.classList.toggle("nav__mobile--active", entry.isIntersecting);
          }
        }
      });
    });
  },
  {
    threshold:
      window.innerWidth >= 1200
        ? 0.7
        : window.innerWidth >= 800
        ? 0.5
        : window.innerWidth >= 600
        ? 0.35
        : 0.3,
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
    rootMargin: "500px",
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

function fillTimeLine(): void {
  let scrollPercentage =
    (document.documentElement.scrollTop + document.body.scrollTop) /
    (document.documentElement.scrollHeight -
      document.documentElement.clientHeight);
  timelineEl.style.height = `${100 * scrollPercentage}%`;
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
function getHeightPercentage(section: HTMLElement) {
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
      isDesktop ? "nav__desktop-item" : "nav__mobile-item"
    }" style='height: ${
      isDesktop ? `${getHeightPercentage(element)}%` : `auto`
    }'>
      <a href="#${element.id}">${element.children[0].textContent}</a>
    </li>
    `;
  }
})();
let isDesktop = true;
`${isDesktop ? "nav__desktop-item" : "nav__mobile-item"}`;
