import { createContext, useContext, useState } from "react";

const LocalStateContext = createContext();
const LocatStateProvider = LocalStateContext.Provider;

function CartStateProvider({children}) {
    //  This is our own custom provider and wil will store state and functionality in which anyone can access
    const[cartOpen, setCartOpen] = useState(false)
    
    function toggleCart() {
        setCartOpen(!cartOpen)
    }

    function closeCart() {
        setCartOpen(false)
    }

    function openCart() {
        setCartOpen(true)
    }

    return (
        <LocatStateProvider value={{cartOpen, toggleCart, openCart, closeCart}}>{children}</LocatStateProvider>
    )
}

function useCart() {
    const all = useContext(LocalStateContext);
    return all;
}

export {useCart, CartStateProvider}