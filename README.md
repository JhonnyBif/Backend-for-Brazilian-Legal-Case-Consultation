# Backend for Brazilian Legal Case Consultation

This repository contains the source code for the **backend** developed for an academic project aimed at allowing consultations to Brazilian legal cases using the case number as a search parameter.

## Technologies Used

- **Nest.js**

## Prerequisites

Before getting started, make sure you have installed on your machine:

- **Node.js**
- **npm** (or yarn)

## Installation

1. **Clone this repository:** `git clone https://github.com/your-username/your-repository.git`
2. **Navigate to the project directory:** `cd your-repository`
3. **Install the dependencies:** `npm install`

## Usage

1. **Start the server:** `npm start`
2. **Access** `http://localhost:3000` **in your browser.**
3. **Send a POST request to** `http://localhost:3000` **with a JSON object in the request body containing the case number to be queried.**

Example JSON object:

```json
{
  "n_processo": "CASE NUMBER"
}
```
## Accessing the Frontend

To access the frontend repository, please visit the [Frontend Repository](https://github.com/your-username/your-repository.git).

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

Nest is [MIT licensed](LICENSE).
