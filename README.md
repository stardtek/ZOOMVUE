# HOGS Sallon

## Usage

Create `.env` file, look in `.env.example` for needed parameters

```shell
npm install
npm run dev
```

## Deploy on heroku

First set up `client/.env` file, check example in `client/.env.example`

```shell
heroku create # only run to make new app 
npm install
cd client
npm install
npm run build
cd ..
git add .
git commit -m "deploy message"
git push heroku master # or 'otherBranchName:master' to deploy another branch
```

## HTTPS connection, SSL certificate
This certificate only works for localhost HTTPS, not for WSS or i just don't know how to configure

```sh
openssl req -x509 -out server.crt -keyout server.key \
  -newkey rsa:2048 -nodes -sha256 \
  -subj '/CN=localhost' -extensions EXT -config <( \
   printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
```

## Testing on other devices, ex. phone

Go to `chrome://flags/#unsafely-treat-insecure-origin-as-secure` in Chrome and find option
`Insecure origins treated as secure`, enable it and add in IP:PORT of VUE app, for example: "http:192.168.1.5:8080".
This enables you to use camera and microphone on unsecure site. Disable when done testing!!!
