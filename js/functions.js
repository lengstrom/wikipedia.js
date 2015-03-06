function search(query, cb, opts) {
	// opts:contains results=10, suggestion=False
	// results:callback with params (err, [search_results [, suggestion]])
	var params = {
		'list':'search',
		'srprop':'',
		'srlimit':opts.results || 10,
		'limit':opts.results || 10,
		'srsearch':query
	};

	if (opts.suggestion) params['srinfo'] = 'suggestion';

	var req = new WikiRequest(params, this, function(err, raw_results) {
		if (err) {
			cb(err);
		} else {
			var search_results = raw_results['query']['search'].map(function(d){return d['title']});
			if (opts.suggestion) {
				if ('searchinfo' in raw_results['query']) {
					var suggestion = raw_results['query']['searchinfo']['suggestion'];
					cb(false, search_results, suggestion);
				} else {
					cb(false, search_results, false);
				}
			} else {
				cb(false, search_results);
			}
		}
	});

	req.send();
}

function suggest(query, cb) {
	// Calls search to get suggestion
	var params = {
		'list':'search',
		'srinfo':'suggestion',
		'srprop':''
		'srsearch':query
	};

	this.search(query, function(err, results, suggestion) {
		if (err) {
			cb(err);
		}
		else {
			cb(false, suggestion);
		}
	}, {'srinfo':'suggestion'});

}

function summary(query, sentences=0, chars=0, auto_suggest=True, redirect=True) {

}

function set_user_agent(user_agent_string) {
	this.opts.USER_AGENT = user_agent_string;
}

function page(title=None, pageid=None, auto_suggest=True, redirect=True, preload=False) {

}

function geosearch(latitude, longitude, title=None, results=10, radius=1000) {

}

function languages() {

}

function set_lang(prefix) {
	this.opts.API_URL = 'http://' + prefix.toLowerCase() + '.wikipedia.org/w/api.php';
	this.cache = new Cache();
}

function set_rate_limiting(rate_limit, min_wait) {
	this.opts.RATE_LIMIT = rate_limit;
	this.opts.RATE_LIMIT_MIN_WAIT = min_wait || 50;
}

function random(pages=1) {

}