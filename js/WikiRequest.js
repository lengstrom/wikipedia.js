function WikiRequest(params, caller, cb, err_cb) {
	var now = Date.now();
	var headers = {
		'User-Agent': caller.opts.USER_AGENT
	};

	params['format'] = 'json';
	if !('action' in params) {
		params['action'] = 'query';
	}

	this.send = function() {
		if (!caller.opts.RATE_LIMIT || !caller.opts.RATE_LIMIT_LAST_CALL || now - caller.opts.RATE_LIMIT_LAST_CALL > caller.opts.RATE_LIMIT_MIN_WAIT) {
			var requestOptions = {
				'url':caller.opts.API_URL,
				'headers':headers,
				'followRedirect':true,
				'qs':params,
				'useQuerystring':true
			};

			request(requestOptions, function (error, response, body) {
				if (error) {
					err_cb(error);
				} else {
					var raw_results = JSON.parse(body);
					if ('error' in body) {
						if (['HTTP request timed out.', 'Pool queue is full'].index(raw_results['error']['info'])) {
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
			setTimeout(this.send.bind(this), now - caller.opts.RATE_LIMIT_LAST_CALL);
		}
	}
}