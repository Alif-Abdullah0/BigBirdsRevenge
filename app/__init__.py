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
       
@app.route("/login", methods=['GET','POST'])
def login():
    """
        Lets user log in
    """
    if request.method == 'GET':
        return """<!DOCTYPE html> <html> <body> <form action="/signup" method="POST"> Username: <input type='text' name='username'> <br> <br> Password: <input type='text' name='password'> <br> <br> <input type='submit' value='Submit'> </form></body> </html>
        """;
    else:
        return "POST";
        db = sqlite3.connect(MAIN_DB);
        c = db.cursor();
        c.execute("""SELECT hash FROM users WHERE USERNAME = ?""", (request.form.get('username'),));
        correct = c.fetchone();
        if correct == None:
            return 'No such user exists!';
        if correct != request.form.get('password'):
            return 'Incorrect password!';
        session['username'] = request.form.get('username');
        return redirect('/');
    
@app.route("/signup", methods=['GET','POST'])
def signup():
    """
        Signs up user
    """
    if request.method == 'GET':
        return """<!DOCTYPE html> <html> <body> <form action="/signup" method="POST"> Username: <input type='text' name='username'> <br> <br> Password: <input type='text' name='password'> <br> <br> <input type='submit' value='Submit'> </form></body> </html>
        """;
    else:
        if not ('username' in request.form):
            return 'Username required!';
        if not ('password' in request.form):
            return 'Password required!';
        user = request.form.get('username');
        passw = request.form.get('password');
        db = sqlite3.connect(MAIN_DB);
        c = db.cursor();
        c.execute("""SELECT * FROM users WHERE USERNAME = ?""", (user,));
        if c.fetchone() != None:
            return 'Username already exists!';
        if user.isalnum() and not (' ' in passw or '\\' in passw):
            c.execute("""INSERT INTO users (username,hash) VALUES (?,?)""", (user, passw,));
            db.commit();
            return redirect('/login');
        else:
            return 'No spaces or backslashes in usernames!';
        return "POST";

@app.route("/logout")
def logout():
    """
        Logouts user
    """
    session.pop('username', default=None)
    return redirect("/")

if __name__ == "__main__":
    app.debug = True;
    app.run()