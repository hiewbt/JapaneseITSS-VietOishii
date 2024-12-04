endpoint=$1

if [ -z $2 ]; then
  data_flag=""
else
  data_flag="-d $2"
fi

curl -X POST http://localhost:8888$endpoint \
  -H "Content-Type: application/json" \
  $data_flag