import getConfig from "./config";
import createPersistHandlers from "./persistHandlers";
import { initaliseJask, setPersistHandlers, runQuery, } from "jask-core";

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
			console.log(runQuery(args.join(" "))),
		);
	})
	.catch(console.error);
