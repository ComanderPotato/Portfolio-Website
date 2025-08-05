const skills: Array<[string, string]> = [
	["JavaScript", "javascript_logo.svg"],
	["TypeScript", "typescript_logo.svg"],
	["Python", "python_logo.svg"],
	["Java", "java_logo.svg"],
	["C++", "cpp_logo.svg"],
	["C#", "csharp_logo.svg"],
	["Swift", "swift_logo.svg"],
	["SwiftUI", "swiftui_logo.svg"],
	["React", "react_logo.svg"],
	[".NET", "dotnet_logo.svg"],
	["Node.js", "nodejs_logo.svg"],
	["Flask", "flask_logo.svg"],
	["FastAPI", "fastapi_logo.svg"],
	// ["TensorFlow", "tensorflow_logo.svg"],
	["PyTorch", "pytorch_logo.svg"],
	// ["Firebase", "firebase_logo.svg"],
	["MySQL", "mysql_logo.svg"],
	// ["MongoDB", "mongodb_logo.svg"],
	["Three.js", "threejs_logo.svg"],
	["Git", "git_logo.svg"],
	// ["npm", "npm_logo.svg"],
	["HTML", "html_logo.svg"],
	["CSS", "css_logo.svg"],
	// ["Figma", "figma_logo.svg"],
	// ["GitHub", "github_logo.svg"],
] as const;

type SkillName = (typeof skills)[number][0];

interface Project {
	type: "Project" | "Assignment";
	image: string;
	title: string;
	skills: SkillName[];
	about: string;
	sourceCode: string;
}
const projects: Project[] = [
	{
		type: "Project",
		image: "./assets/images/solar_system_card_image.png",
		title: "Solar System Simulation (In-Progress)",
		skills: ["Typescript", "ThreeJS", "Python", "Flask"],
		about: "A 3D interactive simulation of our solar system, designed to help users visualise planetary motion, orbits, and celestial dynamics in an engaging, educational way. The simulation pulls real astronomical data from the Solar System OpenData API to accurately model planetary and lunar orbits, axial tilt, and distances. A Python backend was developed to fetch, cache, and serve this data, while performance optimisations like caching and asset bundling ensure smooth web delivery. Currently undergoing a full refactor, with plans to migrate the backend to FastAPI and expand the simulation with UI panels, clickable objects, and deep-linking capabilities for specific planets.",
		sourceCode: "https://github.com/ComanderPotato/solar-system",
	},
	{
		type: "Assignment",
		image: "./assets/images/trash_drone_detection_application_card.jfif",
		title: "Drone Trash Detection Application",
		skills: ["Python", "PyTorch", "TKinter"],
		about: "A desktop application that uses deep learning to identify and highlight trash in drone footage, aimed at improving environmental monitoring efficiency. Developed in a team of two, with a focus on model training and backend functionality. The YOLOv8 model was trained on custom datasets, and integrated with OpenCV for live object detection. A Tkinter-based GUI allows users to analyse both real-time webcam feeds and pre-recorded MP4 videos in an intuitive interface. The project explored the practical application of computer vision in sustainability-focused use cases.",
		sourceCode: "https://github.com/ComanderPotato/Drone-detection-application",
	},
	{
		type: "Assignment",
		image: "./assets/images/assignment_planner_card_image.png",
		title: "Assignment Planner",
		skills: ["C#", ".NET", "MySQL"],
		about: "An application that allows students to plan out their upcoming semester assignment timetable in a clean, easy-to-use way. The planner tracks assignment due dates, notes, grades for individual tasks, and calculates overall subject grades automatically. It was designed to assist students with time management and academic progress tracking, reducing stress and uncertainty around assessment outcomes. Built with a strong focus on usability and future extensibility, the application currently stores data locally, with plans to implement cloud sync and user authentication via Firebase.",
		sourceCode: "https://github.com/ComanderPotato/Assignment-Planner",
	},
	{
		type: "Project",
		image: "./assets/images/weather_app_card_image.png",
		title: "Weather Application",
		skills: ["Swift", "SwiftUI"],
		about: "A sleek and responsive weather application that provides real-time weather updates and location-based forecasts. Developed in collaboration with a small team, with a personal focus on the underlying logic and data handling. The app uses the WeatherAPI to fetch current and forecasted weather data, which is presented using modern SwiftUI components. Glassmorphism-inspired UI elements were implemented to enhance user experience with a polished, modern aesthetic. The project was designed for iOS devices and emphasised clarity, simplicity, and accessibility.",
		sourceCode: "https://github.com/ComanderPotato/WeatherAppV2",
	},
];

