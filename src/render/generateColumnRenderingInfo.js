import R from "ramda";

const measureColumnWidths = config =>
	R.reduce(
		(columnWidths, task) => ({
			...columnWidths,
			...R.pipe(
				R.toPairs,
				R.filter(([key,]) =>
					R.contains(key, config.client.rendering.headers),
				),
				R.map(([key, value,]) => [
					key,
					Math.max(
						key.length || 0,
						value.length || 0,
						columnWidths[key] || 0,
						0,
					),
				]),
				R.fromPairs,
			)(task),
		}),
		{},
	);

export default config =>
	R.pipe(
		measureColumnWidths(config),
		R.pipe(
			R.toPairs,
			R.map(([label, length,]) => ({
				label,
				length,
			})),
			R.sortBy(({ label, }) =>
				R.findIndex(R.equals(label), config.client.rendering.headers),
			),
		),
	);
