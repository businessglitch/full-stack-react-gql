import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import useForm from '../lib/useForm'
import Form from './styles/Form';
import DisplayError from './ErrorMessage'
import { ALL_PRODUCTS_QUERY } from "./Products";
import Router from 'next/router';



const CREATE_PRODUCT_MUTATION = gql`
    mutation CREATE_PRODUCT_MUTATION(
        $name: String!
        $description: String!
        $price: Int!
        $image: Upload
    ){
        createProduct(
            data: {
                name: $name
                price: $price
                description: $description
                status: "AVIALABLE"
                photo: {create: {image: $image, altText: $name}} 
            }            
        ) {
            id
            price
            description
        }
    }
`;

export default  function CreateProduct() {
    const {inputs, handleChange, clearForm, resetForm} = useForm({
        image: '',
        name: 'dsds',
        price: 32424,
        description: 'dsds'

    })

    const [createProduct, {loading, error, data}] = useMutation(CREATE_PRODUCT_MUTATION, {
        variables: inputs,
        refetchQueries:[{query: ALL_PRODUCTS_QUERY}]
    })

    return (
        <Form onSubmit={ async (e) => {
            e.preventDefault()
            const res = await createProduct()
            clearForm()
            Router.push({
                pathname: `/product/${res.data.createProduct.id}`
            })

        }}>
            <DisplayError  error={error} />
            <fieldset disabled={loading} aria-busy={loading}>
                <label htmlFor="name"> 
                    Name
                    <input 
                    type="text" 
                    required
                    id="name" 
                    name="name" 
                    placeholder="Name" 
                    value={inputs.name} 
                    onChange={handleChange} />
                </label>
                <label htmlFor="price"> 
                    Price
                    <input 
                    type="number"
                    required 
                    id="price" 
                    name="price"  
                    value={inputs.price}
                    onChange={handleChange}  
                    placeholder="price"  />
                </label>
                <label htmlFor="description"> 
                    Description
                    <textarea 
                    type="textarea" 
                    id="description" 
                    name="description"
                    value={inputs.description}
                    onChange={handleChange}   
                    placeholder="description"/>
                </label>
                <label htmlFor="image"> 
                    Image
                    <input 
                    required
                    type="file" 
                    id="image" 
                    name="image" 
                    onChange={handleChange}/>
                </label>
                <button type="submit">+ Add Product</button>
            </fieldset>
        </Form>
    )
}