const navDesktop = document.querySelector(".nav__desktop") as HTMLDivElement;
const navMobile = document.querySelector(".nav__mobile") as HTMLDivElement;
const sectionArr = document.querySelectorAll("section") as NodeListOf<HTMLElement>;
const timelineEl = document.querySelector(".timeline__bar") as HTMLDivElement;
// const skillsCards = document.querySelectorAll(".skills__card") as NodeListOf<HTMLDivElement>;
const skillsCards = initialiseSkills();
initialiseProjects();
let delay = getComputedStyle(document.documentElement).getPropertyValue("--delay");

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
				});
			}
		});
	},
	{
		threshold: 0.5,
	},
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
	},
);
(document.querySelectorAll(".projects__image") as NodeListOf<HTMLDivElement>).forEach((image) =>
	lazyLoader.observe(image),
);

function getElementRatio(element: HTMLElement): number {
	return (
		element.getBoundingClientRect().height /
		(document.documentElement.scrollHeight - document.documentElement.clientHeight)
	);
}

sectionArr.forEach((el) => {
	sectionObserver.observe(el);
});

function getHeightPercentage(section: HTMLElement): number {
	return (section.getBoundingClientRect().height / document.documentElement.scrollHeight) * 100;
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
	}" style='height: ${isDesktop ? `${getHeightPercentage(element)}%` : `auto`}'>
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
		if (scrollY >= sectionTop - 200) {
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
	const listItems = document.querySelectorAll(".timeline__list-item") as NodeListOf<HTMLLIElement>;
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
		(document.documentElement.scrollHeight - document.documentElement.clientHeight);
	timelineEl.style.height = `${100 * scrollPercentage}%`;
}

(function (): void {})();

function initialiseSkills(): NodeListOf<HTMLDivElement> {
	const skillsRow = document.querySelector(".row") as HTMLDivElement;
	for (const skill of skills) {
		console.log(skill);

		skillsRow.innerHTML += skillsTemplate(skill);
	}

	return document.querySelectorAll(".skills__card") as NodeListOf<HTMLDivElement>;
}
function initialiseProjects(): void {
	const projectsContainer = document.querySelector(".projects__container") as HTMLDivElement;
	for (const project of projects) {
		projectsContainer.innerHTML += projectTemplate(project);
	}
}
function skillsTemplate(skill: [string, string]): string {
	return `
          <div class="skills__card">
            <div class="skills__card-wrapper">
              <img src="./assets/svgs/${skill[1]}" alt="${skill[0]} Logo" />
            </div>
            <div class="skills__card-text">
              <span>${skill[0]}</span>
            </div>
          </div>

`;
}
function projectTemplate(project: Project): string {
	const skills = project.skills.map((skill) => `<span class="chip chip--${skill.toLowerCase()}">${skill}</span>`);
	return `
            <div class="projects__item">
                <div class="wrapper">
                    <div class="projects__image" data-src="${project.image}"></div>
                </div>
                <div class="projects__content">
                    <span>${project.type}</span>
                    <h2>${project.title}</h2>
                    <div class="projects__chips">
                        ${skills.join("")}
                    </div>
                    <h3>About</h3>
                    <p>
                        ${project.about}
                    </p>
                    <div class="projects__links">
                        <a
                            href="${project.sourceCode}"
                            target="_blank"
                            class="projects__links-git"
                        >
                            <img src="assets/svgs/github_logo.svg" class="project__svg" alt="" />
                            <span>Source Code</span></a
                        >
                    </div>
                </div>
            </div>`;
}
function init() {
	activeNav();
	fillTimeLine();
}
init();
