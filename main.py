import uvicorn as uvicorn
from fastapi import FastAPI, HTTPException, Form, Body
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from database import Database

app = FastAPI()
database = Database()


@app.post("/search")
async def search(search_query: str = Form(...)):
    print(search_query)
    results = database.select_item(search_query)
    return {"results": results}


@app.post("/delete")
async def delete(data=Body()):
    print(data)
    name = data['delete_query']
    database.delete_item(name)


@app.post("/add")
async def add(data=Body()):
    print(data)
    name = data['add_query']
    database.add_item(name)


@app.get("/view")
async def view():
    results = database.get_all_items()
    return {"results": results}


app.mount("/", StaticFiles(directory="static", html=True), name="static")
