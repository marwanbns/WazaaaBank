import csv
from flask import Flask, render_template, request, url_for, flash, redirect, session, jsonify
from forms import RegistrationForm, LoginForm
import random
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = '9c383dc88513191312f9fa9317ce3100'

posts = [
    {
        'author': 'Sherlock Holmes',
        'title': 'Blog Post 1',
        'content': 'First post content',
        'date_posted': 'September 20, 2023'
    },
    {
        'author': 'Dr. John Watson',
        'title': 'Blog Post 2',
        'content': 'Second post content',
        'date_posted': 'September 21, 2023'
    }
]

#M
def get_user_from_csv(pseudo, mot_de_passe):
    with open('users.csv', newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            if row['pseudo'] == pseudo and row['mot_de_passe'] == mot_de_passe:
                return row
    return None

#M
def get_all_users_from_csv():
    users = []
    with open('users.csv', 'r', newline='') as file:
        reader = csv.DictReader(file)
        for row in reader:
            users.append(row)
    return users

def get_user_for_delete(pseudo):
    with open('users.csv', newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            print(f"Checking user: {row}")
            if row['pseudo'].lower() == pseudo.lower() and row['pseudo'] != 'admin':
                print(f"Found user for delete: {row}")
                return {
                    'pseudo': row['pseudo']
                }
    return None

#M
def get_user_from_csv(pseudo, mot_de_passe=None):
    with open('users.csv', newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            if row['pseudo'] == pseudo:
                if mot_de_passe is None or row['mot_de_passe'] == mot_de_passe:
                    return row
    return None

#E
def add_user_to_csv(pseudo, mot_de_passe, account_number):
    solde = random.randint(20000, 1000000)
    savings = random.randint(20000, solde)
    current = solde - savings
    with open('users.csv', mode='a', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow([pseudo, mot_de_passe, account_number, 'default.jpg', solde, current, savings])

#M
@app.route('/delete_account', methods=['POST'])
def delete_account():
    pseudo = request.form.get('username')
    user_to_delete = get_user_for_delete(pseudo)

    if user_to_delete:
        if user_to_delete['pseudo'] == 'admin':
            flash("❌ The admin account cannot be deleted.", "danger")  # Message en rouge
        else:
            users = []
            with open('users.csv', 'r', newline='') as file:
                reader = csv.DictReader(file)
                for row in reader:
                    if row['pseudo'] != pseudo:
                        users.append(row)

            with open('users.csv', 'w', newline='') as file:
                fieldnames = ['pseudo', 'mot_de_passe', 'account_number', 'profile_image', 'solde', 'current', 'savings']
                writer = csv.DictWriter(file, fieldnames=fieldnames)
                writer.writeheader()
                writer.writerows(users)

            flash(f"✅ The account '{pseudo}' has been successfully deleted.", "success")  # Message en vert

    else:
        flash("⚠️ User not found.", "warning")  # Message en jaune

    return redirect(url_for('admin'))  # Rester sur la page admin

@app.route("/")
@app.route("/home")
def home():
    message = session.pop('message', None)  # Récupère et supprime le message de session
    return render_template('home.html', pos=posts, message=message)
    
@app.route("/about")
def about():
    return render_template('about.html', title='About')

#E
@app.route("/register", methods=['GET', 'POST'])
def register():
    form = RegistrationForm()
    from_admin = request.args.get('from_admin')  # Vérifie si on vient d'Admin Page

    if form.validate_on_submit():
        pseudo = form.pseudo.data
        mot_de_passe = form.mot_de_passe.data
        account_number = random.randint(10000, 99999)
        
        if get_user_from_csv(pseudo, mot_de_passe):
            flash('❌ Username already taken. Choose another one.', 'danger')
        else:
            add_user_to_csv(pseudo, mot_de_passe, account_number)
            flash(f'✅ The account "{pseudo}" has been successfully created!', 'success')

            # ✅ Si on vient d'Admin Page, retour sur Admin Page
            if from_admin:
                return redirect(url_for('admin'))

            # Sinon, redirection classique vers Login Page
            return redirect(url_for('login'))

    return render_template('register.html', title='Register', form=form)

@app.route("/contact", methods=['GET', 'POST'])
def contact():
    return render_template('contact.html', title='Contact Us')

@app.route("/contact2", methods=['GET', 'POST'])
def contact2():
    return render_template('contact2.html', title='Contact Us')

@app.route("/account")
def account():
    if 'logged_in' in session and session['logged_in']:
        if 'pseudo' in session:
            pseudo = session['pseudo']
            user = get_user_from_csv(pseudo)

            if user:
                return render_template('account.html', title='Account', user=user)
            else:
                flash('User not found. Please log in again.', 'danger')
                return redirect(url_for('login'))
        else:
            flash('Invalid session. Please log in again.', 'danger')
            return redirect(url_for('login'))
    else:
        flash('You must be logged in to view this page.', 'danger')
        return redirect(url_for('login'))

@app.route("/admin")
def admin():
    if 'logged_in' in session and session['logged_in'] and session['pseudo'] == 'admin':
        users = get_all_users_from_csv()
        return render_template('adminpage.html', title='Admin Page', users=users)
    else:
        session['message'] = "❌ You do not have permission to access this page."
        return redirect(url_for('home'))  # Redirection vers Home

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()

    if form.validate_on_submit():
        pseudo = form.pseudo.data
        mot_de_passe = form.mot_de_passe.data
        stored_user = get_user_from_csv(pseudo, mot_de_passe)

        if stored_user:
            session['logged_in'] = True
            session['pseudo'] = pseudo
            session['profile_image'] = stored_user['profile_image']
            session['message'] = '✅ You have successfully logged in!'
            return redirect(url_for('home'))
        else:
            flash('Incorrect username or password.', 'danger')

    return render_template('login.html', title='Login', form=form)

@app.route("/logout")
def logout():
    session.pop('logged_in', None)
    session.pop('pseudo', None)
    flash('You have been logged out.', 'success')
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True)
