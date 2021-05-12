import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { CURRENT_USER_QUERY } from "./User";

const   SIGNOUT_MUTATION = gql`
    mutation SIGNOUT_MUTATION {
        endSession
    }
`;

export default function SignOut() {
    const [signout] = useMutation(SIGNOUT_MUTATION, {
        refetchQueries:[{query: CURRENT_USER_QUERY}]
    })
    
    return(
       <button onClick ={signout}type="button">
           SignOut
       </button>
    )
}