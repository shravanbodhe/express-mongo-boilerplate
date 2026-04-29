// clone this project
// add .env file
// change db name in .env
// npm install
// npm run dev

New Project Deploy Checklist

1. Local Machine

git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/shravanbodhe/NEW-PROJECT.git
git push -u origin main

2. MongoDB Atlas:

.env मध्ये फक्त DB name बदल

MONGO_URI_PROD=mongodb+srv://dbadmin:admin123@storageserver.sf5oi3m.mongodb.net/NEW-DB-NAME?appName=storageServer

3. EC2 वर (SSM Terminal मधून):

sudo su - ubuntu
cd ~
git clone https://github.com/shravanbodhe/NEW-PROJECT.git
cd NEW-PROJECT
npm install
nano .env # credentials paste कर
pm2 start server.js --name NEW-PROJECT
pm2 save

4. deploy.yml मध्ये फक्त हे बदल:

# folder name बदल

cd /home/ubuntu/NEW-PROJECT

# pm2 name बदल

pm2 restart NEW-PROJECT

5. GitHub Secrets:

Same secrets वापर — बदलायची गरज नाही
