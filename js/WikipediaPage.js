var cheerio = require('cheerio');

function WikipediaPage(opts, caller) {
	this.opts = opts;
	setup(opts);
	load(opts.redirect, opts.preload);

	// private functions
	function preload() {
		['content', 'summary', 'images', 'references', 'links', 'sections'].map((function(o) {
			this[o]();
		}).bind(this));
	}

	function setup(opts) {
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

		// Setup
		// this.categories = [];
		// this.content = '';
		// this.coordinates = [];
		// this.images = [];
		// this.links = [];
		// this.parent_id = Number;
		// this.references = '';
		// this.revision_id = Number;
		// this.sections = [];
		// this.summary = '';
	};

	function load(redirect, shouldPreload) {
		redirect = redirect === undefined ? true : redirect;
		shouldPreload = shouldPreload === undefined ? false : shouldPreload;
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
					setup({'title':from_title});
					load(this.opts.redirect, this.opts.preload);
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
				if (shouldPreload) preload();
			}
		}).bind(this));
	};


	// public functions
}

WikipediaPage.prototype.content = function(cb) {
	if (this._content) cb(false, this._content);
	else {
		var params = {
			prop:'extracts|revisions',
			explaintext:'',
			rvprop:'ids'
		};

		params.pageids = this.pageid;
		var req = new WikiRequest(params, this, (function(err, raw_json) {
			if (err) {
				cb(err);
			} else {
				this._content = raw_json.query.pages[self.pageid].extract;
				this._revision_id = request.query.pages[self.pageid].revisions[0].revid;
				this._parent_id = request.query.pages[self.pageid].revisions[0].parentid;
				cb(false, this._content);
			}
		}).bind(this));
	}
}

WikipediaPage.prototype.parent_id = function(cb) {
	if (this._parent_id) cb(false, this._parent_id);
	else {
		this.content(function(err){
			if (err) cb(err);
			else {
				cb(false, this._parent_id);
			}
		});
	}
}

WikipediaPage.prototype.revision_id = function(cb) {
	if (this._revision_id) cb(false, this._revision_id);
	else {
		this.content(function(err) {
			if (err) cb(err);
			else {
				cb(false, this._revision_id);
			}
		});
	}
}

WikipediaPage.prototype.summary = function() {
	if (this._summary) cb(false, this._summary)
	else {
		var params = {
			prop:'extracts',
			explaintext:'',
			exintro:'',
		};

		params.pageids = this.pageid;
		var req = new WikiRequest(params, this, function(err, raw_json) {
			if (err) cb(err);
			else {
				this._summary = request.query.pages[this.pageid].extract;
				cb(false, this._summary);
			}
		});
	}
}

WikipediaPage.prototype.images = function(cb) {
	if (this._images) cb(false, this._images);
	else {
		var url = page.imageinfo[0].url;
		var params = {
			'generator':'images',
			'gimlimit':'max',
			'prop':'imageinfo',
			'iiprop':'url'
		};

		var req = WikiRequest(params, this, cb.bind(this));

	}

	function handleImageReturn(raw_json, cb) {
		if (raw_json)
		var req = WikiRequest(params, this, handleImageReturn.bind(this));
	}
}

WikipediaPage.prototype.coordinates = function(cb) {
	if (this._coordinates) cb(false, this._coordinates);
	else {
		var params = {
			'prop': 'coordinates',
			'colimit': 'max',
			'titles': this.title,
		};

		var req = new WikiRequest(params, this, function(err, raw_json) {
			if (err) cb(err);
			else {
				if ('query' in raw_json) {
					var coordinates = request.query.pages[this.pageid].coordinates;
					this._coordinates = {lat:coordinates[0].lat, lon:coordinates[0].lon};
					cb(false, this._coordinates);
				} else {
					cb(false, false);
				}
			}
		});
	}

}

WikipediaPage.prototype.references = function() {

}

WikipediaPage.prototype.links = function() {

}

WikipediaPage.prototype.sections = function() {

}
