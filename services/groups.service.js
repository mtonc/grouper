import { log } from "../util/logger.js";
import catchAsync from "../util/catchAsync.js";
import StorageService from "./storage.service.js";

class GroupsService {
	static colors = [
		"grey",
		"blue",
		"red",
		"yellow",
		"green",
		"pink",
		"purple",
		"cyan",
		"orange",
	];

	static addTabToGroup = catchAsync(async (group, tabId) => {
		const tabGroup = await GroupsService.#findGroupByName(group.name);
		if (tabGroup.length) {
			chrome.tabs.group(
				{
					groupId: tabGroup[0].id,
					tabIds: tabId,
				},
				() => StorageService.modifyTabIds(tabId, true)
			);
		} else {
			log("creating new group");
			chrome.tabs.group(
				{
					tabIds: tabId,
				},
				(groupId) => {
					StorageService.modifyTabIds(tabId);
					GroupsService.#updateGroup(groupId, group);
				}
			);
		}
	});

	static #findGroupByName = catchAsync(
		async (title) => await chrome.tabGroups.query({ title })
	);

	static #findGroupById = catchAsync(
		async (groupId) => await chrome.tabGroups.get(groupId)
	);

	static findAndUpdate = catchAsync(async (group) => {
		const tabGroups = await GroupsService.#findGroupByName(group.name);
		if (tabGroups.length) {
			await GroupsService.#updateGroup(tabGroups[0].id, group);
		}
	});

	static #updateGroup = catchAsync(async (groupId, group) => {
		const tabGroup = await GroupsService.#findGroupById(groupId);
		if (tabGroup) {
			chrome.tabGroups.update(tabGroup.id, {
				title: group.name,
				color: group.color,
			});
		}
		log("Group updated;");
	});
}

export default GroupsService;
