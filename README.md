# Recipe Manager

This is a full-stack recipe manager application that allows users to add, update, delete, search for recipes, mark recipes as favorites, and generate a report of recipe stats.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installing Node.js](#installing-nodejs)
    - [Windows](#windows)
    - [macOS](#macos)
    - [Linux](#linux)
  - [Installing PostgreSQL](#installing-postgresql)
    - [Windows](#windows-1)
    - [macOS](#macos-1)
    - [Linux](#linux-1)
  - [Installation](#installation)
- [Logger](#logger)
- [Usage](#usage)
  - [Adding a Recipe](#adding-a-recipe)
  - [Updating a Recipe](#updating-a-recipe)
  - [Deleting a Recipe](#deleting-a-recipe)
  - [Marking a Recipe as Favorite](#marking-a-recipe-as-favorite)
  - [Searching for Recipes](#searching-for-recipes)
  - [Generating a Recipe Report](#generating-a-recipe-report)
- [Contributing](#contributing)
- [License](#license)

## Features

- Add new recipes with name, description, and category.
- Update recipe descriptions.
- Delete recipes.
- Mark recipes as favorites.
- Search for recipes by name, description, or category.
- Generate a report of total number of recipes and favorites/non-favorites.

## Technologies Used

- Front-end: HTML, SCSS, JavaScript
- Back-end: Node.js, Express, PostgreSQL

## Logger

The application uses a logger to keep track of various events and errors. Here's what it logs and where:

- **Events Logged**: 
  - Server start
  - Recipe creation
  - Recipe update
  - Recipe deletion
  - Error events

- **Log Location**:
  - Logs are stored in the `server/logs/` directory.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed
- [PostgreSQL](https://www.postgresql.org/) installed

### Installing Node.js

#### Windows

1. **Download the Node.js installer** from the [official Node.js website](https://nodejs.org/).
2. **Run the installer**:
   - Follow the prompts in the installer.
   - The default settings are usually sufficient.
3. **Verify the installation**:
   - Open a new command prompt window and run the following command to check the version of Node.js:
     ```bash
     node -v
     ```
   - You should see the installed version of Node.js.

#### macOS

1. **Download the Node.js installer** from the [official Node.js website](https://nodejs.org/).
2. **Run the installer**:
   - Follow the prompts in the installer.
   - The default settings are usually sufficient.
3. **Verify the installation**:
   - Open a new Terminal window and run the following command to check the version of Node.js:
     ```bash
     node -v
     ```
   - You should see the installed version of Node.js.

#### Linux

1. **Use the package manager**:
   - For Ubuntu or Debian-based distributions, run the following commands:
     ```bash
     sudo apt update
     sudo apt install nodejs npm
     ```
   - For CentOS or Fedora-based distributions, run the following commands:
     ```bash
     sudo yum install nodejs npm
     ```
2. **Verify the installation**:
   - Open a new Terminal window and run the following command to check the version of Node.js:
     ```bash
     node -v
     ```
   - You should see the installed version of Node.js.

### Installing PostgreSQL

#### Windows

1. **Download the PostgreSQL installer** from the [official PostgreSQL website](https://www.postgresql.org/download/).
2. **Run the installer**:
   - Follow the prompts in the installer.
   - Make sure to remember the password you set for the PostgreSQL superuser (postgres).
3. **Verify the installation**:
   - Open a new command prompt window and run the following command to check the version of PostgreSQL:
     ```bash
     psql -V
     ```
   - You should see the installed version of PostgreSQL.

#### macOS

1. **Download the PostgreSQL installer** from the [official PostgreSQL website](https://www.postgresql.org/download/).
2. **Run the installer**:
   - Follow the prompts in the installer.
   - Make sure to remember the password you set for the PostgreSQL superuser (postgres).
3. **Verify the installation**:
   - Open a new Terminal window and run the following command to check the version of PostgreSQL:
     ```bash
     psql -V
     ```
   - You should see the installed version of PostgreSQL.

#### Linux

1. **Use the package manager**:
   - For Ubuntu or Debian-based distributions, run the following commands:
     ```bash
     sudo apt update
     sudo apt install postgresql postgresql-contrib
     ```
   - For CentOS or Fedora-based distributions, run the following commands:
     ```bash
     sudo yum install postgresql-server postgresql-contrib
     sudo postgresql-setup initdb
     sudo systemctl start postgresql
     sudo systemctl enable postgresql
     ```
2. **Set the PostgreSQL password**:
   - Switch to the postgres user:
     ```bash
     sudo -i -u postgres
     ```
   - Open the PostgreSQL prompt:
     ```bash
     psql
     ```
   - Set the password:
     ```sql
     \password postgres
     ```
   - Enter a password and confirm it. Make sure to remember this password.
   - Exit the PostgreSQL prompt:
     ```sql
     \q
     ```
   - Exit the postgres user:
     ```bash
     exit
     ```

> [!IMPORTANT]
> **Remember to securely store your PostgreSQL password**: The password you set during the PostgreSQL installation is crucial for connecting to your database. Ensure that you store this password securely, as you will need it to configure the application properly and for future database access.

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/Styri/Recipe-Manager.git
    cd Recipe-Manager
    ```

2. **Set up environmental variables:**

    - Create an `.env` file in the `server/config` directory and add the necessary environmental variables.
    - Example:

    ```
    DB_HOST=localhost
    DB_PORT=5432
    DB_USER=your_db_user
    DB_PASSWORD=your_db_password
    DB_NAME=your_db_name
    ```

3. **Install dependencies:**

    ```bash
    cd server
    npm install
    ```

4. **Run the setup script:**

    ```bash
    npm run setup
    ```
    
> [!NOTE]
> The setup.js file will create a new database with the name you added in the DB_NAME variable in the .env file and a new table called recipes.

5. **Run the server:**

    ```bash
    node index.js
    ```

6. **Open the application:**

    - Open `front-end/index.html` in your browser to view the application.

## Usage

### Adding a Recipe

1. Fill in the recipe name, description, and select a category.
2. Click the button with the "add" icon.

### Updating a Recipe

1. Click the button with the "edit" icon next to the recipe you want to update.
2. Enter the new description on the modal that appears and click "Update".

### Deleting a Recipe

1. Click the button with the "delete" icon next to the recipe you want to delete.

### Marking a Recipe as Favorite

1. Click the button with the "favorite" icon next to the recipe you want to mark as favorite.

### Searching for Recipes

1. Enter the search term in the search input field to search by name, description, or category.

### Generating a Recipe Report

1. Click the "Generate Recipe Report" button to see the total number of recipes and favorites/non-favorites.

## Contributing

If you would like to contribute, fork the repository and make changes as you'd like. Pull requests are welcome!

## License

This project is licensed under the MIT License.

