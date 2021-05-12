import { gql, useMutation } from "@apollo/client";
import Form from "./styles/Form";
import  useForm from '../lib/useForm';
import Error from "./ErrorMessage";
import {CURRENT_USER_QUERY} from './User';

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION($name: String!, $email: String!, $password: String!) {
    createUser(data: {name: $name, email: $email, password: $password}) {
      id 
      email
      name
    }
  }
`;
  
export default function SignUp() {
    const {inputs, handleChange, clearForm, resetForm} = useForm({
        name: '',
        email: '',
        password: ''
    })

    const [signup, {data, loading, error}] = useMutation(SIGNUP_MUTATION, {
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
                {data?.createUser && (
                    <p>
                        Signed up with {data.createUser.email} - Please go ahead and Sign In! 
                    </p>
                )}
                <label htmlFor="name"> 
                    Your Name
                    <input 
                    type="text" 
                    required
                    name="name" 
                    autoComplete="name "
                    placeholder="Your Name" 
                    value={inputs.name} 
                    onChange={handleChange} />
                </label>
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
                    id="password" 
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