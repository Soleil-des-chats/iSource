const sourceURL = "https://therealfoxster.github.io/altsource/data/apps.json";

// Back button
document.getElementById("back")?.addEventListener("click", () => history.back(1));

// Add to AltStore banner
document.getElementById("top").insertAdjacentHTML("afterbegin", `
<div class="uibanner">
	<img src="https://user-images.githubusercontent.com/705880/65270980-1eb96f80-dad1-11e9-9367-78ccd25ceb02.png" alt="altstore-icon" class="icon">
	<div class="content">
		<div class="text-container">
			<p class="title-text">AltStore <span class="small beta badge"></span></p>
			<p class="detail-text">
				Add this source to AltStore to receive app updates (requires AltStore beta)
			</p>
		</div>
		<a href="altstore://source?url=${sourceURL}">
			<button>Add</button>
		</a>
	</div>
</div>`);

const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig; // https://stackoverflow.com/a/8943487
function formatString(string) {
	if (!string) return undefined;

	// URLs
	const urlArray = string.match(urlRegex);
	const urlSet = [...new Set(urlArray)]; // Converting to set to remove duplicates
	urlSet.forEach(url => string = string.replaceAll(url, `<a href="${url}">${url}</a>`));

	// New lines
	return string.replaceAll("\n", "<br>");
}

function waitForAllImagesToLoad() {
	const allImages = document.querySelectorAll("img");
	var count = 0;

	allImages.forEach(image => {
		// New img element that won't be rendered to the DOM
		var newImage = document.createElement("img");
		// Attach load listener
		newImage.addEventListener("load", imageLoaded);
		// Set src
		newImage.src = image.src;
	})

	function imageLoaded() {
		if (++count == allImages.length) {
			document.querySelector("body").classList.remove("loading");
			document.getElementById("loading").remove();
		}
	}
}

function setTintColor(color) {
	document.querySelector(':root').style.setProperty("--accent-color", `#${color}`);
}

function addNavigationBar(title) {
	document.getElementById("top").insertAdjacentHTML("beforeend", `
	<div id="nav-bar">
		<button id="back" type="button">
			<i class="bi bi-chevron-left"></i>
			Back
		</button>
		<div id="title">
			<p>${title ?? ""}</p>
		</div>
		<button id="back" class="hidden">
			<i class="bi bi-chevron-left"></i>
			Back
		</button>
	</div>`);
	document.getElementById("back")?.addEventListener("click", () => history.back(1));
}

function newsItemHTML(news, apps, minimal) {
	let html = `
	<div class="news-item-wrapper">`;

	if (news.url) html += `
		<a href="${news.url}">`;
	html += `
		<div class="item" style="background-color: #${news.tintColor};">
			<div class="text">
				<h3>${news.title}</h3>
				<p>${news.caption}</p>
			</div>`;
	if (news.imageURL && !minimal) html += `
			<div class="image-wrapper">
				<img src="${news.imageURL}">
			</div>`;
	html += `
		</div>`;
	if (news.url) html += 
		"</a>";

	if (news.appID && !minimal) {
		const app = apps.find(app => app.bundleIdentifier == news.appID);
		if (app) html += appHeaderHTML(app);
	}

	html += "</div>";

	return html;
}

function appHeaderHTML(app) {
	return `
	<div class="item">
		<div class="app-header">
			<div class="content">
				<img src="${app.iconURL}" alt="">
				<div class="right">
					<div class="text">
						<p class="title">${app.name}</p>
						<p class="subtitle">${app.developerName}</p>
					</div>
					<a href="app.html?id=${app.bundleIdentifier}">
					<button class="uibutton" style="background-color: #${app.tintColor};">View</button>
					</a>
				</div>
			</div>
			<div class="background" style="background-color: #${app.tintColor};"></div>
		</div>
	</div>`;
}