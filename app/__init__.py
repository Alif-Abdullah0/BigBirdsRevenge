# Team Big Birds -- Cameron Nelson, Sophie Liu, Alif Abdullah
# Softdev Pd 2
# p2
# 2022-03-02

import sqlite3, json, os
from flask import Flask, render_template, request, redirect, Response, session


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
    save = False;
    if 'username' in session:
        db = sqlite3.connect(MAIN_DB);
        c = db.cursor();
        c.execute("""SELECT ROWID FROM users WHERE username = ?;""", (session['username'],));
        filename = "saves/" + str(c.fetchone()[0]) + ".json";
        db.close();
        if os.path.exists(filename):
            save = True;
    return render_template("game.html",user=session.get('username'), saveavailable=save);

@app.route("/login", methods=['GET','POST'])
def login():
    """
        Lets user log in
    """
    if request.method == 'GET':
        return render_template('login.html',name='Login');
    else:
        #return "POST";
        db = sqlite3.connect(MAIN_DB);
        c = db.cursor();
        c.execute("""SELECT hash FROM users WHERE USERNAME = ?;""", (request.form.get('username'),));
        correct = c.fetchone();
        if correct == None:
            return render_template('login.html',name='Sign Up', error='No such user exists!');
        if correct[0] != request.form.get('password'):
            return render_template('login.html',name='Sign Up', error='Incorrect password!');
        session['username'] = request.form.get('username');
        return redirect('/');

@app.route("/signup", methods=['GET','POST'])
def signup():
    """
        Signs up user
    """
    if request.method == 'GET':
        return render_template('login.html',name='Sign Up');
    else:
        if not ('username' in request.form):
            return render_template('login.html',name='Sign Up', error='Username required!');
        if not ('password' in request.form):
            return render_template('login.html',name='Sign Up', error='Password required!');
        user = request.form.get('username');
        passw = request.form.get('password');
        db = sqlite3.connect(MAIN_DB);
        c = db.cursor();
        c.execute("""SELECT * FROM users WHERE USERNAME = ?;""", (user,));
        if c.fetchone() != None:
            return render_template('login.html',name='Sign Up', error='Username already exists!');
        if user.isalnum() and not (' ' in passw or '\\' in passw):
            c.execute("""INSERT INTO users (username,hash) VALUES (?,?);""", (user, passw,));
            db.commit();
            return redirect('/login');
        else:
            return render_template('login.html',name='Sign Up', error='No spaces or backslashes in usernames!');
        return "POST";

@app.route("/logout")
def logout():
    """
        Logouts user
    """
    session.pop('username', default=None)
    return redirect("/")

@app.route("/save", methods=['GET','POST'])
def save():
    d = request.form.get('save');
    savedata = json.loads(d);
    #print(savedata);

    if 'username' not in session:
        return Response(json.dumps({'Status' : 'bad', 'Message' : 'You are not logged in!'}), content_type='application/json');

    db = sqlite3.connect(MAIN_DB);
    c = db.cursor();
    c.execute("""SELECT ROWID FROM users WHERE username = ?;""", (session['username'],));
    filename = "saves/" + str(c.fetchone()[0]) + ".json";
    db.close()
    f = open(filename, 'w')
    f.write(d);
    f.close()
    print(filename);
    return Response(json.dumps({'status' : 'good', 'message' : 'Saved!'}), content_type='application/json');

@app.route("/load")
def load():
    if 'username' not in session:
        return Response(json.dumps({'status' : 'bad', 'message' : 'You are not logged in!'}), content_type='application/json');
    db = sqlite3.connect(MAIN_DB);
    c = db.cursor();
    c.execute("""SELECT ROWID FROM users WHERE username = ?;""", (session['username'],));
    filename = "saves/" + str(c.fetchone()[0]) + ".json";
    db.close()
    if not os.path.exists(filename):
        return Response(json.dumps({'status' : 'bad', 'message' : 'No saved game available!'}), content_type='application/json');
    f = open(filename, 'r')
    contents = f.read();
    f.close();
    return Response(json.dumps({'status' : 'good', 'message' : 'Saved!', 'save' : contents}), content_type='application/json');

@app.route("/surprise")
def surprise():
    return render_template("surprise.html")

@app.route("/about")
def about():
    return render_template("about.html")

if __name__ == "__main__":
    app.debug = True;
    app.run()
