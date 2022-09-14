import catchAsync from "../util/catchAsync.js";
import StorageService from "../services/storage.service.js";
import ElementFactory from "../services/elementFactory.js";
import { log } from "../util/logger.js";

// global refs to buttons and containing tbody
const inputTable = document.querySelector(".input-table tbody");
const addGroup = document.getElementById("add-group");
const save = document.getElementById("save");

const addRowRemovalListeners = (mutations) => {
	mutations.forEach((m) => {
		// only concered with added rows
		if (!m.removedNodes.length && m.addedNodes.length) {
			m.addedNodes.forEach((node) => {
				// only concerned with table rows
				if (node.tagName === "TR") {
					// get the remove button
					const remove = node.querySelector(".remove-btn");
					if (remove) {
						remove.addEventListener("click", (e) => {
							const { index } = e.target.dataset;
							// get the matching row
							const rowToRemove = inputTable.querySelector(
								`tr[data-index="${index}"]`
							);
							if (rowToRemove) {
								inputTable.removeChild(rowToRemove);
							}
						});
					}
				}
			});
		}
	});
};

const saveData = () => {
	save.classList.toggle("loading");
	const groups = [];
	const urls = Array.from(document.querySelectorAll("input.url-input"));
	const names = Array.from(document.querySelectorAll("input.name-input"));
	const colors = Array.from(document.querySelectorAll("select.color-input"));
	log(urls, names, colors);
	urls.forEach((input, i) => {
		if (input.value.trim() !== "" || names[i].value.trim() !== "") {
			groups.push({
				name: names[i].value.trim(),
				url: input.value.trim(),
				color: colors[i].value,
			});
		}
	});
	StorageService.saveGroups(groups).then((status) => {
		let statusClass = status ? "btn-success" : "btn-error";
		save.classList.toggle("loading");
		save.classList.toggle(statusClass);
		setTimeout(() => {
			save.classList.toggle(statusClass);
		}, 2000);
	});
};

document.addEventListener(
	"DOMContentLoaded",
	catchAsync(async function () {
		const factory = new ElementFactory();
		const config = { childList: true };

		new MutationObserver(addRowRemovalListeners).observe(inputTable, config);
		const groups = await StorageService.getGroups();
		if (groups.length) {
			inputTable.innerHTML = "";
			groups.forEach((g) => factory.createGroupInputs(g, inputTable));
		}

		addGroup.addEventListener("click", () =>
			factory.createGroupInputs({}, inputTable)
		);
		save.onclick = saveData;
	})
);
