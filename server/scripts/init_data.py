from argparse import ArgumentParser
import pandas as pd
import sqlite3
from tqdm import tqdm


def csv_to_db(df: pd.DataFrame, connect: sqlite3.Connection, cursor: sqlite3.Cursor):
    for item in (bar := tqdm(df.itertuples())):
        
        sql = (
            f"insert into dish (name, description, flavor, similar_japanese_dish, " +
            f"ingredients, img_path, category, region) " +
            f"values ('{item.dish_name}', '{item.description}', '{item.flavor}', " +
            f"'{item.similar_japanese_dish}', '{item.ingredients}', '{item.img_path}', " +
            f"'{item.category}', '{item.region}');"
        )
        
        cursor.execute(sql)
        connect.commit()
        
        bar.set_description(f"[Initializing data]")
        

def main(args):
    connect = sqlite3.connect(args.db_path)
    cursor = connect.cursor()
    
    df = pd.read_csv(args.csv_path)
    
    csv_to_db(df, connect, cursor)
    connect.close()


if __name__ == "__main__":
    parser = ArgumentParser()
    
    parser.add_argument("--db-path", required=True)
    parser.add_argument("--csv-path", required=True)
    
    args = parser.parse_args()
    
    main(args)    
    