import sqlite3

def criar_banco():
    conn = sqlite3.connect("controle_financeiro.db")
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS transacoes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            tipo TEXT NOT NULL,
            valor REAL NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

def inserir_transacao(nome, tipo, valor):
    conn = sqlite3.connect("controle_financeiro.db")
    cursor = conn.cursor()
    cursor.execute('INSERT INTO transacoes (nome, tipo, valor) VALUES (?, ?, ?)', (nome, tipo, valor))
    conn.commit()
    conn.close()

def listar_transacoes():
    conn = sqlite3.connect("controle_financeiro.db")
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM transacoes')
    transacoes = cursor.fetchall()
    conn.close()
    return transacoes

def deletar_transacao(id):
    conn = sqlite3.connect("controle_financeiro.db")
    cursor = conn.cursor()
    cursor.execute('DELETE FROM transacoes WHERE id = ?', (id,))
    conn.commit()
    conn.close()

def calcular_saldo():
    transacoes = listar_transacoes()
    ganhos = sum(t[3] for t in transacoes if t[2] == 'ganho')
    despesas = sum(t[3] for t in transacoes if t[2] == 'despesa')
    return ganhos, despesas, ganhos - despesas




