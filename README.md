# ShareSketch - Collaborative Drawing and Idea Sharing Platform

![ShareSketch Banner](https://github.com/aslezar/ShareSketch/resources/Homepage.png)

ShareSketch is a collaborative drawing and idea sharing platform built on the MERN (MongoDB, Express.js, React, Node.js) stack, featuring real-time drawing synchronization and chat functionality using Socket.IO. With ShareSketch, users can create, collaborate, and share their artistic ideas in real-time, fostering a creative and interactive environment.

## Table of Contents

- [Demo](#demo)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Usage](#api-usage)
- [Authentication](#authentication)
- [Themes](#themes)
- [Profile Management](#profile-management)
- [Contributing](#contributing)
- [License](#license)

## Demo

Check out the live demo of ShareSketch: [ShareSketch Demo](https://share-sketch.herokuapp.com/)

## Features

1. **Real-Time Drawing Collaboration:** Collaborate with a group of people by drawing together on a shared canvas in real-time.
2. **Interactive Chat:** Engage in chat conversations with fellow collaborators while drawing.
3. **User Authentication:** Secure user authentication using JSON Web Tokens (JWT).
4. **API Showcase:** Demonstrates the usage of APIs for various functionalities.
5. **Profile Management:** Users can update their profile image, name, and bio using the Multer library for image uploading.
6. **Dual Themes:** Choose between light and dark themes for a personalized user experience.

## Installation

To run ShareSketch locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/aslezar/ShareSketch.git
   ```

2. Navigate to the project directory:

   ```bash
   cd ShareSketch
   ```

3. Install server dependencies:

   ```bash
   npm install
   ```

4. Navigate to the `client` directory:

   ```bash
   cd client
   ```

5. Install client dependencies:

   ```bash
   npm install
   ```

6. Return to the project root:

   ```bash
   cd ..
   ```

7. Start the development server:

   ```bash
   npm run dev
   ```

8. Open your browser and go to `http://localhost:3000` to see ShareSketch in action.

## Usage

1. **Sign Up / Log In:** Create a new account or log in using your credentials.

2. **Create a New Drawing:** Start a new collaborative drawing session and invite others to join.

3. **Real-Time Drawing:** Use the drawing tools to create art together with other collaborators in real-time.

4. **Chat:** Engage in chat conversations with collaborators to discuss ideas and provide feedback.

## API Usage

ShareSketch demonstrates the usage of various APIs for different functionalities. These APIs can be accessed using routes:

- `/api/auth`: Authentication-related APIs.
- `/api/users`: User management APIs.
- `/api/drawings`: APIs related to creating, updating, and fetching drawings.
- `/api/chat`: APIs for real-time chat functionality.

## Authentication

ShareSketch employs JSON Web Tokens (JWT) for user authentication. Users are required to sign up or log in to access the drawing and chat functionalities.

## Themes

Choose between a light and dark theme for a personalized visual experience. The theme can be toggled from the user settings.

## Profile Management

Users can update their profile information, including their profile image, name, and bio. Profile images are uploaded using the Multer library.

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests to help improve ShareSketch.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

---

Have fun drawing, collaborating, and sharing ideas with ShareSketch! If you encounter any issues or have suggestions for improvements, please don't hesitate to open an issue on the GitHub repository.
