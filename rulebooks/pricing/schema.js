// pricing — the shape of a quote request the oracle rates. The SUT (/demo) is the live system; this
// rulebook is the independent oracle for what its totals SHOULD be (requirements/orders.md).
schema = {
    tier: ['standard', 'silver', 'gold', 'platinum'],
    rush: '#boolean',
    items: [
        {
            sku: '#string',
            qty: '#number',
            unitPrice: '#number'
        }
    ]
};
