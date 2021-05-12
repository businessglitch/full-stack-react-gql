import { useQuery } from "@apollo/client"
import DisplayError from "./ErrorMessage"
import Head from 'next/head';
import styled from "styled-components";
import gql from "graphql-tag"

const ProductStyles = styled.div`
    display: grid;
    grid-auto-columns: 1fr;
    grid-auto-flow: column;
    min-height: 800px;
    max-width: var(--maxwidth);
    justify-content: center;
    align-items: top;
    gap: 2rem;
    img {
        width: 100%;
        object-fit:contain;
    }
`;


const SINGLE_ITEM_QUERY = gql`
    query SINGLE_ITEM_QUERY($id: ID!) {
        Product(where: { id: $id}) {
            name
            price
            description
            photo {
                altText
                image {
                    publicUrlTransformed
                }
            }
            id
        }
    }
`
export default function SingleProduct({id}) {
    const {data, loading, error} = useQuery(SINGLE_ITEM_QUERY,{
        variables: {
            id,
          },
    })
    console.log(data)
    if (loading) return (<p>Loading ....</p>)
    if (error)  return <DisplayError error={error} />

    const {name, price, description, photo} = data.Product
    return (
        <ProductStyles>
            <Head>
                <title> Sick Fits | {name}</title>
            </Head>
            <img src={photo.image.publicUrlTransformed}   alt={photo.altText}/>
            <div className="details">
                <h2>{name}</h2>
                <h2>{description}</h2>
            </div>
          
        </ProductStyles>
    )
}