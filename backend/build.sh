#!/usr/bin/env bash
# exit on error
set -o errexit

pip install --upgrade pip setuptools
pip install -r requirements.txt
pip list
python manage.py collectstatic --no-input
python manage.py migrate
