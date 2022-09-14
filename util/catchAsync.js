import { logError } from "./logger.js";

const catchAsync = (fn) => {
	try {
		return async (...args) => await fn(...args);
	} catch (err) {
		logError(err);
	}
};

export default catchAsync;
