## Instructions For Development

Run command `$ yarn install` to install all dependencies

Run command `$yarn start` to run application

Application will run on webpack server in hot reload mode. Every change in code will trigger new build


## Instructions For Production

Run command `$ yarn build` to build dist for production

Run command `$ yarn analyze` to check the size and content of your bundled file


## Test Suite

Run command `$ yarn test` to run test suite

## Docker

Build with `docker build -f Dockerfile -t sample:prod .`

Run docker image `docker run -it -p 80:80 --rm sample:prod`
