endpoint=$1
data=$2

curl -X POST http://localhost:8888${endpoint} \
  -H "Content-Type: application/json" \
  -d ${data} \
