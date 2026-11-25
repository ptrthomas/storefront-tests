// @description: drive the storefront UI for a gold-tier order and verify the shown total matches the rules
// @req: DEMO-PRICE-001/1
// A deterministic UI check. It drives the same /demo storefront a human uses and bridges the displayed
// total against the `pricing` rules oracle — `Rule.execute(name, row).verify(...)` auto-attaches the requirement
// criteria, so the @req verdict lands in the RTM (incl. when run as a coverage suite via Runner.run).
// `Robot.create()` is acquire-or-create: it reuses the active bot when one already exists (the loop, or a
// live console after `var bot = Robot.create()`) and creates a fresh one otherwise (a Runner.run suite);
// a borrowed `bot.destroy()` is a no-op. So this same check runs live, inside the loop, AND as a suite with
// no ceremony. Drift the SUT (the admin panel, or POST /demo/api/config) and this goes red — that's the point.
var bot = Robot.create();
var row = { tier: 'gold', rush: false, items: [{ sku: 'GADGET', qty: 1, unitPrice: 80 }] };
bot.go(demoUrl + '/demo');
bot.act('#tier', 'select', 'gold');
bot.act("input.qty[data-sku='GADGET']", 'input', '1');
bot.act('#get-quote', 'click');
var shown = parseFloat(bot.text('#total').replace(/[^0-9.]/g, ''));
var r = Rule.execute('pricing', row);
// verify() both RECORDS the verdict against the requirement criteria (the RTM evidence) and ASSERTS it:
// a disagreement throws, exactly like a failed match (D200). That is the drift this check exists to catch.
r.verify(Math.abs(shown - r.output.total) < 0.01, 'storefront total ' + shown + ' agrees with the rules oracle ' + r.output.total);
bot.screenshot('Gold order — total $' + shown + ' @req=DEMO-PRICE-001/1');
// bot.destroy() ends the live run + clears its run vars — keep it LAST; don't reference vars after it.
bot.destroy();
