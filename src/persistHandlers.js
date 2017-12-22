import jsonfile from "jsonfile";
import mkdir from "make-dir";
import recursive from "recursive-readdir";
import R from "ramda";

export default config => ({
	listActions: () =>
		new Promise((done, fail) => {
			recursive(config.dataFolder, (err, files) => {
				err
					? fail(err)
					: done(
						files.map(R.replace(config.dataFolder + "/", "")) ||
								[],
					);
			});
		}),

	readAction: filename =>
		new Promise((done, fail) =>
			jsonfile.readFile(
				config.dataFolder + "/" + filename,
				(err, dat) => (err ? fail(err) : done(dat)),
			),
		),

	writeAction: action => {
		const folder =
			config.dataFolder.replace(/\/?$/, "/") +
			"/" +
			action.meta.task.uuid;
		const filename = folder + "/" + action.meta.timestamp;

		return mkdir(folder).then(() =>
			jsonfile.writeFile(filename, action, {
				spaces: 2,
			}),
		);
	},
});
