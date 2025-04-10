# Java Data Pipeline Platform

## Overview

Java Data Pipeline Platform is a full-stack application mocking on how Apache Airflow and Azure Data Factory automate and orchestrate data pipeline. This platforms is developed combining a Spring Boot back end with a React front end. It provides a visual, graph-based interface for designing and executing complex data processing workflows, including running Python scripts. 

## Features

- **Visual Pipeline Editor:**  
  Build and rearrange your workflow using a drag-and-drop interface.
- **Configurable Nodes:**  
  Each node (e.g., CSV Database, Python Script) can be customized via an easy-to-use sidebar.
- **Dynamic Execution:**  
  Nodes execute Python scripts (or other code types in the future), returning detailed statuses for branching.
- **Integrated Logging:**  
  A built-in terminal panel displays server logs in real time.
- **Monorepo Structure:**  
  Both the Spring Boot back end and React front end reside in the same repository for easier management.

## Prerequisites

- **Java Development Kit (JDK):**  
  Version 21.0.5 (or later) is recommended. Download from [Eclipse Adoptium](https://adoptium.net/).
  https://download.java.net/openjdk/jdk21/ri/openjdk-21+35_windows-x64_bin.zip

- **Apache Maven:**  
  Used for building and running the Spring Boot application. Make sure `mvn` is accessible from your command line.
  https://dlcdn.apache.org/maven/maven-3/3.9.9/binaries/apache-maven-3.9.9-bin.zip
  
- **Node.js and NPM:**  
  Required to run the React front end. Download from [nodejs.org](https://nodejs.org/).
  https://nodejs.org/dist/v22.14.0/node-v22.14.0-win-x64.zip

- **Git:**  
  To clone and manage the repository.

- **IMPOTANT FOR MODULARITY:**
  Copy and paste the zip files downloaded for JDK, Maven and Node.js to /tools folder.
  The Python_Orchestration_Pipeline.bat will automatically create a local temporary environment to run the apps.


## Running the Application

### Development Mode
Option 1:
  Run Python_Orchestration_Pipeline.bat to automate the applications startups. It will install Maven, Java and 
  Or
Option 2:
1. **Run the Front End:**
   - Navigate to the `frontend` folder:
     ```bash
     cd frontend
     npm install
     npm start
     ```
   - The React development server will run on [http://localhost:3000](http://localhost:3000).

2. **Run the Back End:**
   - Open another terminal, navigate to the `backend` folder:
     ```bash
     cd backend
     mvn spring-boot:run
     ```
   - The Spring Boot back end will run on [http://localhost:8080](http://localhost:8080).

### Production Mode

1. **Build the React App:**
   - In the `frontend` folder, run:
     ```bash
     npm run build
     ```
   - This creates a `build/` folder with static assets.

2. **Integrate with Spring Boot:**
   - Copy the contents of the `frontend/build` folder into the `backend/src/main/resources/static` directory.
   
3. **Package and Run the Back End:**
   - In the `backend` folder, run:
     ```bash
     mvn clean package
     java -jar target/yourapp.jar
     ```
   - The application will serve both the back end and the React front end on port 8080.

---
