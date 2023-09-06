import pandas as pd
import sqlite3
def load_data_from_excel():
    df = pd.read_excel('products.xlsx')
    conn = sqlite3.connect('database_products.db')
    df.to_sql('products', conn, index=False, if_exists='replace')
    conn.close()

load_data_from_excel()
