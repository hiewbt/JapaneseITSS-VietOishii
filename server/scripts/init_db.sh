mkdir -p database
db_path=database/database.db
touch ${db_path}

python scripts/init_data.py --db-path ${db_path} --csv-path resource/data.csv