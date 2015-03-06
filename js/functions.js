function search(query, results=10, suggestion=False) {

}

function suggest(query) {

}

function summary(query, sentences=0, chars=0, auto_suggest=True, redirect=True) {

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

function set_rate_limiting(rate_limit, min_wait=datetime.timedelta(0, 0, 50000)) {

}

function random(pages=1) {

}