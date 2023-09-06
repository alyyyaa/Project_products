import sqlite3
from script import load_data_from_excel


class Database:
    def __init__(self):
        load_data_from_excel()

        self.conn = sqlite3.connect('database_products.db')
        self.cur = self.conn.cursor()

        self.cur.execute('''
            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY,
                product_name TEXT
            )
        ''')

        self.cur.execute('''
            CREATE INDEX IF NOT EXISTS product_name_index ON products(product_name)
        ''')
        self.conn.create_function('mylower', 1, self.lower_string)

    def lower_string(self, str_: str):
        return str_.lower()

    def select_item(self, query: str):
        with self.conn:
            results = self.cur.execute('''
                    SELECT product_name 
                    FROM products 
                    WHERE mylower(product_name) LIKE ?
                    order by id
                ''', (f'%{query.lower()}%',)).fetchall()
            results = list(map(lambda x: x[0], results))
            print(results)
            return results

    def delete_item(self,name:str):
        with self.conn:
            self.cur.execute("DELETE FROM products WHERE product_name = ?", (name,))
            self.conn.commit()

    def add_item(self,name:str):
        with self.conn:
            self.cur.execute("INSERT INTO products (product_name) VALUES (?)", (name,))
            self.conn.commit()

    def get_all_items(self):
        with self.conn:
            results = self.cur.execute("SELECT product_name FROM products ORDER BY id").fetchall()
            results = list(map(lambda x: x[0], results))
            return results