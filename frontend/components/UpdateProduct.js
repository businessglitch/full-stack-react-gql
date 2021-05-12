import { useMutation, useQuery } from "@apollo/client";
import Form from './styles/Form';
import useForm from '../lib/useForm';
import DisplayError from '../components/ErrorMessage';
import gql from "graphql-tag"

const SINGLE_PRODUCT_QUERY = gql`
    query SINGLE_PRODUCT_QUERY($id: ID!) {
        Product(where: {id: $id}) {
        id
        name
        description
        price
        }
    }
`;

const UPDATE_PRODUCT_MUTATION = gql`
    mutation UPDATE_PRODUCT_MUTATION(
        $id: ID!
        $name:String
        $description: String
        $price: Int
        ) {
            updateProduct(
                id: $id
                data: {name:$name, description:$description, price: $price}
            ) {
                id
                name
                description
                price
            }
        }
`;

export default  function UpdateProduct({id}) {

    const {data, error, loading} = useQuery(SINGLE_PRODUCT_QUERY, {
        variables: { id }
    });

   

    const [updateProduct, {data: updateData, error: updateError, loading: updateLoading}] = useMutation(UPDATE_PRODUCT_MUTATION)

    const {inputs, handleChange, clearForm, resetForm} = useForm(data?.Product)

    if (loading) return(<p>Loading ....</p>)
    return (
            <Form onSubmit={ async (e) => {
                e.preventDefault()
                const res = await updateProduct({
                    variables: {
                        id: id,
                        name: inputs.name,
                        description: inputs.description,
                        price: inputs.price
                    }
                })
            }}>
                <DisplayError  error={error || updateError} />
                <fieldset disabled={updateLoading} aria-busy={updateLoading}>
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
                    <button type="submit">Update Product</button>
                </fieldset>
            </Form>
        )
}