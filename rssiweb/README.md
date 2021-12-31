## For any changes
- To Open Terminal
	Win + R => type cmd
- Go to website folder, type following in terminal
	- E: 
	- cd RSSIWebsite
- See the changes
	- git status
- Stage the changes (if modified the existing file)
	- git stage -u
- Stage the changes (if adding new files)
	- git add <path_to_file>
- Commit the changes
	- git commit -m "your message"
- Push the changes to remote
	- git push origin -u master

## First Time setup
One Time setup respository on Github
 - create a new repository and copy <remote_URL_from_github> (https://github.com/rssiweb/RSSIWebsite.git)
 - open the terminal in website folder(step 1 and step 2)
 - git init
 - git add . (to add all files in current directory)
 - git remote add origin <remote_URL_from_github>
 - git config --global user.email "you@example.com"
 - git config --global user.name "Somnath"



 - `git pull`
 - `git rm -rf Folder1`
 - `git rm -rf Folder1`
 - `git add .`
 - `git commit -m “Folder1 deleted”`
 - `git push`

Pull changes form github
- `git fetch --all`

git fetch origin d75e8d81318243376cf355c5ec4dfa84f3b
git checkout FETCH_HEAD
git checkout -b "rssiweb"
git push --all
git push --set-upstream origin rssiweb


pipenv run flask run

pipenv --rm
pipenv install

pip install pipenv
pip3 install pipenv

pip install flask
To activate this project's virtualenv, run pipenv shell.
Alternatively, run a command inside the virtualenv with pipenv run.

Password change
--------------------------
you can visit the portal at /generate-hash-for/<password-here>
copy the hash and put it in the github secrets


Change in .env file offline
---------------------------------
Run new terminal and type
pipenv run flask generate-hash-for 2310
copy the code and replace it.