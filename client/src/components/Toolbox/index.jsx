import React, { useState } from 'react';
import Style from './toolbox.module.css';

const Toolbox = ({
	isConnected,
	toogleConnection,
	elements,
	history,
	handleUndo,
	handleRedo,
	clearCanvas,
	toolbox,
	setToolbox,
}) => {
	const handleChange = (e) => {
		setToolbox((prevState) => ({
			...prevState,
			[e.target.name]: e.target.value,
		}));
	};
	return (
		<div className={Style.toolbox}>
			<div className={Style.status}>
				<button
					className={isConnected ? Style.connected : Style.disconnected}
					onClick={toogleConnection}>
					{isConnected ? 'Connected' : 'Disconnected'}
				</button>
			</div>
			<div className={Style.tool}>
				<label htmlFor='tool'>Tool: </label>
				<select
					name='tool'
					onChange={handleChange}>
					<option value='pencil'>Pencil</option>
					<option value='line'>Line</option>
					<option value='rectangle'>Rectangle</option>
					<option value='circle'>Circle</option>
				</select>
			</div>
			<div className={Style.lineWidth}>
				<label htmlFor='lineWidth'>Line Width</label>
				<input
					type='number'
					name={'lineWidth'}
					value={toolbox.lineWidth}
					min={1}
					max={100}
					onChange={handleChange}
				/>
				<input
					type='range'
					min={1}
					max={100}
					value={toolbox.lineWidth}
					name='lineWidth'
					onChange={handleChange}
				/>
			</div>
			<div className={Style.color}>
				<label htmlFor='color'>Color:</label>
				<input
					type='color'
					name='strokeStyle'
					onChange={handleChange}
				/>
			</div>
			<div className={Style.fillStyle}>
				<label htmlFor='fillStyle'>Fill Color:</label>
				<input
					type='color'
					name={'fillStyle'}
					onChange={handleChange}
				/>
			</div>
			<button
				type='button'
				disabled={elements.length < 1}
				onClick={handleUndo}>
				Undo
			</button>
			<button
				type='button'
				disabled={history.length < 1}
				onClick={handleRedo}>
				Redo
			</button>
			<button
				type='button'
				disabled={elements.length < 1}
				onClick={clearCanvas}>
				Clear Canvas
			</button>
		</div>
	);
};

export default Toolbox;
