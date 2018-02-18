/**
 * API Response main model
 *
 * @param (int) _status         Response status
 * @param (mixed) _errorcode    Response error code
 * @param (string) _error       Response message
 * @param (object) _data       Response message
 *
 * @return (void)
 */
function apiResponse(_status, _errorcode, _error, _data) {
	this.status = _status;
	this.errorcode = _errorcode;
	this.errortext = _error;
	this.data = _data;
}

// Export the class
module.exports = apiResponse;
