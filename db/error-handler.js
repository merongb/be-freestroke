// Error Handling
exports.handleMongoErrors = (err, req, res, next) => {
};

exports.handleErrors = (err, req, res, next) => {
	if (err.status) {
		res.status(err.status).send({ msg: err.msg });
	} else {
		next(err);
	}
};
