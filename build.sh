#!/usr/bin/env bash
# Render build script for the-vanguard backend web service.
# (The frontend is a separate static site — see the "the-vanguard-frontend"
# service, which builds straight from package.json with no script needed.)
set -o errexit

pip install -r backend/requirements.txt
python backend/manage.py collectstatic --noinput
python backend/manage.py migrate
python backend/manage.py seed_demo_data
