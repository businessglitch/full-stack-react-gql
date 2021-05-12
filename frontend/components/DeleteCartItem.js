import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import styled from "styled-components";
import {CURRENT_USER_QUERY} from './User';

const BigButton = styled.button`
    font-size: 3rem;
    background:none;
    border: 0;
    &:hover {
        color: var(--red);
        cursor: pointer;
    }
`;

function  update(cache, payload) {
    cache.evict(cache.identify(payload.data.deleteCartItem));
}

const DELETE_CARTITEM_MUTATION = gql`
    mutation DELETE_CARTITEM_MUTATION($id: ID!) {
        deleteCartItem(id: $id) {
            id
        },
    }
`
export default function DeleteCartItem({id}) {
    const [deleteCartItem, {loading}] = useMutation(DELETE_CARTITEM_MUTATION, {
        variables: {id},
        update
    })
    return (
        <BigButton disabled={loading} type="button" title="Remove this item from Cart" onClick={deleteCartItem}>x</BigButton>
    )
}