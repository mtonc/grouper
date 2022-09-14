import catchAsync from "./util/catchAsync.js";
import StorageService from "./services/storage.service.js";
import GroupsService from "./services/groups.service.js";
import { logError } from "./util/logger.js";

chrome.tabs.onCreated.addListener((tab) => addTabToGroup(tab));
chrome.tabs.onUpdated.addListener((tabId, changed, tab) =>
	shouldUpdateBasedOnChanged(changed, tabId)
		.then(() => addTabToGroup(tab))
		.catch((err) => logError(err))
);
chrome.tabs.onRemoved.addListener((tabId) =>
	StorageService.modifyTabIds(tabId, "remove")
);

const addTabToGroup = catchAsync(async (tab) => {
	const { id, groupId, url } = tab;
	if (groupId !== -1 || url === undefined) return;

	const tabIds = await StorageService.getTabIds();
	if (tabIds.includes(id)) return;

	const group = await StorageService.findGroupByUrl(url);

	if (group) {
		await GroupsService.addTabToGroup(group, id);
	}
});

const shouldUpdateBasedOnChanged = (changed, id) => {
	const { title, url, groupId, status, favIconUrl } = changed;
	return new Promise((resolve, reject) => {
		if (groupId && groupId === -1) {
			StorageService.modifyTabIds(id, "remove");
			reject(false);
		} else if (
			title !== undefined ||
			favIconUrl !== undefined ||
			(status && status === "complete")
		) {
			reject(false);
		} else if (status && status === "loading" && url && url !== "") {
			resolve(true);
		}
	});
};
