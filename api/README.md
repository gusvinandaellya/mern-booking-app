# Booking App API (MERN STACK)

The frontend for this project is developed using React and Vite. You can find the frontend repository here:
[Booking App Frontend](https://github.com/gusvinandaellya/booking-app-frontend)

Welcome to the Booking App API, a robust and scalable backend service built using the MERN stack. This API powers a seamless booking experience by handling user authentication, data storage, and booking operations. Built with Node.js and MongoDB Atlas, it ensures high performance and reliability for all your booking needs.

## Tools
- `bcryptjs`
- `cookie-parser`
- `cors`
- `dotenv`
- `express`
- `image-downloader`
- `jsonwebtoken`
- `mongoose`
- `multer`

## Installation

Follow these steps to set up and run the API locally:

1. **Clone the repository:**
    ```bash
    git clone https://github.com/gusvinandaellya/booking-app-api.git
    cd booking-app-api
    ```

2. **Install dependencies:**
    ```bash
    yarn
    ```

3. **Set up environment variables:**
    Create a `.env` file in the root directory and add your configuration settings. Example:
    ```env
    MONGO_URL=your_mongodb_atlas_uri
    ```

4. **Start the server:**
    ```bash
    nodemon index.js
    ```

Your API should now be running on `http://localhost:4000`.

## Features

- **User Authentication:** Secure registration and login using JWT and bcrypt.
- **Place Management:** Create, read, update, and delete places.
- **Booking Place:** Make a reservation.
- **Image Upload:** Upload and manage images with Multer and image-downloader.
- **CORS Support:** Enable cross-origin requests with CORS.

## Contributing

We welcome contributions! Please fork the repository and submit a pull request with your changes.


**Notes: This is a practice project, so it's not 100% finished, but I'll finish it sometime.**