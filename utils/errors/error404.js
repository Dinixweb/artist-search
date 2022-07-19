const ApiError = require("./config/apiError");
const httpStatusCode = require("./config/httpStatusCodes");

class Api404Error extends ApiError {
  constructor(
    statusCode = httpStatusCode.NOT_FOUND,
    message = "Unable to return data... application down",
    success = false
  ) {
    super(statusCode, success, message);
  }
}

module.exports = Api404Error;
