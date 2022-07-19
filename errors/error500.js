const ApiError = require("./config/apiError");
const httpStatusCode = require("./config/httpStatusCodes");

class ApiError500 extends ApiError {
  constructor(
    statusCode = httpStatusCode.INTERNAL_SERVER,
    message = "Internal server error... contact support",
    success = false
  ) {
    super(statusCode, success, message);
  }
}
module.exports = ApiError500;
