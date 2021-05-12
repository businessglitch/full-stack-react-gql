import { KeystoneContext } from "@keystone-next/types";
import { CartItem } from '../schemas/CartItem';
import { CartItemCreateInput, OrderCreateInput } from '../.keystone/schema-types';
import stripeConfig from "../lib/stripe";

const graphql = String.raw
export default async function checkout(
    root: any,
    { token }: { token: string },
    context: KeystoneContext
): Promise<OrderCreateInput> {
    // Make sure they are signed in
    const userId = context.session.itemId;
    if (!userId) {
        throw new Error(' Sorry! You must be signed in to create an order')
    }

    const user = await context.lists.User.findOne({
        where: { id: userId },
        resolveFields: graphql`
            id
            name
            email
            cart {
                id
                quantity
                product {
                    name
                    price
                    description
                    id
                    photo {
                        image {
                            id
                            publicUrlTransformed
                        }
                    }
                }
            }
        `
    })
    //  Calculate total price
    const items = user.cart.filter(cartItem => cartItem.product)
    const total = items.reduce(function (tally: number, item: CartItemCreateInput) {
        return tally + (item.quantity * item.product.price);
    }, 0)

    // Create Charge with stripe library
    const charge = await stripeConfig.paymentIntents.create({
        amount: total,
        currency: 'USD',
        confirm: true,
        payment_method: token
    }).catch(err => {
        throw new Error(err.message)
    });
    // convert the cartItems to orderItems
    const orderItems = items.map((cartItem) => {
        const { name, description, price, photo } = cartItem.product;
        const orderItem = {
            name,
            description,
            price,
            photo: { connect: { id: photo.id } },
            quantity: cartItem.quantity
        }
        return orderItem;
    })
    // Create the Order and return it

    const order = await context.lists.Order.createOne({
        data: {
            total: charge.amount,
            charge: charge.id,
            items: { create: orderItems },
            user: { connect: { id: userId } }
        },
        resolveFields: false
    });

    const cartItemIds = user.cart.map(cartItem => cartItem.id)

    await context.lists.CartItem.deleteMany({
        ids: cartItemIds
    });
    return order
}