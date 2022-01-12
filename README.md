# RSSI frontend

## Add new secure page
- add new directory `mysecurepage` in `rssiweb/rssiweb/templates`
- Add the above 2 secrets in rssiweb/services repo
  https://github.com/rssiweb/services/settings/secrets/actions
  this time with proper values
  ```
  WEB_MYSECUREPAGE_USER: myuser
  WEB_MYSECUREPAGE_USER: 7678635hgf345hg34f5hg43f (get hashed value for the password using this link https://rssi.in/generate-hash-for/<your-password-here>)
- add 2 lines under `env:` section of `.github/workflows/publish.yml` file in rssiweb/services repo
  link to the file: https://github.com/rssiweb/services/blob/master/.github/workflows/publish.yml#L8

  let's assume we want to have userid and password as follows\
  userid: myuser\
  password: 1234\
  so the two env variables you should add will be
  ```
  WEB_MYSECUREPAGE_USER: ${{ secrets.WEB_MYSECUREPAGE_USER }}
  WEB_MYUSER_CODE: ${{ secrets.WEB_MYUSER_CODE }}
  ```
- Commit and push the changes it will deploy.

## Update password for secure pages
- Get hashed value for a password using this link
  https://rssi.in/generate-hash-for/<your-password-here>
- update the secret value under https://github.com/rssiweb/services/settings/secrets/actions
- Go to https://github.com/rssiweb/services/actions/workflows/publish.yml
  click on `Run Workflow` drop-down menu then again click on `Run Workflow` button to deploy the changes
