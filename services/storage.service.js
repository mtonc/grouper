import catchAsync from "../util/catchAsync.js";
import { log, logError } from "../util/logger.js";
import GroupsService from "./groups.service.js";

class StorageService {
	static getGroups = () => {
		return new Promise((resolve, reject) => {
			chrome.storage.sync.get(["grouper:groups"], function (data) {
				if (chrome.runtime.lastError) {
					logError(chrome.runtime.lastError);
					resolve([]);
				}
				if (data["grouper:groups"] && data["grouper:groups"].groups) {
					const { groups } = data["grouper:groups"];
					resolve(groups);
				}
				resolve([]);
			});
		});
	};

	static saveGroups = (groups) => {
		StorageService.getGroups()
			.then((oldGroups) => {
				oldGroups.forEach((old) => {
					const found = groups.find(
						(g) => old.name === g.name || old.url === g.url
					);
					if (found) {
						GroupsService.findAndUpdate(found);
					}
				});
			})
			.catch((err) => logError);

		return new Promise((resolve, reject) => {
			chrome.storage.sync.set({ "grouper:groups": { groups } }, function () {
				const { lastError } = chrome.runtime;
				if (lastError) {
					logError(lastError);
					reject(false);
				}
				log("Groups Saved");
				resolve(true);
			});
		});
	};

	static findGroupByUrl = catchAsync(async (url) => {
		const groups = await StorageService.getGroups();
		const group = groups.find((g) => {
			const re = new RegExp(`^${g.url}/?.*`);
			return re.test(url);
		});
		return group;
	});

	static getTabIds = () => {
		return new Promise((resolve, reject) => {
			chrome.storage.sync.get(["grouper:tabIds"], function (data) {
				if (chrome.runtime.lastError) {
					logError(chrome.runtime.lastError);
					resolve([]);
				}
				if (data.grouperTabs && data.grouperTabs.tabIds) {
					const { tabIds } = data.grouperTabs;
					resolve(tabIds);
				}
				resolve([]);
			});
		});
	};

	static #saveTabIds = (tabIds) =>
		chrome.storage.sync.set(
			{ "grouper:tabIds": { tabIds: [...tabIds] } },
			function () {
				log("Saved TabIds");
			}
		);

	static modifyTabIds = catchAsync(async (tabId, action = "add") => {
		let newIds = [];
		const oldIds = await StorageService.getTabIds();
		switch (action) {
			case "add":
				if (oldIds.includes(tabId)) return;
				log("Saving TabId");
				newIds = [...oldIds, tabId];
				break;
			case "remove":
				if (!ids.includes(tabId)) return;
				log("Removing Id");
				oldIds.splice(
					oldIds.findIndex((id) => id === tabId),
					1
				);
				newIds = oldIds;
				break;
			default:
				log(
					`${action} is not a valid argument. Please select 'add' or 'remove'.`
				);
		}
		StorageService.#saveTabIds(newIds);
	});
}

export default StorageService;
