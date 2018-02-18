var mocha = require("mocha");
var describe = mocha.describe;
var it = mocha.it;
var Promise = require("bluebird");
var request = Promise.promisifyAll(require("request"), { multiArgs: true });
var Docker = require("dockerode");
var docker = new Docker({
  Promise: Promise
});
const PQueue = require("p-queue");
const queue = new PQueue({ concurrency: 1 });

describe("Test Front API", function() {
  describe("Route", function() {
    it("Post 1 message", function(done) {
      request
        .postAsync({
          url: "http://api:4343/api/message",
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

    it("Post 10 message", async function  () {
      var Sendmessages = [];
      for (var c = 0; c < 10; c++) {
        await queue.add(() =>
          request
            .postAsync({
              url: "http://api:4343/api/message",
              body: "This is a test:" + c ,
              headers: { "Content-Type": "text/plain" }
            })
        );
      }
      return queue.onEmpty();
    });
  });
});
