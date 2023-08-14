import React from 'react';
import style from './styleBox.module.css';

const StyleBox = ({ className, children }) => {
	return <div className={`${style.box} ${className}`}>{children}</div>;
};

export default StyleBox;
