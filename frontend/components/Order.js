import gql from 'graphql-tag';
import OrderStyles from './styles/OrderStyles';
import ErrorMessgae from '../components/ErrorMessage';
import Head from 'next/head';
import { useQuery } from "@apollo/client";
import formatMoney from '../lib/formatMoney';
import ItemStyles from './styles/ItemStyles';

const SINGLE_ORDER_QUERY = gql`
    query SINGLE_ORDER_QUERY($id: ID!) {
        order: Order(where: {id: $id} ) {
            id
            charge
            total
            user {
                id
            }
            items {
                id
                name
                description
                price
                quantity
                photo {
                    image {
                        publicUrlTransformed
                    }
                }
            }
        }

    }
`
export default function OrderItem({id}) {
    const {data, error, loading} = useQuery(SINGLE_ORDER_QUERY, {
        variables: {
            id
        }
    });

    if (error) return (<ErrorMessgae error={error}/>)

    if (loading) return (<p>Loading ...</p>)
    const {total, charge, id: orderId, items} = data.order
    return (
        <OrderStyles>
            <Head>
                <title> Sick Fits | {orderId}</title>
            </Head>
            <p>
                <span>Order Id</span>
                <span>{orderId}</span>
            </p>
            <p>
                <span>Charge:</span>
                <span>{charge}</span>
            </p>
            <p>
                <span>Order Total:</span>
                <span>{formatMoney(total)}</span>
            </p>
            <p>
                <span>ItemCount:</span>
                <span>{items.length}</span>
            </p>
            <div className="items">
                {items.map(item => {
                    const {id, photo, title, name, price, quantity, description} = item
                    return (
                    <div className="order-item" key={id}>
                       <img src={photo.image.publicUrlTransformed} alt={title}/>
                       <div className="item-details">
                           <h2>{name}</h2>
                           <p>Qty: {quantity}</p>
                           <p>Each: {formatMoney(price)}</p>
                           <p>Sub Total: {formatMoney(price * quantity)}</p>
                           <p>{description}</p>
                       </div>
                    </div>
                    )
                })}
            </div>
        </OrderStyles>
    )
}