import { createContext, useReducer } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TO_CART': {
            const item = action.payload;
            const existItem = state.cartItems.find((x) => x._id === item._id);

            if (existItem) {
                return {
                    ...state,
                    cartItems: state.cartItems.map((x) =>
                        x._id === existItem._id ? item : x
                    ),
                };
            } else {
                return {
                    ...state,
                    cartItems: [...state.cartItems, item],
                };
            }
        }
        case 'REMOVE_FROM_CART':
            return {
                ...state,
                cartItems: state.cartItems.filter((x) => x._id !== action.payload),
            };
        case 'EMPTY_CART':
            return {
                ...state,
                cartItems: [],
            };
        default:
            return state;
    }
};

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, { cartItems: [] });

    const addToCart = (product, qty) => {
        dispatch({
            type: 'ADD_TO_CART',
            payload: { ...product, qty },
        });
    };

    const removeFromCart = (id) => {
        dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    };

    const emptyCart = () => {
        dispatch({ type: 'EMPTY_CART' });
    };

    return (
        <CartContext.Provider value={{ cartItems: state.cartItems, addToCart, removeFromCart, emptyCart }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;
