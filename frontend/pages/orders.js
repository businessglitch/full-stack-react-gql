import gql from 'graphql-tag';
import ErrorMessgae from '../components/ErrorMessage';
import Head from 'next/head';
import { useQuery } from "@apollo/client";
import formatMoney from '../lib/formatMoney';
import OrderItemStyles from '../components/styles/OrderItemStyles';
import styled from 'styled-components';
import Link from 'next/link';

const USER_ORDERS_QUERY = gql`
    query USER_ORDERS_QUERY {
        allOrders {
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

const OrdersList = styled.ul`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    grid-gap: 4rem;
`;

function countItemsInOrder(order) {
    return order.items.reduce((tally, item) => tally + item.quantity, 0)
}
export default function OrdersPage() {
    const {data, error, loading} = useQuery(USER_ORDERS_QUERY);

    if (error) return (<ErrorMessgae error={error}/>)
    if (loading) return (<p>Loading ...</p>)

    const {allOrders} = data

    return (
        <>
        <h2>You have {allOrders.length} orders</h2>
            <OrdersList>
            {
                allOrders.map(order => {
                    return (
                        <OrderItemStyles>
                            <Link href={`/order/${order.id}`}>
                                <a>
                                    <div className="order-meta">
                                        <p>{countItemsInOrder(order)} Items</p>
                                        <p>{order.items.length} Product{order.items.length > 1 ? 's' : ''}</p>
                                        <p>{formatMoney(order.total)}</p>
                                    </div>
                                    <div className="images">
                                        {order.items.map(item => {
                                            return(<img key={item.id + `image`} src={item.photo?.image?.publicUrlTransformed} alt={item.name}/>)
                                        }) }
                                    </div>
                                </a>
                            </Link>
                        </OrderItemStyles>
                    )
                })
            }
        </OrdersList>
        </>
    )
}