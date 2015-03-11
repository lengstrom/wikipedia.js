function WikiRequest(params, caller, cb) {
	var now = Date.now();
	var headers = {
		'User-Agent': caller.opts.USER_AGENT
	};
	this.caller = caller;

	params.format = 'json';
	if (!('action' in params)) {
		params.action = 'query';
	}

	this.send(params, headers);

}

WikiRequest.prototype.send = function(params, headers) {
	if (!this.caller.opts.RATE_LIMIT || !this.caller.opts.RATE_LIMIT_LAST_CALL || now - this.caller.opts.RATE_LIMIT_LAST_CALL > this.caller.opts.RATE_LIMIT_MIN_WAIT) {
		var requestOptions = {
			'url':this.caller.opts.API_URL,
			'headers':headers,
			'followRedirect':true,
			'qs':params,
			'useQuerystring':true
		};

		request(requestOptions, function (error, response, body) {
			if (error) {
				cb(error);
			} else {
				var raw_results = JSON.parse(body);
				if ('error' in body) {
					if (['HTTP request timed out.', 'Pool queue is full'].index(raw_results.error.info)) {
						//HTTPTimeOutError
					}
					else {
						// WikipediaException
						// show w raw_results['error']['info']
					}
				} else {
					cb(false, raw_results);
				}
			}
		});
	} else {
		// call it later
		setTimeout(this.send, now - this.caller.opts.RATE_LIMIT_LAST_CALL);
	}
};