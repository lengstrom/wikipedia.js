function WikipediaException(error) {
	console.error('Error:');
	console.error(JSON.stringify(error));

}

function DisambiguationError(title, may_refer_to) {
	WikipediaException.call(this, {'title':title, 'may_refer_to':may_refer_to});
}

function HTTPTimeoutError(query) {
	WikipediaException.call(this, {'title':query});
}

function PageError(pageid) {
	WikipediaException.call(this, {'title':pageid});
}

function RedirectError(title) {
	WikipediaException.call(this, {'title':title});
}

function RateError() {
	WikipediaException.call(this, {'title':title});
}