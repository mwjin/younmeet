# Team 8 SWPP Project: You & Meet

master:
[![Build Status](https://travis-ci.org/swsnu/swpp17-team8.svg?branch=master)](https://travis-ci.org/swsnu/swpp17-team8)
[![Coverage Status](https://coveralls.io/repos/github/swsnu/swpp17-team8/badge.svg?branch=master)](https://coveralls.io/github/swsnu/swpp17-team8?branch=master)

dev:
[![Build Status](https://travis-ci.org/swsnu/swpp17-team8.svg?branch=dev)](https://travis-ci.org/swsnu/swpp17-team8)
[![Coverage Status](https://coveralls.io/repos/github/swsnu/swpp17-team8/badge.svg?branch=dev)](https://coveralls.io/github/swsnu/swpp17-team8?branch=dev)

## Branch management

- We will work in the ``dev`` branch when implementing features.
- Avoid pushing features directly into the ``dev`` branch. Create features in a separate branch, and submit a pull request. (Temporarily Philsik will manage the pull requests.)
- We will push the contents of the ``dev`` branch to the ``master`` branch at the end of each sprint.

## Repo structure

- ``/frontend``: folder for frontend (Angular)
- ``/backend``: folder for backend (Django)

## Build Instructions

- Angular
  - Installing dependencies: ``npm install``
  - Running the app: ``npm start``
  - Testing: ``ng test``
- Django
  - Running the app: ``python manage.py runserver``
  - Testing: ``python manage.py test``
  - Note: if Python 2 is the default for the system, use python3 command instead of python
