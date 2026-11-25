// pricing — the constrained input domain the explorer sweeps (Rule.ranges / Rule.check / dimensions).
// Boundaries that flip an outcome live behind derived totals (free-ship at 100, review at 1000); those
// are covered by scenarios.json, not pinned here (a single input doesn't straddle them).
function generate(g) {
    g.enum('tier', ['standard', 'silver', 'gold', 'platinum']);
    g.bool('rush');
    g.array('items', 1, 3, function (el) {
        el.enum('sku', ['WIDGET', 'GADGET', 'GIZMO', 'CABLE']);
        el.int('qty', 1, 20, [4, 15]);
        el.int('unitPrice', 5, 80);
    });
}
