export default function formatMoney(amount = 0) {
    const options = {
        style: 'currency',
        currency: 'CAD',
        minimumFractionDigits: 2,
    }

    // check if amount is fixed that doesnt require decimal points
    if (amount % 100 === 0) {
        options.minimumFractionDigits = 0
    }

    const formatter = Intl.NumberFormat('en-US', options)
    // All amount is in cents
    return formatter.format(amount / 100);
}