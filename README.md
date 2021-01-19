## Overview
Sample React+Django+Postgres+Docker wepapp, wired together with a docker-compose file.
Meant to enable one to quickly spin up a local dev environment that requires the aforementioned software stack.

## Caveats

#### This app doesn't do anything practial or userful or clever

The objective is to demonstrate how to hook up a few containers together in a single step, emulating a very typical
dev environment for creating webapps.

## Setup

#### Prerequisites

This has only been tested on Ubuntu 20.04.

1. Docker and docker-compose

2. There is a setting called GOOGLE_API_KEY. It's a key to Google's maps APIs. You get billed for having one.
If you don't add a valid key, addresses and geocoordinates will be faked. If you have a key, add it to your `.env` file.

#### Step-by-step

1. Clone the repo.

2. `cd geoapp`

3. You need an `.env` file: `cp .env.sample .env`.
Edit `.env` and change anything that conflicts with your local system.
Use your own Google maps API key for GOOGLE_API_KEY or remove this line completely.

4. Build the containers:

- `docker-compose build ui`

- `docker-compose build app`

5. Django setup:

- Django demands work. Run these commands:

- `docker-compose run --rm app migrate`

- `docker-compose run --rm app createsuperuser`. Follow the instructions.

6. If you got this far, run the app:

- `docker-compose up --build app`

- Navigate to `http://localhost:8098` (if you didn't change the HOST_UI_PORT setting in `.env`).


## TODO:

Tests.

Webpack prod bundle.

Change the ui container to local uid.

`await` on fetches.
