mkdir -p database
db_file=database/database.db
[ ! -e $db_file ] && touch $db_file

export HOST=0.0.0.0
export PORT=8080

database_path=`pwd $db_file`/$db_file
export DB_URI="sqlite:///$database_path"

export SECRET_KEY=dino12345@