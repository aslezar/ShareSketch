import React from 'react';
import style from './style.module.scss';

const StyleBox = ({ className, children }) => {
	return <div className={`${style.box} ${className}`}>{children}</div>;
};

export default StyleBox;
