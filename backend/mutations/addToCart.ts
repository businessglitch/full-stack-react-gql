import { KeystoneContext } from "@keystone-next/types";
import { CartItem } from '../schemas/CartItem';
import { CartItemCreateInput } from '../.keystone/schema-types';

export default async function addToCart(
    root: any,
    { productId }: { productId: string },
    context: KeystoneContext
): Promise<CartItemCreateInput> {
    const sesh = context.session;

    if (!sesh.itemId) {
        throw new Error('You must be logged in to do that!')
    }

    const allCartItems = await context.lists.CartItem.findMany({
        where: { user: { id: sesh.itemId }, product: { id: productId } },
        resolveFields: 'id,quantity'
    });

    const [exisitingCartItem] = allCartItems;

    if (exisitingCartItem) {
        console.log(`There are already item in the cart, increment by 1`)
        console.log(`whats here, ${exisitingCartItem.quantity}`)
        return await context.lists.CartItem.updateOne({
            id: exisitingCartItem.id,
            data: { quantity: exisitingCartItem.quantity + 1 },
            resolveFields: false,
        })
    }

    return await context.lists.CartItem.createOne({
        data: {
            product: { connect: { id: productId } },
            user: { connect: { id: sesh.itemId } },
        },
        resolveFields: false,
    })
}