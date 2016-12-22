# Laser Quest
This is the central server for a science project where we improve the Laser Quest experience.
## Installing and running
1. Clone from GitHub
2. Create a Firebase project, create a service account, make a new folder called `config` in this folder and put the JSON file for your service account's private key in there
3. Set up your `.env` file to match this format, replacing placeholders in angle brackets:
  ```
  MONGO_URL=mongodb://<YOUR_MONGO_URL>
  FIREBASE_CONFIG="var config = {apiKey: '<YOUR_FIREBASE_API_KEY', authDomain: '<YOUR_PROJECT_ID>.firebaseapp.com', databaseURL: 'https://<YOUR_PROJECT_ID>.firebaseio.com', storageBucket: '<YOUR_PROJECT_ID>.appspot.com', messagingSenderId: '<YOUR_MESSAGING_SENDER_ID>' };"
  MFA_KEY="-----BEGIN RSA PRIVATE KEY-----<A_2048_BIT_RSA_PRIVATE_KEY>-----END RSA PRIVATE KEY-----\n"
  FIREBASE_KEY="./config/<PATH_TO_YOUR_FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY>"
  FIREBASE_PUBLIC_KEY="<GO_TO_YOUR_CLIENT_CERT_URL_THEN_PASTE_THE_CERT_WITH_YOUR_PRIVATE_KEY_ID_FROM_YOUR_FIREBASE_SERVICE_ACCOUNT_FILE_HERE>"
  FIREBASE_DB_URL="https://<YOUR_PROJECT_ID>.firebaseio.com"
  ```
4. `npm install`
5. To set up your first user, `npm run setup` then follow the instructions in the console
6. To run the server, `npm start`. To use the API, you need to authenticate with the token shown after you sign in. It expires in an hour. To test just the public html pages, `npm run webserver`.
