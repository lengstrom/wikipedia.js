function WikipediaPage(opts) {
	if (opts.title) this.title = opts.title;
	if (opts.pageid) this.pageid = opts.pageid;
	if (!(this.title || this.pageid)) {
		// Throw ValueError: Either a title or a pageid must be specified
		return false;
	}

	this.load(opts.redirect, opts.preload);
	// private functions
	// public functions
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
}

WikipediaPage.prototype.load = function(redirect, preload) {
	redirect = redirect === undefined ? true: redirect;
	preload = preload === undefined ? false: preload;
	query_params = {
		'prop':'info|pageprops',
		'inprop':'url',
		'ppprop':'disambiguation',
		'redirects':''
	};
	
}

WikipediaPage.prototype.html = function() {
	return '';
};

WikipediaPage.prototype.section = function() {
	return '';
};