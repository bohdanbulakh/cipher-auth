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

You can also test a deployed public version of this
app [https://api.cipher-auth.pp.ua/api](https://api.cipher-auth.pp.ua/api)

## What if

To scale the authentication service to 1,000 registrations and 100,000 logins per second, I would use a monolithic
architecture with good horizontal scalability via API Gateway and a load balancer. JWT is used for authentication, which
allows tokens to be verified without referring to the database. User data is stored in PostgreSQL with replication for
read load balancing, and Redis is used for token caching, rate limiting, and session storage.

To reduce delays during registration, secondary processes (such as sending confirmation emails) are handled
asynchronously through a message queue (RabbitMQ or Kafka). This architecture allows the service to scale efficiently,
ensuring speed, stability, and security with a large number of requests.

## Social Login

To implement social login, I would use OAuth. The user clicks “Login with {social network name}”, after which they are
redirected to the social network's authorization page. After successful authorization, the user's data from the social
network is returned to the backend. After that, it creates or finds the user in the database. Then we issue them their
own JWT token.

