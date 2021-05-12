import Link from 'next/link';
import { useCart } from '../lib/cartState';
import SignOut from './SignOut';
import NavStyles from './styles/NavStyles'
import { useUser } from './User';
import CartCount from '../components/CartCount'

export default function Nav() {
    const user  = useUser()
    const {toggleCart} = useCart()
    return <NavStyles>
        <Link href="/products"> Products </Link>
        {
            user && (
                <>
                 <Link href="/sell"> Sell </Link>
                <Link href="/orders"> Orders </Link>
                <Link href="/account"> Account </Link>
                <SignOut />
                <button type="button" onClick={toggleCart}>
                    My Cart
                    <CartCount count={user.cart.reduce((tally, cartItem) => {
                        return tally + (cartItem.product ? cartItem.quantity: 0)
                    }, 0)} ></CartCount>
                </button>
                </>
            )
        }
        {
            !user && (
                <>
                 <Link href="/signin"> Sign in </Link>
                </>
            )
        }
       
    </NavStyles>
}