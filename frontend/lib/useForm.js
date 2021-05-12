import { useState, useEffect } from "react";

export default function useForm(initial = {}) {

    // create a state object for our inputs
    const [inputs, setInputs] = useState(initial);
    const initialValues = Object.values(initial).join('')

    useEffect(() => {
        // This function runs when the things we are watching change
        setInputs(initial);
    }, [initialValues]);
    

    function handleChange(e) {
        const {value, name, type} = e.target


        if (type === 'number') {
            value = parseInt(value)
        }
 
        if (type === 'file') {
            setInputs({...inputs, [name]:e.target.files[0]})
        } else {
            setInputs({...inputs,[name]:value})
        }

    }

    function resetForm() {
        setInputs(initial)
    }

    function clearForm() {
        const blankState = Object.fromEntries(Object.entries(inputs).map(([key, value]) => [key, '']))
        setInputs(blankState)
    }
    // return the things we want to surface

    return {
        inputs, 
        handleChange,
        resetForm,
        clearForm
    }
}