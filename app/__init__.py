# Team Big Birds -- Cameron Nelson, Sophie Liu, Alif Abdullah
# Softdev Pd 2
# p2
# 2022-03-02

import sqlite3, json, os
from flask import Flask, render_template, request, redirect


app = Flask(__name__)
app.secret_key = os.urandom(32);

MAIN_DB = 'users.db'
db = sqlite3.connect(MAIN_DB)
c = db.cursor()

c.execute("""
CREATE TABLE IF NOT EXISTS users (
    ROWID   INTEGER PRIMARY KEY,
    username TEXT   NOT NULL,
    hash     TEXT   NOT NULL
);""")

db.commit()
db.close()

@app.route("/")
def index():
    return "Hello World";
       
@app.route("/login")
def login():
    if request.method == 'GET':
        return "GET";
    else:
        return "POST";
    
@app.route("/signup", methods=['GET','POST'])
def signup():
    if request.method == 'GET':
        return """<!DOCTYPE html> <html> <body> <form action="/signup" method="POST"> Username: <input type='text' name='username'> <br> <br> Password: <input type='text' name='password'> <input type='submit' value='Submit'> </form></body> </html>
        """;
    else:
        if not ('username' in request.form):
            return 'Username required!';
        if not ('password' in request.form):
            return 'Password required!';
        user = request.form.get('username');
        passw = request.form.get('password');
        db = sqlite3.connect(MAIN_DB)
        c.execute("""SELECT * FROM users WHERE USERNAME = ?""", (user,));
        if c.fetchone != None:
            return 'Username already exists!';
        if user.isalnum() and not (' ' in passw or '\\' in passw):
            c = db.cursor();
            c.execute("""INSERT INTO users (username,hash) VALUES (?,?)""", (user, passw,));
            db.commit();
            return redirect('/login');
        else:
            return 'No spaces or backslashes in usernames!';
        return "POST";

if __name__ == "__main__":
    app.debug = True;
    app.run()