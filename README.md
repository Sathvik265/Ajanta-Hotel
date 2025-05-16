# Ajanta Hotel

Ajanta Hotel is an offline room tracking app built with Vite, React, and TypeScript. It supports features like room occupancy/maintenance toggling, local history per room, and offline/local storage support.

## Features

- Grid of up to 300 rooms
- Toggle room status (available, occupied, maintenance)
- Local history tracking for each room
- Offline/local storage support

## How to Download and Run the App Locally

### Steps to Run the App

1. **Download the App**:

   - Go to the repository: [Ajanta Hotel](https://github.com/Sathvik265/Ajanta-Hotel).
   - Click the green **Code** button and select **Download ZIP**.
   - Extract the ZIP file to a folder on your computer.

2. **Install Node.js**:

   - Download and install [Node.js](https://nodejs.org/).

3. **Open the Folder**:

   - Open the extracted folder in a terminal or command prompt.

4. **Install Dependencies**:

   - Run the following command to install all required dependencies:
     ```bash
     npm install
     ```

5. **Run the App**:

   - To run the app in development mode:
     ```bash
     npm run electron:dev
     ```
   - This will open the app in an Electron window, and all data will be saved locally on your system.

6. **Build the App for Production** (Optional):
   - To create a production-ready version of the app:
     ```bash
     npm run electron:build
     ```
   - This will generate an executable file that you can use to run the app without needing a terminal.

## License

This project is licensed under the MIT License.
