import fs from "fs";
import R from "ramda";

const dotfilePath = `${require("os").homedir()}/.jaskrc.js`;
let config = null;

export default () =>
	config
		? Promise.resolve(config)
		: new Promise(done => {
			try {
				config = require(dotfilePath);
				done(config);
			} catch (e) {
				if (e.code === "MODULE_NOT_FOUND") {
					const possible =
							"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
					const generateKey = () =>
						R.times(
							() =>
								possible.charAt(
									Math.floor(
										Math.random() * possible.length,
									),
								),
							128,
						).join("");

					fs.writeFile(
						dotfilePath,
						`module.exports = {
	dataFolder: \`${require("os").homedir()}/.jaskActions\`,
	server: {
		port: 9000,
		key: "${generateKey()}",
	},
	client: {
		userHTTPServer: false,
		rendering: {
			//these will eventually be depricated, in favour of storing such things in the action store.
			//this will allow for universal cross clien config
			giveScore: ({ now, }) => ({ uuid, due, created, updated, done, tags, project, priority, }) => {
				return (
					due ? Math.pow(10, ( ( now - due ) / 4320000000 ) + 1) : 0
					+
					priority ? ( ({ H: 10, M: 5, L: -2 })[priority] || 0 ) : 0
				);
			},
			filterTask: ({ done, }) => !done,
			giveColor: ({ now, }) => ({ due, priority, }) => ([
				//use any color keywork from the chalk styling library:
				// [chalk](https://github.com/chalk/chalk)
				//any expressions that evaluate to false are ignored,
				//styled are applied in presidence from this order.
				(
					(now > due) 
					? {
						fn: "hex",
						val: "#f00",
					}
					: false
				),

				(
					priority
					? {
						fn: "keyword",
						val: ( ({ H: "green", M: "yellow", L: "grey", })[priority] ),
					}
					: false
				),
			]),
			headers: [
				"score",
				"id",
				"description",
				"due",
				"tags",
				"priority",
				"project",
				"depends",
				"recur",
			],
		}
	},
}`,
						() => {
							console.log(
								`created a config file at ${dotfilePath}`,
							);
							config = require(dotfilePath);
							done(config);
						},
					);
				}
			}
		});
