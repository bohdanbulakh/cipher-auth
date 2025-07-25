# Cipher Auth App
A simple authorization app

## Installation

1. Clone this repository:
    ```shell
    git clone https://github.com/bohdanbulakh/cipher-auth.git
    ```
2. Create .env files, use .env.example files for reference
3. Replace paths to .env files and mapped ports/volumes in [docker-compose.yaml](docker-compose.yaml)
4. Comment `image` section in docker-compose and uncomment `build`
5. Start the application:
    ```shell
    docker compose up -d
    ```
You can also test a deployed public version of this app [https://api.cipher-auth.pp.ua/api](https://api.cipher-auth.pp.ua/api)
