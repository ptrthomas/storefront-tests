// @description: sign in on the orders page as tester, with the password read by its name
// A deterministic UI check. secret('DEMO_PASSWORD') is the environment variable of that name, as a pipeline sets
// it, else the console's stored value (a seeded demo stores it); the project holds only the name.
var password = secret('DEMO_PASSWORD');
var bot = typeof cdpUrl !== 'undefined' && cdpUrl ? Robot.create({ cdpUrl: cdpUrl }) : Robot.create();
bot.go(demoUrl + '/demo/orders');
bot.act('#username', 'input', 'tester');
bot.act('#password', 'input', password);
bot.act('#sign-in-button', 'click');
bot.wait("document.getElementById('sign-in-status').textContent != ''");
match(bot.text('#sign-in-status'), 'Signed in as tester.');
bot.screenshot('Signed in as tester');
// bot.destroy() ends the live run + clears its run vars — keep it LAST
bot.destroy();
