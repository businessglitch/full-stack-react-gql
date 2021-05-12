import { useMutation } from "@apollo/client";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js"
import gql from "graphql-tag";
import { useRouter } from "next/dist/client/router";
import nProgress from "nprogress";
import { useState } from "react";
import styled from "styled-components"
import SickButton from './styles/SickButton';
import {useCart} from '../lib/cartState';
import { CURRENT_USER_QUERY } from "./User";

const CheckoutFromStyles  = styled.form`
    box-shadow: 0 1px 2px 2px rgba(0,0,0,0.04);
    border-radius: 5px;
    padding: 1rem;
    display: grid;
    grid-gap: 1rem;
`
const stripLib = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

const CREATE_ORDER_MUTATION = gql`
    mutation CREATE_ORDER_MUTATION($token: String!) {
        checkout(token: $token) {
            id
            charge
            total
            items {
                id
                name
            }
        }
    }
`
function CheckoutForm() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState()
    const stripe = useStripe()
    const router = useRouter()
    const {closeCart} = useCart()
    const elements = useElements()
    const [checkout, {error:checkoutError}] = useMutation(CREATE_ORDER_MUTATION, {
        refetchQueries: [{query: CURRENT_USER_QUERY}]
    });

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)

        // Start Page Transition
        nProgress.start();

        // Create a payment method via Stripe
        const {error, paymentMethod} = await stripe.createPaymentMethod({
            type:'card',
            card:elements.getElement(CardElement)
        })

        if (error) {
            setError(error)
            nProgress.done();
            return;
        }
        
        // End Page Transition and Loading
        const order = await checkout({
            variables:  {
                token: paymentMethod.id
            }
        });
        console.log(order)
        router.push({
            pathname:`/order/[id]`,
            query: {id: order.data.checkout.id}
        });

        closeCart()
        setLoading(false)
        nProgress.done();
    }

    return (
        <CheckoutFromStyles onSubmit={handleSubmit}>
            {error && <p style={{fontSize:12}}>{error.message}</p>}
            {checkoutError && <p style={{fontSize:12}}>{checkoutError.message}</p>}
            <CardElement />
            <SickButton>Check Out Now</SickButton>
        </CheckoutFromStyles>
    )
}

function Checkout() {
    return(
        <Elements stripe={stripLib}>
            <CheckoutForm/>
        </Elements>
    )
}

export {Checkout}