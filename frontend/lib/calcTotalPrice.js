export default function calcTotalPrice(cart) {
    return cart.reduce((tally, cartItem) => {
        if (!cartItem) return 

        return tally + cartItem.quantity * cartItem.product.price
    }, 0)
}