import SingleProduct from '../../components/SingleProduct'

export default function SingleProductPage({query}) {
    console.log('Called in Page')
    return <SingleProduct id={query.id}></SingleProduct>
}