// pricing — the oracle for the /demo storefront. Mirrors DemoApp's pricing so the rules say what each
// total SHOULD be; a check compares the live SUT against this. Each decision arm links its acceptance
// criterion with calc.req (requirements/orders.md), so a run lights exactly the criteria its path reached.
//
// NOTE the deliberate GAP: the requirements name a PLATINUM tier (DEMO-PRICE-001/3) that neither the SUT
// nor these rules implement — so 001/3 stays uncovered in the RTM. That is the demo's point: traceability
// surfaces missing functionality that "looks done".
const lookup = {
    tierDiscount: { standard: 0, silver: 0.05, gold: 0.10 },   // platinum intentionally absent (the gap)
    rushSurcharge: 0.15,
    freeShipThreshold: 100,
    shippingFee: 9.99,
    reviewThreshold: 1000
};

const execute = function (calc) {
    const input = calc.input;
    calc.log('# Line items & subtotal');
    const items = input.items || [];

    let subtotal = 0;
    items.forEach(function (item) {
        const line = item.qty * item.unitPrice;
        subtotal += line;
        calc.log('line ' + item.sku + ': ' + item.qty + ' x ' + item.unitPrice + ' = ' + line.toFixed(2));
    });
    calc.log('subtotal ' + subtotal.toFixed(2) + ' over ' + items.length + ' line(s)');

    // customer-tier discount off the subtotal
    calc.log('# Discounts & surcharges');
    calc.label('Tier discount');
    const tierRate = lookup.tierDiscount[input.tier] || 0;
    if (input.tier === 'gold') {
        calc.req('DEMO-PRICE-001/1');   // gold → 10%
    } else if (input.tier === 'silver') {
        calc.req('DEMO-PRICE-001/2');   // silver → 5%
    }
    const discount = subtotal * tierRate;
    const discounted = subtotal - discount;
    calc.log('tier ' + input.tier + ' discount ' + discount.toFixed(2));

    // rush surcharge on the discounted subtotal
    let surcharge = 0;
    calc.label('Rush surcharge');
    if (input.rush) {
        calc.req('DEMO-PRICE-002/1');
        surcharge = discounted * lookup.rushSurcharge;
    }

    // shipping — free above the threshold, else a flat fee
    let shipping;
    calc.label('Shipping');
    if (discounted >= lookup.freeShipThreshold) {
        calc.req('DEMO-PRICE-003/1');
        shipping = 0;
    } else {
        calc.req('DEMO-PRICE-003/2');
        shipping = lookup.shippingFee;
    }

    const total = discounted + surcharge + shipping;
    calc.log('surcharge ' + surcharge.toFixed(2) + ' shipping ' + shipping.toFixed(2) + ' total ' + total.toFixed(2));

    // the categorical disposition — a large order routes to a human, the rest auto-approve
    calc.log('# Total & approval routing');
    calc.label('Approval routing');
    if (total > lookup.reviewThreshold) {
        calc.req('DEMO-PRICE-004/1');
        calc.outcome('needs_review');
    } else {
        calc.req('DEMO-PRICE-004/2');
        calc.outcome('auto_approved');
    }

    // PBT properties — checked over the whole swept space by Rule.check. A property may GUARD an
    // acceptance criterion with {req}: Rule.cover projects its verdict onto that criterion, so a
    // violation reads FAILING there and blocks Requirement.readiness() with the counterexample —
    // try it live: set lookup.tierDiscount.gold to 1.1 and re-run Rule.cover.
    calc.always('total is never negative', total >= 0);
    calc.always('discount never exceeds subtotal', discount <= subtotal, {req: 'DEMO-PRICE-001/1'});
    calc.always('total at least the discounted amount', total >= discounted, {req: 'DEMO-PRICE-002/1'});

    // The silent-drift audit — the one thing a GREEN suite cannot tell you. Try it live:
    // `Rule.bless('pricing')` captures today's meaning as the reference. Now make a legitimate,
    // coordinated rate change — drop `lookup.shippingFee` to 4.99 here AND set the same knob on the
    // storefront (the admin panel, or `POST /demo/api/config {"shippingFee": 4.99}`). Re-run the
    // checks: still green, and rightly so — the rules and the system agree, and no row pinned a
    // golden number. Then run `Rule.drift('pricing')`: it is the only thing that noticed, naming
    // each scenario whose total moved and by how much, for a human to confirm the change was meant.
    // (Change only ONE side and the checks go red instead — that is the oracle-vs-live diff doing
    // its job, a different signal from drift.) The same audit covers the shape: loosen `schema.js`
    // (say `qty: '#number'` to `'#notnull'`) and a negative row's REFUSED verdict flips to
    // ACCEPTED — `rejectDrift`, a stated claim that quietly stopped holding.

    // the FULL priced breakdown, field-for-field with what the API returns — so a check asserts the
    // whole quote against the rules in one line, with no golden number anywhere (`match response
    // contains check.output`). An output field the system exposes but the rules don't is a field
    // nobody can verify.
    calc.output = {                                  // headline number first
        total: Math.round(total * 100) / 100,
        subtotal: Math.round(subtotal * 100) / 100,
        discount: Math.round(discount * 100) / 100,
        rushSurcharge: Math.round(surcharge * 100) / 100,
        shipping: Math.round(shipping * 100) / 100
    };
};
