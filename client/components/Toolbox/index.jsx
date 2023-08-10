import React from 'react';
import Style from './toolbox.module.css';

const Toolbox = ({ state, setState }) => {
	return (
		<div className={Style.toolbox}>
			<Button
				name='Clear All'
				onClick={() => {
					setState({
						...state,
						brushSize: 10,
						strokeColor: '#ffffff',
						// fillColor: '#000000',
					});
				}}
			/>
			<SizePicker
				name='Brush Size'
				size={state.brushSize}
				onChange={(e) => setState({ ...state, brushSize: e.target.value })}
			/>
			<ColorPicker
				name='Brush Color'
				color={state.strokeColor}
				onChange={(e) => setState({ ...state, strokeColor: e.target.value })}
			/>
			{/* <ColorPicker
				name='Fill Color'
				color={state.fillColor}
				onChange={(e) => setState({ ...state, fillColor: e.target.value })}
			/> */}
		</div>
	);
};

const SizePicker = ({ name, size, onChange }) => {
	return (
		<div className={Style.sizePicker}>
			<label htmlFor='size-picker'>{name}</label>
			<input
				id='size-picker'
				type='range'
				min='1'
				max='150'
				value={size}
				onChange={onChange}
			/>
			<input
				type='number'
				value={size}
				style={{ width: '50px' }}
				onChange={onChange}
			/>
		</div>
	);
};
const ColorPicker = ({ name, color, onChange }) => {
	return (
		<div className={Style.colorPicker}>
			<label htmlFor='color-picker'>{name}</label>
			<input
				id='color-picker'
				type='color'
				value={color}
				onChange={onChange}
			/>
		</div>
	);
};
const Button = ({ name, onClick }) => {
	return (
		<div className={Style.button}>
			<button onClick={onClick}>{name}</button>
		</div>
	);
};

export default Toolbox;
