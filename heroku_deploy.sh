#!/bin/bash

git checkout -b heroku-deploy-branch
sed \$d .gitignore > .gitignore_temp
mv .gitignore_temp .gitignore

cd front
npm run build
cd ..
mv front/build application/

git add .
git commit -m "Heroku Deploy"
git push --force heroku heroku-deploy-branch:master
