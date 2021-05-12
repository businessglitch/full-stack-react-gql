import OrderItem from '../../components/Order'

export default function OrderItemPage({query}) {
    return <OrderItem id={query.id}></OrderItem>
}