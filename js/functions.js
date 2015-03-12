function search(query, cb, opts) {
	// opts:contains results=10, suggestion=False
	// results:callback with params (err, [search_results [, suggestion]])
	if (!opts) {
		opts = {};
	}

	var params = {
		'list':'search',
		'srprop':'',
		'srlimit':opts.results === undefined ? 10 : opts.results,
		'limit':opts.results === undefined ? 10 : opts.results,
		'srsearch':query
	};

	if (opts.suggestion) params.srinfo = 'suggestion';
	var total_raw_results = [];
	var req = new WikiRequest(params, this, handleWikiRequest);
	var caller = this;
	function handleWikiRequest(err, raw_results) {
		if (err) {
			cb(err);
		} else {
			var search_results = raw_results.query.search.map(function(d){return d.title;}); 
			total_raw_results = total_raw_results.concat(search_results);
			if ('continue' in raw_results && total_raw_results.length < params.limit) {
				for (var i in raw_results.continue) {
					params[i] = raw_results.continue[i];
				}

				var req = new WikiRequest(params, caller, handleWikiRequest);
			} else {
				total_raw_results = total_raw_results.slice(0, opts.results);
				if (opts.suggestion) {
					if ('searchinfo' in raw_results.query) {
						var suggestion = raw_results.query.searchinfo.suggestion;
						cb(false, total_raw_results, suggestion);
					} else {
						cb(false, total_raw_results, false);
					}
				} else {
					cb(false, total_raw_results);
				}
			}
		}
	}
}

function suggest(query, cb) {
	// Calls search to get suggestion
	this.search(query, function(err, results, suggestion) {
		if (err) {
			cb(err);
		}
		else {
			this.cache.add('search', results);
			cb(false, suggestion);
		}
	}, {suggestion:true, results:1});

}

// function summary(query, sentences=0, chars=0, auto_suggest=True, redirect=True) {
function summary(query) {
	
}

function set_user_agent(user_agent_string) {
	this.opts.USER_AGENT = user_agent_string;
}

function page(opts) {

}

// function geosearch(latitude, longitude , title=None, results=10, radius=1000) {
function geosearch() {

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

// function random(pages=1) {
function random() {

}

function set_caching() {

}