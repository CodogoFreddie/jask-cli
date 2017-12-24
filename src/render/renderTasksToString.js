import R from "ramda";
import chalk from "chalk";

const getFullRenderedWidth = columnWidths =>
	columnWidths.length +
	R.reduce((x, { length, }) => x + length, 0, columnWidths);

const padString = (string = "", length) =>
	string + R.times(R.always(""), length - ("" + string).length + 1).join(" ");

const renderRow = ({ renderReadyTasks, columnWidths, }) => (row, y) => {
	const { color, } = renderReadyTasks[y];

	const colors = [
		...color,
		y % 2
			? {
				fn: "bgHex",
				val: "#111",
			}
			: false,
	].filter(Boolean);

	return row
		.map((cell, x) =>
			R.reduce(
				(string, { fn, val, }) => chalk[fn](val)(string),
				padString(cell, columnWidths[x].length) + " ",
				colors,
			),
		)
		.join("");
};

const blockTableData = ({ renderReadyTasks, columnWidths, tabledData, }) =>
	[
		columnWidths
			.map(({ label, length, }) =>
				chalk.underline(padString(label, length)),
			)
			.join(" "),
		...tabledData.map(
			renderRow({
				renderReadyTasks,
				columnWidths,
				tabledData,
			}),
		),
	].join("\n");

export default ({ renderReadyTasks, columnWidths, }) => {
	const tabledData = R.pipe(
		R.map(({ label, }) => R.pluck(label, renderReadyTasks)),
		R.transpose,
	)(columnWidths);

	const blockedTable = blockTableData({
		renderReadyTasks,
		columnWidths,
		tabledData,
	});

	return blockedTable;
};
