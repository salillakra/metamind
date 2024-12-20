# Metamind

Welcome to the Metamind project! This README will guide you through the setup and usage of the project.

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Introduction

MetaMind is a blogging site that provides insightful articles on various topics. The project uses several environment variables shown below

## Tech Stack

Metamind is built using a modern tech stack to ensure high performance and scalability. The key technologies used in this project are:

- **Next.js**: A React framework that enables server-side rendering and static site generation, providing a seamless user experience and improved SEO.
- **TanStack Store**: A powerful state management library that helps manage the application's state efficiently.
- **Tailwind CSS**: A utility-first CSS framework that allows for rapid UI development with a consistent design system.
- **MongoDB**: A NoSQL database that stores data in a flexible, JSON-like format, making it easy to scale and manage.
- **Mongoose**: An ODM (Object Data Modeling) library for MongoDB and Node.js, providing a straightforward way to model application data.
- **Quill.js**: A rich text editor that offers a user-friendly interface for creating and editing content.

These technologies work together to create a robust and maintainable codebase for the Metamind project.

## Installation

To get started with Metamind, follow these steps:

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/metamind.git
    ```
2. Navigate to the project directory:
    ```sh
    cd metamind
    ```
3. Install the necessary dependencies:
    ```sh
    npm install
    ```

## Usage

To run the project, use the following command:
```sh
npm start
```


## Contributing

We welcome contributions from the community. To contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch:
    ```sh
    git checkout -b feature-branch
    ```
3. Make your changes and commit them:
    ```sh
    git commit -m "Description of your changes"
    ```
4. Push to the branch:
    ```sh
    git push origin feature-branch
    ```
5. Open a pull request.

## Enviroment Varibles

```env
NODE_ENV="" #(development || production)
SECRET=""

# bcrypt
SALT_ROUNDS=10 

# mongoose connection
MONGODB_URI=""

# cloudinary
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```


## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
