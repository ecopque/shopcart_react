# ShopCart - E-commerce Project with React

Welcome to ShopCart, a complete e-commerce application built with React. This project features a login page, product listing with filters, product details, a persistent shopping cart, and a checkout page.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Screenshots](#screenshots)

## Features

-   **Login Page**: User authentication with email and password validation[cite: 6]. [cite_start]The login button is disabled until the form is valid[cite: 7].
-   **Product Listing**: Fetches and displays a list of products from the `fakestoreapi.com` API[cite: 1, 10].
-   **Product Filtering**: Filter products by category[cite: 12].
-   **Product Details**: Displays detailed information for each product, including image, title, price, description, and rating[cite: 23].
-   **Shopping Cart**: Add and remove products from the cart[cite: 13]. [cite_start]The cart persists during the user's session using `localStorage`[cite: 17].
-   **Real-time Total**: The total price is updated in real-time as items are added to or removed from the cart[cite: 15, 16].
-   **Checkout**: A summary of the purchase with the total price and the option to finalize the order[cite: 26, 27].

## Technologies Used

-   **JavaScript**: The primary programming language for the application's logic and interactivity. 
-   **React**: A JavaScript library for building user interfaces.
-   **React Router**: For declarative routing in the application.
-   **Vite**: A fast build tool for modern web development.
-   **CSS**: For styling the components.
-   **HTML**: The standard markup language used to create the structure of the web pages.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You need to have Node.js and npm (or yarn) installed on your machine.

-   [Node.js](https://nodejs.org/)
-   [npm](https://www.npmjs.com/get-npm) or [yarn](https://classic.yarnpkg.com/en/docs/install/)

### Installation

1.  **Clone the repo**
    ```sh
    git clone [https://github.com/your-username/your-repository.git](https://github.com/your-username/your-repository.git)
    ```
2.  **Navigate to the project directory**
    ```sh
    cd your-repository
    ```
3.  **Install NPM packages**
    ```sh
    npm install
    ```
4.  **Run the development server**
    ```sh
    npm run dev
    ```

The application will be available at `http://localhost:5173`.

## Screenshots

![readme](https://github.com/ecopque/chat-ai-n8n-automation/blob/main/prints/Screenshot%20from%202025-07-22%2017-03-46.png)
![readme](https://github.com/ecopque/chat-ai-n8n-automation/blob/main/prints/Screenshot%20from%202025-07-22%2017-03-56.png)
