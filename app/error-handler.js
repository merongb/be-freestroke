exports.handleMongoErrors = (err, req, res, next) => {
	if (err && err._message && err._message.includes('Review validation failed')) {
		return res.status(400).send({ message: "Bad request" });
	}
	if (err && err.errors && err.errors.location_id && err.errors.location_id.path === 'location_id' && err.errors.location_id.reason && err.errors.location_id.reason.code === 'ERR_ASSERTION') {
		return res.status(400).send({ message: "Bad request" });
	}
	if (err && err.name === 'CastError' && err.kind === 'Number') {
		return res.status(400).send({ message: "Bad Request" });
	}
	next(err);
};

exports.handleErrors = (err, req, res, next) => {
	if (err.status) {
		res.status(err.status).send({ message: err.message });
	} else {
		next(err);
	}
};
