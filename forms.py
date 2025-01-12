# forms.py
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired, EqualTo

class RegistrationForm(FlaskForm):
    pseudo = StringField('Pseudo', validators=[DataRequired()])
    mot_de_passe = PasswordField('Mot de Passe', validators=[DataRequired()])
    confirmer_mot_de_passe = PasswordField('Confirmer Mot de Passe', validators=[DataRequired(), EqualTo('mot_de_passe')])
    submit = SubmitField('Sign Up')

class LoginForm(FlaskForm):
    pseudo = StringField('Pseudo', validators=[DataRequired()])
    mot_de_passe = PasswordField('Mot de Passe', validators=[DataRequired()])
    submit = SubmitField('Login')