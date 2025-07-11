from flask import Flask, render_template, request, redirect, url_for, flash
from collections import defaultdict
import json

# --- Importações para autenticação e ORM ---
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user

# --- Importar modelos do novo models.py ---
from models import db, User, Transaction 

app = Flask(__name__)

# --- Configuração do SQLAlchemy ---
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///financeiro.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app) 

# --- Configuração do Flask-Login ---
app.config['SECRET_KEY'] = 'uma_chave_muito_longa_e_aleatoria_para_seguranca_do_seu_app_1234567890ABCDEF' 
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# --- Função de carregamento de usuário para Flask-Login 
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# --- Função para criar o banco de dados e tabelas 
def create_db_tables():
    with app.app_context():
        db.create_all()
        print("Banco de dados e tabelas criados/atualizados!")


@app.route('/')
@login_required
def index():
    user_id = current_user.id

    transactions = Transaction.query.filter_by(user_id=user_id).order_by(Transaction.date.desc()).all()

    total_ganhos = sum(t.amount for t in transactions if t.type == 'ganho')
    total_despesas = sum(t.amount for t in transactions if t.type == 'despesa')
    saldo = total_ganhos - total_despesas

    saldo_historico = defaultdict(float)
    saldo_atual = 0.0
    transactions_sorted_by_date = Transaction.query.filter_by(user_id=user_id).order_by(Transaction.date).all()

    for t in transactions_sorted_by_date:
        if t.type == 'ganho':
            saldo_atual += t.amount
        else:
            saldo_atual -= t.amount
        saldo_historico[t.date] = saldo_atual

    saldo_historico_data = [{"data": date, "saldo": saldo_historico[date]} for date in sorted(saldo_historico.keys())]

    despesas_por_categoria = defaultdict(float)
    for t in transactions:
        if t.type == 'despesa':
            category_name = t.category if t.category else 'Sem Categoria'
            despesas_por_categoria[category_name] += t.amount

    despesas_categoria_data = [{"categoria": cat, "total": total} for cat, total in despesas_por_categoria.items()]


    return render_template('index.html',
                           transactions=transactions,
                           total_ganhos=total_ganhos,
                           total_despesas=total_despesas,
                           saldo=saldo,
                           saldo_historico_data=saldo_historico_data,
                           despesas_categoria_data=despesas_categoria_data
                            )

@app.route('/add_transaction', methods=['POST'])
@login_required
def add_transaction():
    if request.method == 'POST':
        type = request.form['type']
        amount = float(request.form['amount'])
        description = request.form['description']
        date = request.form['date']
        category = request.form.get('category')

        new_transaction = Transaction(
            type=type,
            amount=amount,
            description=description,
            date=date,
            category=category,
            user_id=current_user.id
        )
        db.session.add(new_transaction)
        db.session.commit()
        flash('Transação adicionada com sucesso!', 'success')
    return redirect(url_for('index'))

@app.route('/delete_transaction/<int:id>')
@login_required
def delete_transaction(id):
    transaction_to_delete = Transaction.query.filter_by(id=id, user_id=current_user.id).first_or_404()
    db.session.delete(transaction_to_delete)
    db.session.commit()
    flash('Transação excluída com sucesso!', 'success')
    return redirect(url_for('index'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            flash('Nome de usuário já existe. Escolha outro.', 'danger')
            return redirect(url_for('register'))

        new_user = User(username=username)
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()
        flash('Registro bem-sucedido! Agora você pode fazer login.', 'success')
        return redirect(url_for('login'))
    return render_template('cadastro.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = User.query.filter_by(username=username).first()

        if user and user.check_password(password):
            login_user(user)
            flash('Login realizado com sucesso!', 'success')
            return redirect(url_for('index'))
        else:
            flash('Nome de usuário ou senha inválidos.', 'danger')
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('Você foi desconectado.', 'info')
    return redirect(url_for('login'))

if __name__ == '__main__':
    # Garante que as tabelas do DB sejam criadas no contexto correto
    create_db_tables() 
    app.run(debug=True)


