import { gql, useMutation } from "@apollo/client";
import Form from "./styles/Form";
import  useForm from '../lib/useForm';
import Error from "./ErrorMessage";
import {CURRENT_USER_QUERY} from './User';

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    authenticateUserWithPassword(email: $email, password: $password) {
      ... on UserAuthenticationWithPasswordSuccess {
        item {
          id
          email
          name
        }
      }
      ... on UserAuthenticationWithPasswordFailure {
        code
        message
      }
    }
  }
`;
  
export default function SignIn() {
    const {inputs, handleChange, clearForm, resetForm} = useForm({
        email: '',
        password: ''
    })

    const [signin, {data, loading}] = useMutation(SIGNIN_MUTATION, {
        variables: inputs,
        refetchQueries: [{query: CURRENT_USER_QUERY}]
    })

    const error = data?.authenticateUserWithPassword.__typename === 'UserAuthenticationWithPasswordFailure' ? data?.authenticateUserWithPassword : undefined;
    
    async function handleSubmit(e) {
        e.preventDefault()
        const res = await signin()
        resetForm()
    }

    return (
        
        <Form method="POST" onSubmit={handleSubmit}>
            <Error error={error}/>
            <fieldset disabled={loading} aria-busy={loading}>
                <label htmlFor="email"> 
                    Email
                    <input 
                    type="text" 
                    required
                    id="email" 
                    name="email" 
                    autoComplete="email"
                    placeholder="your email" 
                    value={inputs.email} 
                    onChange={handleChange} />
                </label>
                <label htmlFor="password"> 
                    Password
                    <input 
                    type="password"
                    required 
                    name="password" 
                    autoComplete="password" 
                    value={inputs.password}
                    onChange={handleChange}  
                    placeholder="************"  />
                </label>
                <button type="submit">Sign In</button>
            </fieldset>
        </Form>
    )
}