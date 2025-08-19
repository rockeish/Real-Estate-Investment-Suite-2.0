#!/bin/bash
set -e

echo "Initializing database..."

export PGPASSWORD=$DB_PASSWORD

echo "Checking if database exists..."
psql -U "$DB_USER" -h "$DB_HOST" -p "$DB_PORT" -tc "SELECT 1 FROM pg_database WHERE datname='$DB_DATABASE'" | grep -q 1 || {
  echo "Database does not exist. Creating it..."
  psql -U "$DB_USER" -h "$DB_HOST" -p "$DB_PORT" -c "CREATE DATABASE \"$DB_DATABASE\""
  echo "Database created."
}

echo "Creating tables..."
psql -U "$DB_USER" -h "$DB_HOST" -p "$DB_PORT" -d "$DB_DATABASE" -f db/database.sql
echo "Database initialization complete."
