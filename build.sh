#!/usr/bin/env bash
# Render build script for the-vanguard — single web service serving both
# the Django API and the built React frontend (see backend/config/urls.py
# and backend/config/views_spa.py for how the two share one process).
set -o errexit

npm install
npm run build

pip install -r backend/requirements.txt
python backend/manage.py collectstatic --noinput
python backend/manage.py migrate
python backend/manage.py seed_demo_data
