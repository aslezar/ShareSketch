import React, { useContext, useReducer, useEffect } from 'react';
import cartItems from './data';
import reducer from './userReducer';
const AppContext = React.createContext();
const initialState = {
	loading: false,
	cart: cartItems,
	total: 0,
	amount: 0,
};

const AppProvider = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const clearCart = () => {
		dispatch({ type: 'CLEAR_CART' });
	};
	const remove = (id) => {
		dispatch({ type: 'REMOVE', payload: id });
	};
	const fetchData = async () => {
		dispatch({ type: 'LOADING' });
		const resp = await fetch(url);
		const cart = await resp.json();
		dispatch({ type: 'DISPLAY_ITEMS', payload: cart });
	};
	const toggleAmount = (id, amount) => {
		dispatch({ type: 'TOGGLE_AMOUNT', payload: { id, amount } });
	};
	useEffect(() => {
		fetchData();
	}, []);
	useEffect(() => {
		dispatch({ type: 'GET_TOTALS' });
	}, [state.cart]);
	return (
		<AppContext.Provider
			value={{
				...state,
				clearCart,
				remove,
				toggleAmount,
			}}>
			{children}
		</AppContext.Provider>
	);
};
export const useGlobalContext = () => {
	return useContext(AppContext);
};

export { AppContext, AppProvider };
