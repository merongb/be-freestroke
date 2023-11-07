const fs = require("fs/promises");


exports.getAllEndpoints = (req, res) => {
	return fs.readFile("endpoints.json", "utf-8").then((data) => {
		const allEndpoints = JSON.parse(data);
		res.status(200).send(allEndpoints);
	});
};