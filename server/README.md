# How to run
Create a virtual environment using ```pyvenv``` or ```conda```.

```pyvenv```
```bash
python -m venv <env path>
source <env path>/bin/activate
```

```conda```
```bash
conda create -n <env name> python=3.12
conda activate <env name>
```

Install dependencies
```bash
pip install -r requirements.txt
```

Initialize the database
```bash
sh scripts/init_db.sh
```

Run the server in debug mode
```bash
python src/app.py
```

# List of APIs

| End point     | Methods | Description |
|---------------|---------|-------------|
| /api/register | POST    |             |
| /api/login    | POST    |             |
| /api/logout   | GET     |             |
| /api/dishes   | GET     |             |
