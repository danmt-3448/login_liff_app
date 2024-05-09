# Prerequisite

- Install mkcert: <https://github.com/FiloSottile/mkcert#installation>

# Config

- Generate CA: `mkcert -install`
- Generate certificate: `mkcert localhost`
- Copy `localhost-key.pem` and `localhost.pem` into cloned project `WellnessConnect-FE/.certificate`
- Run: `yarn dev`
- Open [https://localhost:3000](https://localhost:3000) with your browser to see the result.
