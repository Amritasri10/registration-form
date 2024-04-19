# Registration-Form Project

This project presents a straightforward yet effective registration form developed using a combination of front-end technologies including HTML, CSS, and JavaScript. On the server side, Node.js framework is employed, leveraging MongoDB as the data store via MongoDB Atlas, a cloud-based database service. The routing system is managed by Express, with Body-Parser handling the parsing of webpages, ensuring seamless communication between the client and server components.

Additionally, Express-session is implemented to track and manage user sessions, providing a robust and secure user experience. Mongoose, a Node.js library, plays a pivotal role by simplifying interactions with the MongoDB database from within the Node.js environment, enhancing efficiency and maintainability.

## Project Structure

- `index.html`: Registration form page.
- `error.html`: Error page.
- `success.html`: Success page.
- `server.js`: Node.js server file.
- `public/`: Folder containing CSS and client-side JavaScript.

## Setup Instructions

1. Install [Node.js](https://nodejs.org/en) and [MongoDB](https://www.mongodb.com/docs/manual/installation).
2. Run `[npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) install` to install dependencies.
3. Start the MongoDB server.
4. Run `node server.js` to start the application.
5. Open your browser and go to `(http://localhost:8003/)`.
