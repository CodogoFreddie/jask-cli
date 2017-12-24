import R from "ramda";
import { toDate, formatDistanceStrictWithOptions, } from "date-fns/fp";

const map = R.addIndex(R.map);

const sigFig = sf => x => parseFloat(x.toPrecision(sf), 10);

const filterTasks = config => R.filter(config.client.rendering.filterTask);

const addRenderingMetaToTasks = config => {
	const giveScore = R.pipe(
		config.client.rendering.giveScore({
			now: new Date().getTime(),
		}),
		sigFig(3),
	);
	const giveColor = config.client.rendering.giveColor({
		now: new Date().getTime(),
	});

	return map((task, i) => ({
		...task,
		i,
		score: giveScore(task),
		color: giveColor(task),
	}));
};

const formatDateDistance = R.pipe(
	toDate,
	formatDistanceStrictWithOptions({
		addSuffix: true,
	})(new Date()),
);

const addPlusToTags = R.pipe(R.map(x => `+${x}`), R.join(" "));

const stringfiyTasksFields = tasks =>
	R.map(
		R.pipe(
			R.evolve({
				created: formatDateDistance,
				done: formatDateDistance,
				due: formatDateDistance,
				tags: addPlusToTags,
				updated: formatDateDistance,
				wait: formatDateDistance,
				depends: uuid =>
					"" + R.findIndex(R.propEq("uuid", uuid), tasks),
			}),
			({ i, color, score, ...rest }) => ({
				i,
				color,
				score,
				...R.map(x => "" + x, rest),
			}),
		),
	)(tasks);

export default ({ config, height, }) =>
	R.pipe(
		filterTasks(config),
		R.slice(0, height - 4),
		addRenderingMetaToTasks(config),
		stringfiyTasksFields,
		R.sortBy(R.prop("score")),
		R.reverse,
	);
