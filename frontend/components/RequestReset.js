import { gql, useMutation } from "@apollo/client";
import Form from "./styles/Form";
import  useForm from '../lib/useForm';
import Error from "./ErrorMessage";
import {CURRENT_USER_QUERY} from './User';

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    sendUserPasswordResetLink(email: $email) {
     code
     message
    }
  }
`;
  
export default function RequestReset() {
    const {inputs, handleChange, clearForm, resetForm} = useForm({
        email: '',
    })

    const [signup, {data, loading, error}] = useMutation(REQUEST_RESET_MUTATION, {
        variables: inputs
    })
    
    async function handleSubmit(e) {
        e.preventDefault()
        const res = await signup()
        resetForm()
    }

    return (
        
        <Form method="POST" onSubmit={handleSubmit}>
            <Error error={error}/>
            <fieldset disabled={loading} aria-busy={loading}>
                {data?.sendUserPasswordResetLink == null && (
                    <p>
                        Success! Check your email for a link
                    </p>
                )}
                <label htmlFor="email"> 
                    Your Email
                    <input 
                    type="text" 
                    required
                    name="email" 
                    autoComplete="email"
                    placeholder="Your Email" 
                    value={inputs.email} 
                    onChange={handleChange} />
                </label>
                <button type="submit">Send Reset Link</button>
            </fieldset>
        </Form>
    )
}