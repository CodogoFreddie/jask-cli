import R from "ramda";
import { initaliseJask, setPersistHandlers, runQuery, } from "jask-core";

import getConfig from "./config";
import createPersistHandlers from "./persistHandlers";
import render from "./render";

const [_, __, ...args] = process.argv;

getConfig()
	.then(config => {
		const { listActions, readAction, writeAction, } = createPersistHandlers(
			config,
		);

		setPersistHandlers({
			listActions,
			readAction,
			writeAction,
		});

		return initaliseJask().then(() =>
			R.pipe(R.join(" "), runQuery, render(config), console.log)(args),
		);
	})
	.catch(console.error);
