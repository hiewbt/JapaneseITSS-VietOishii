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

Export a secret key for the session
```bash
export SECRET_KEY=<your secret key>
```

Run the server in debug mode
```bash
python src/app.py
```

Import data into the database
```bash
sh scripts/import_data.sh
```

# List of APIs

| End point             | Methods   | Description |
|-----------------------|-----------|-------------|
| /api/register         | POST      |             |
| /api/login            | POST      |             |
| /api/logout           | POST      |             |
| /api/dishes           | GET       |             |
| /api/filter_dishes    | POST      |             |
| /api/search           | GET       |             |
