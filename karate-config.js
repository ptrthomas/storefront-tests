function fn() {
  // demoUrl = this karate server's ROOT (the served console gives each run it starts its root as demo.url,
  // so the run reaches the internal /demo SUT; a headless run takes -Ddemo.url or Runner.run's props, else
  // the default serve port). The storefront + its API live UNDER /demo (see openapi.yaml: /demo/api/...),
  // so demoUrl does NOT include /demo — add that segment yourself:
  //   feature:   * url demoUrl   then   Given path 'demo/api/quote'   (or: path 'demo','api','quote')
  //   .js check: bot.go(demoUrl + '/demo')
  var demoUrl = karate.sysprop('demo.url', 'http://localhost:8080');
  // appUrl = the app under test, by convention — Runner.target() reads and probes it
  // baseUrl = the Postman collection's {{baseUrl}} (postman/), which karate-config resolves over the collection's own
  return { demoUrl: demoUrl, baseUrl: demoUrl, appUrl: demoUrl + '/demo',
    auth: { scheme: 'bearer' } };
}

// >>> ApiTest.config: generated, change it only with ApiTest.config()
// model: [{"name":"apiUser","value":"tester"},{"name":"apiPassword","secret":"DEMO_PASSWORD"}]
var apiTestConfig = function (config, secret) {
  config = config || {};
  config.apiUser = 'tester';
  config.apiPassword = secret('DEMO_PASSWORD');
  return config;
};
apiTestConfig(fn(), function (name) { return karate.sysenv(name); });
// <<< ApiTest.config sha256=f3ec3a5d5826cc5b418e2e4279651f4d617fb2b68f28cc1e22c52bd332f7ff2a
