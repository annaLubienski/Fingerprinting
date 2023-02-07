# Fingerprinting Project
Node server that connects to a mongo instance for storing some sneaky stuff.

### About
Joe Catudal, Anna Lubienski, Pranav Rao  
University of Wisconsin, Madison  
CS 782  
Kassem Fawaz

### Setup:
1. Clone this repo somewhere
2. Run the script `npm install` in the root directory of this project
3. Create a file in the root directory called `.env`
4. Inside that file, write: `MONGO_URI=[url I sent you, no brackets]`
5. Run `npm run dev`
6. Open the web page [localhost:8080](http://localhost:8080)
7. You can now develop this!

### Prerequisites/Notes
* You will need NodeJS installed on your computer
* We store the Mongo connection URL in a `.env` file for security reasons