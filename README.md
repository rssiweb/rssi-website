1 To Open Terminal
	Win + R => type cmd
2 Go to website folder, type following in terminal
	- E: 
	- cd RSSIWebsite
3 See the changes
	- git status
4 Stage the changes (if modified the existing file)
	- git stage -u
5 Stage the changes (if adding new files)
	- git add <path_to_file>
6 Commit the changes
	- git commit -m "your message"
7 Push the changes to remote
	- git push origin -u master

One Time setup respository on Github
 - create a new repository and copy <remote_URL_from_github> (https://github.com/sahasomnath/RSSIWebsite.git)
 - open the terminal in website folder(step 1 and step 2)
 - git init
 - git add . (to add all files in current directory)
 - git remote add origin <remote_URL_from_github>
 - git config --global user.email "you@example.com"
 - git config --global user.name "Somnath"