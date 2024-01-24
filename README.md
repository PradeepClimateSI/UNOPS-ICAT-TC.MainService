# TC-Tool - Main Service

Main service used to handle all country services in TC tool - TC-Tool.

Supported by [Initiative for Climate Action Transparency - ICAT](https://climateactiontransparency.org/).

Built using [Node.js 16](https://nodejs.org/dist/latest-v16.x/docs/api/) and [Nest](https://github.com/nestjs/nest) framework.

## Database Configuration

This application uses a [MySQL Database](https://www.mysql.com/). The `Main.sql` configuration file containing the database schema and some dummy data is provided in the root folder.

## Manual Installation

1. Download and install the [Node.js 16 LTS version](https://nodejs.org/en/download/releases) for your operational system.

2. Download or clone this repository.

3. In the terminal, go to this repository's main folder.

4. Install the NPM dependencies (including Nest) with the command:


```bash
$ npm install --force
```

5. Set up the Environment Variables

  - In the machine:
    - **Windows:** using the `set` command in the terminal
    - **Linux/MacOS:** using the `export` command in the terminal

  - Or creating a `.env` file using `.env.example` as base

6. Run the app:

```bash
$ npm run start
```
## Google Cloud Installation with Docker

> This is an example cloud installation using [Docker](https://www.docker.com/) and Google Cloud Plataform. The provided `Dockerfile` can be used for local or cloud installation with different services.

1. In GCP Console, go to [Artifact Registry](https://console.cloud.google.com/artifacts) and enable the Artifact Registry API

2. In the Artifact Registry, create a new repository:

   - **Format:** Docker
   - **Type:** Standard
   - **Location:** desired application location
   - **Encryption:** Google-managed key

3. Download and install [gcloud CLI](https://cloud.google.com/sdk/docs/install).

4. Download or clone this repository.

5. In the terminal, go to this repository's main folder.

6. Build your container in the Artifacts Register using the provided `Dockerfile`. The container path can be found on the Artifact Registry's repository page.

  ```bash
  $ gcloud builds submit --tag [CONTAINER PATH]
  ```

7. Go to [Cloud Run](https://console.cloud.google.com/run) and create a New Service:
   - Choose the option `Deploy one revision from an existing container image` and select the container image updated in the previous step
   - Add a service name
   - Select the application region
   - Select `Allow unauthenticated invocations` in the Authentication option
   - In the **Container section**:
     - Select Container port 7080
     - Add the Environment Variables
     - Add the Cloud SQL connections

> Noticed that some [special permissions in GCP](https://cloud.google.com/run/docs/reference/iam/roles#additional-configuration) can be necessary to perform these tasks.

## Environment Variables

The environment variables should be declared as follow:

| Variable name                    | Description                                    |
| -------------------------------- | ---------------------------------------------- |
| `PORT`                           | Application Port(*)                            |
| `DATABASE_HOST`                  | Database Host(*)                               |
| `SOCKET_PATH`                    | Database Socket Path(*)                        |
| `DATABASE_PORT`                  | Database Port(*)                               |
| `DATABASE_USER`                  | Database Socket User(*)                        |
| `DATABASE_PASSWORD`              | Database Password(*)                           |
| `DATABASE_NAME`                  | Database Name(*)                               |
| `MAIN_URL`                       | Main service url(*)                            |
| `AUTH_URL`                       | Auth service url(*)                            |
| `AUDIT_URL`                      | Audit service url(*)                           |
| `ClientURl`                      | Country application url(*)                     |
| `EMAIL`                          | email for email service(*)                     |
| `EMAIL_PASSWORD`                 | email password(*)                              |
| `EMAIL_HOST`                     | email host(*)                                  |
| `KEY`                            | system security key(*)                         |
| `JWT_expiresIn`                  |jwt verification token expiration tome(*)       |
| `JWT_VERIFICATION_TOKEN_SECRET`  | jwt verification token(*)                      |


> (*) Can be used the Database Host or the Database Socket Path depending of the database configuration

## API Documentation

After the application installation, the API Documentation is available in the application URL + `/api/` with [Swagger](https://swagger.io/solutions/api-documentation/).


## License

  Nest is [MIT licensed](LICENSE).
