import styled from 'styled-components';
import CartStyles from './styles/CartStyles';
import CloseButton from './styles/CloseButton';

import Supreme from './styles/Supreme'
import { useUser } from './User';
import formatMoney from '../lib/formatMoney'
import calcTotalPrice from '../lib/calcTotalPrice';
import {useCart} from '../lib/cartState';
import DeleteCartItem from './DeleteCartItem';
import {Checkout} from './Checkout';

const CartItemStyle = styled.li`
padding: 1rem 0;
border-bottom: 1px solid var(--lightGrey);
display: grid;
grid-template-columns: auto 1fr auto;
img {
    margin-right: 1rem;
}
h3, p {
margin: 0
}
`;

function CartItem({cartItem}) {
    const {photo, name, price} = cartItem.product;
    
    return (
        <CartItemStyle>
            <img width="100" src={photo.image.publicUrlTransformed}  alt={name}/>
            <div>
                <h3>{name}</h3>
                <p>
                    {formatMoney(price * cartItem.quantity)}
                     { }-
                    <em> {cartItem.quantity} &times; {formatMoney(price)} each</em>
                    
                </p>
            </div>
            <DeleteCartItem id={cartItem.id} />
        </CartItemStyle>
    )
}   

export default function Cart() {
    const me = useUser()
    const {cartOpen, toggleCart} = useCart();
    
    if(!me) return null;

    return(
    <CartStyles open={cartOpen}>
        <header>
            <Supreme>
                {me.name}'s Cart
            </Supreme>
            <CloseButton onClick={toggleCart}>x</CloseButton>
        </header>
       
        <ul>
            {
                me.cart.map(cartItem => {
                    return (<CartItem key={cartItem.id} cartItem={cartItem} />)
                })
            }
        </ul>
        <footer>
            <p>{formatMoney(calcTotalPrice(me.cart))}</p>
            <Checkout/>
        </footer>
    </CartStyles>
    )
}