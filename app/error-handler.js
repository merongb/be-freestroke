exports.handleMongoErrors = (err, req, res, next) => {
	if (err.name === 'CastError' && err.kind === 'Number') {
		return res.status(400).send({ message: "Bad Request" });
	}
	if (err.errors.location_id.path === 'location_id' && err.errors.location_id.reason.code === 'ERR_ASSERTION') {
		return res.status(400).send({ message: "Invalid ID" });
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
