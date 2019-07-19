#!/bin/bash

git branch -D heroku-deploy-branch
git checkout -b heroku-deploy-branch
sed \$d .gitignore > .gitignore_temp
mv .gitignore_temp .gitignore

cd front
REACT_APP_WEBHOOK_URL=https://g2sfivq5i5.execute-api.us-west-2.amazonaws.com/prod/v1/webhook npm run build
cd ..
mv front/build application/

git add .
git commit -m "Heroku Deploy"
git push --force heroku heroku-deploy-branch:master
git checkout master
