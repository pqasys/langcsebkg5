@echo off
C:\wamp64\bin\mysql\mysql8.0.31\bin\mysql -u root -e "DROP DATABASE IF EXISTS csebook_test; CREATE DATABASE csebook_test;"
C:\wamp64\bin\mysql\mysql8.0.31\bin\mysql -u root csebook_test < csebook_backup.sql
C:\wamp64\bin\mysql\mysql8.0.31\bin\mysql -u root csebook_test < prisma\migrations\20240320000002_add_category_fields\migration.sql 