const reducer = (state, action) => {
	if (action.type === 'CLEAR_CART') {
		return { ...state, cart: [] };
	}
	if (action.type === 'REMOVE') {
		return {
			...state,
			cart: state.cart.filter((cartItem) => cartItem.id !== action.payload),
		};
	}
	if (action.type === 'GET_TOTALS') {
		let { total, amount } = state.cart.reduce(
			(total, item) => {
				const { price, amount } = item;
				total.total = total.total + price * amount;
				total.amount = total.amount + amount;
				return total;
			},
			{ total: 0, amount: 0 }
		);
		total = parseFloat(total.toFixed(2));
		return {
			...state,
			total,
			amount,
		};
	}
	if (action.type === 'LOADING') {
		return { ...state, loading: true };
	}
	if (action.type === 'DISPLAY_ITEMS') {
		return { ...state, loading: false, cart: action.payload };
	}
	if (action.type === 'TOGGLE_AMOUNT') {
		return {
			...state,
			cart: state.cart
				.map((item) => {
					if (item.id === action.payload.id) {
						return { ...item, amount: item.amount + action.payload.amount };
					}
					return item;
				})
				.filter((item) => item.amount !== 0),
		};
	}
	throw new Error('No matching action type');
};
export default reducer;
