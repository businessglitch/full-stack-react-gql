import { gql, useMutation } from "@apollo/client";
import Form from "./styles/Form";
import  useForm from '../lib/useForm';
import Error from "./ErrorMessage";
import {CURRENT_USER_QUERY} from './User';

const RESET_MUTATION = gql`
  mutation RESET_MUTATION($email: String!, $token: String!, $password: String!) {
    redeemUserPasswordResetToken(email: $email, token: $token, password:$password) {
     code
     message
    }
  }
`;
  
export default function Reset({token}) {
    const {inputs, handleChange, clearForm, resetForm} = useForm({
        email: '',
        password: '',
        token
    })

    const [reset, {data, loading, resetError}] = useMutation(RESET_MUTATION, {
        variables: inputs
    })
    
    const error = data?.redeemUserPasswordResetToken?.code ?  data?.redeemUserPasswordResetToken : undefined;
    
    async function handleSubmit(e) {
        e.preventDefault()
        const res = await reset()
        resetForm()
    }

    return (
        
        <Form method="POST" onSubmit={handleSubmit}>
            <h2>Reset Your Password</h2>
            <Error error={error || resetError}/>
            <fieldset disabled={loading} aria-busy={loading}>
                {data?.redeemUserPasswordResetToken === null && (
                    <p>Password Successfully Reset</p>
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
                <label htmlFor="password"> 
                    Password
                    <input 
                    type="password" 
                    required
                    name="password" 
                    autoComplete="email"
                    placeholder="Your Email" 
                    value={inputs.password} 
                    onChange={handleChange} />
                </label>
                <button type="submit">Request Reset</button>
            </fieldset>
        </Form>
    )
}