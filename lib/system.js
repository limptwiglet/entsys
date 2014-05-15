module.exports = System = function (options) {
	this.options = options || {};
};

System.prototype = {
	registerFamily: function (family) {
		this.family = family;
	},

	process: function () {

	}
};
