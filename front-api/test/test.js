var mocha = require("mocha");
var describe = mocha.describe;
var it = mocha.it;
var Promise = require("bluebird");
var request = Promise.promisifyAll(require("request"), { multiArgs: true });
var Docker = require("dockerode");
var docker = new Docker({
	Promise: Promise
});

describe("Test Front API", function() {
	describe("Route", function() {
		it("Post 1 message", function(done) {
			request
				.postAsync({
					url: "http://127.0.0.1:4242/api/message",
					body: "This is a test message",
					headers: { "Content-Type": "text/plain" }
				})
				.spread(function(res, body) {
					try {
						if (JSON.parse(body).status === "ok") {
							done();
						}
					} catch (e) {
						done(e);
					}
				});
		});

		it("Post 10 message", function(done) {
			var Sendmessages = [];
			for (var c = 0; c < 10; c++)
				Sendmessages.push(
					request.postAsync({
						url: "http://127.0.0.1:4242/api/message",
						body: "This is a test message:" + c,
						headers: { "Content-Type": "text/plain" }
					})
				);
			Promise.each(Sendmessages, function(item) {
				return item;
			}).then(function(data) {
				var ok = true;
				for (var variable of data) {
					if (JSON.parse(variable[1]).status !== "ok") ok = false;
				}
				if (ok === true) done();
			});
		});
	});
});
