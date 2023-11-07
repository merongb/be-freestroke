// Error Handling
exports.handleMongoErrors = (err, req, res, next) => {
	if (err.name === 'CastError' && err.kind === 'Number') {
		return res.status(400).send({ message: "Bad Request" });
	}
	next(err)
};

exports.handleErrors = (err, req, res, next) => {
	if (err.status) {
		res.status(err.status).send({ message: err.message });
	} else {
		next(err);
	}
};
