const User = require('../models/user');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const register = async (req, res) => {
	const user = await User.create({ ...req.body });
	const token = user.generateToken();
	res.status(StatusCodes.CREATED).json({
		data: {
			userId: user._id,
			name: user.getName(),
			email: user.email,
			token,
		},
		succuess: true,
		msg: 'User Created Successfully',
	});
};

const login = async (req, res) => {
	const { email, password } = req.body;
	if (!email && !password) {
		throw new BadRequestError('Please provide email and password');
	} else if (!email) {
		throw new BadRequestError('Please provide email');
	} else if (!password) {
		throw new BadRequestError('Please provide password');
	}

	const user = await User.findOne({ email });

	if (!user) {
		throw new UnauthenticatedError('Email Not Registered.');
	}

	const isPasswordCorrect = await user.comparePassword(password);
	if (!isPasswordCorrect) {
		throw new UnauthenticatedError('Invalid Password.');
	}

	const token = user.generateToken();
	res.status(StatusCodes.OK).json({
		data: {
			userId: user._id,
			name: user.getName(),
			email: user.email,
			token,
		},
		succuess: true,
		msg: 'User Login Successfully',
	});
};
const tokenLogin = async (req, res) => {
	const { token } = req.body;
	if (!token) {
		throw new BadRequestError('Please provide token');
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		// console.log(decoded);

		const newToken = jwt.sign(
			{
				userId: decoded.userId,
				name: decoded.name,
				email: decoded.email,
			},
			process.env.JWT_SECRET,
			{
				expiresIn: process.env.JWT_LIFETIME,
			}
		);

		res.status(StatusCodes.OK).json({
			data: {
				userId: decoded.userId,
				name: decoded.name,
				email: decoded.email,
				token: newToken,
			},
			succuess: true,
			msg: 'User Login Successfully',
		});
	} catch (error) {
		throw new UnauthenticatedError('Invalid Token');
	}
};
const signOut = async (req, res) => {
	res.status(StatusCodes.OK).json({
		succuess: true,
		msg: 'User Logout Successfully',
	});
};

module.exports = {
	register,
	login,
	tokenLogin,
	signOut,
};
