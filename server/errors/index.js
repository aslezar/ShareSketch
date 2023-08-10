const CustomAPIError = require('./coustom-error');
const BadRequestError = require('./bad-request');
const UnauthenticatedError = require('./unauthorized');
const NotFoundError = require('./not-found');

module.exports = {
    CustomAPIError,
    BadRequestError,
    UnauthenticatedError,
    NotFoundError
};
