var cheerio = require('cheerio');

function WikipediaPage(opts, caller) {
	this.opts = opts;
	this.setup(opts);
	this.load(opts.redirect, opts.preload);
	// private functions
	// public functions
}

WikipediaPage.prototype.setup = function(opts) {
	this.title = opts.title === undefined ? undefined : opts.title;
	this.pageid = opts.pageid === undefined ? undefined : opts.pageid;

	if (this.title !== undefined) {
		this.identification = 'title';
	} else if (this.pageid !== undefined) {
		this.identification = 'pageid';
	} else {
		// Throw ValueError: Either a title or a pageid must be specified
		return false;
	}

	if (opts.preload) {

	}

	// Setup
	this.categories = [];
	this.content = '';
	this.coordinates = [];
	this.images = [];
	this.links = [];
	this.parent_id = Number;
	this.references = '';
	this.revision_id = Number;
	this.sections = [];
	this.summary = '';
};

WikipediaPage.prototype.load = function(redirect, preload) {
	redirect = redirect === undefined ? true : redirect;
	preload = preload === undefined ? false : preload;
	var params = {
		'prop':'info|pageprops',
		'inprop':'url',
		'ppprop':'disambiguation',
		'redirects':''
	};

	if (this.pageid !== undefined) {
		params.pageids = this.pageid;
		this.identification = 'pageid';
	} else {
		params.titles = this.title;
		this.identification = 'title';
	}

	var req = new WikiRequest(params, caller, (function(err, raw_json){
		var query = raw_json.query;
		for (var page_key in query.pages) break;
		var pageid = page_key;
		var page = query.pages[pageid];

		if ('missing' in page) {
			var dict = {};
			dict[this.identification] = this[this.identification];
			throw new PageError(dict); // Throw error
		}
		else if ('redirects' in query) {
			if (redirect) {
				var redirects = query.redirects[0];
				var from_title;
				if ('normalized' in query) {
					var normalized = query.normalized[0];
					// assert that the 'from' of normalized is equal to the original query
					from_title = normalized.to;
				} else {
					from_title = this.title;
				}

				// assert redirects['from'] == from_title, ODD_ERROR_MESSAGE
				this.setup({'title':from_title});
				this.load(this.opts.redirect, this.opts.preload);
			} else {
				// Throw RedirectError
			}
		} else if ('pageprops' in page) {
			if (this.opts.allow_disambiguation) {
				var params = {
					'prop':'revisions',
					'rvprop':'content',
					'rvparse':'',
					'rvlimit':1
				};

				params[this.identification + 's'] = this[this.identification];
				var req = new WikiRequest(params, this, function(raw_json) {
					if (err) {
						cb(err);
					}

					var html = raw_json.query.pages[pageid].revisions[0]['*'];
					var els = (cheerio.load(html))("#mw-content-text li > a");
					var may_refer_to = [];
					for (var i = 0; i < els.length; i++) {
						var candidate = els[i].attribs.title;
						if (candidate) may_refer_to.push(candidate);
					}
					// throw disambiguation error with candidates
				});
			} else {
				// throw disambigaution error without candidates
			}
		} else { //success
			this.pageid = pageid;
			this.title = page.title;
			this.url = page.fullurl;
		}
	}).bind(this));
};

WikipediaPage.prototype.html = function() {
	return '';
};

WikipediaPage.prototype.section = function() {
	return '';
};