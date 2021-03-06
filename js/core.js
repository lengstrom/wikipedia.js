var request = require('request');

module.exports = function(args) {
	var opts = {
		API_URL:'http://en.wikipedia.org/w/api.php',
		RATE_LIMIT:false,
		RATE_LIMIT_MIN_WAIT:false,
		RATE_LIMIT_LAST_CALL:false,
		USER_AGENT:'wikipedia (https://github.com/meadowstream/wikipedia.js/)'
	};

	for (var i in args) {
		opts[i] = args[i];
	}

	return {
		// variables
		'cache':new Cache(),
		// Functions
		'opts':opts,
		'search':search,
		'set_caching':set_caching,
		'suggest':suggest,
		'page':page,
		'geosearch':geosearch,
		'languages':languages,
		'set_lang':set_lang,
		'set_rate_limiting':set_rate_limiting,
		'random':random,

		// Classes
		'WikipediaPage':WikipediaPage
	};
};