# Fingerprinting Project
Node server that connects to a mongo instance for storing some sneaky stuff.

### About
Joe Catudal, Anna Lubienski, Pranav Rao  
University of Wisconsin, Madison  
CS 782  
Kassem Fawaz

### Setup:
1. Clone this repo somewhere
2. Create a branch from master (we cannot edit master directly)
3. Switch to your branch if it didn't switch automatically
4. Run the script `npm install` in the root directory of this project
5. Create a file in the root directory called `.env`
6. Inside that file, write: `MONGO_URI=[url I sent you, no brackets]`
7. Run `npm run dev`
8. Open the web page [localhost:8080](http://localhost:8080)
9. You can now develop this!

### Prerequisites/Notes
* You will need NodeJS installed on your computer
* We store the Mongo connection URL in a `.env` file for security reasons

### Making Edits:
1. Run `git pull origin master`. This will update your local branch.
2. Make your edits
3. Commit them locally
4. Push your edits
5. In Github, make a Pull Request
6. If there are no conflicts, then approve the pull request
   1. If there are conflicts, then we should discuss them