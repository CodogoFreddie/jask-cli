import windowSize from "window-size";

import processTasksForRendering from "./processTasksForRendering";
import generateColumnRenderingInfo from "./generateColumnRenderingInfo";
import renderTasksToString from "./renderTasksToString";

export default config => tasks => {
	const { width, height, } = windowSize.get();

	const renderReadyTasks = processTasksForRendering({
		config,
		height,
	})(tasks);

	const columnWidths = generateColumnRenderingInfo(config)(renderReadyTasks);

	return renderTasksToString({
		width,
		height,
		renderReadyTasks,
		columnWidths,
	});
};
