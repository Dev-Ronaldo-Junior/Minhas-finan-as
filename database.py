import sqlite3
from datetime import datetime # Importar para lidar com datas

def criar_banco():
    conn = sqlite3.connect("controle_financeiro.db")
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS transacoes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            tipo TEXT NOT NULL,
            valor REAL NOT NULL,
            data TEXT NOT NULL,    -- NOVA COLUNA: Data da transação (formato YYYY-MM-DD)
            categoria TEXT          -- NOVA COLUNA: Categoria da despesa/ganho (pode ser NULL para ganhos, por exemplo)
        )
    ''')
    conn.commit()
    conn.close()

# Modificar para aceitar data e categoria
def inserir_transacao(nome, tipo, valor, data, categoria=None): # categoria é opcional
    conn = sqlite3.connect("controle_financeiro.db")
    cursor = conn.cursor()
    cursor.execute('INSERT INTO transacoes (nome, tipo, valor, data, categoria) VALUES (?, ?, ?, ?, ?)', (nome, tipo, valor, data, categoria))
    conn.commit()
    conn.close()

def listar_transacoes():
    conn = sqlite3.connect("controle_financeiro.db")
    cursor = conn.cursor()
    cursor.execute('SELECT id, nome, tipo, valor, data, categoria FROM transacoes ORDER BY data DESC') # Incluir data e categoria na seleção e ordenar
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

# --- NOVAS FUNÇÕES PARA OS GRÁFICOS ---

def listar_saldo_historico():
    conn = sqlite3.connect("controle_financeiro.db")
    cursor = conn.cursor()
    # Seleciona data, tipo e valor, ordenado por data
    cursor.execute('SELECT data, tipo, valor FROM transacoes ORDER BY data ASC')
    transacoes = cursor.fetchall()
    conn.close()

    saldo_por_dia = {}
    saldo_acumulado = 0.0

    # Calcula o saldo acumulado por dia
    for data, tipo, valor in transacoes:
        if tipo == 'ganho':
            saldo_acumulado += valor
        else:
            saldo_acumulado -= valor
        saldo_por_dia[data] = saldo_acumulado # Armazena o saldo final do dia

    # Formata para {data: saldo}
    return [{"data": d, "saldo": s} for d, s in saldo_por_dia.items()]


def listar_despesas_por_categoria():
    conn = sqlite3.connect("controle_financeiro.db")
    cursor = conn.cursor()
    # Soma os valores de despesas agrupados por categoria
    cursor.execute("SELECT categoria, SUM(valor) FROM transacoes WHERE tipo = 'despesa' AND categoria IS NOT NULL GROUP BY categoria ORDER BY SUM(valor) DESC")
    categorias = cursor.fetchall()
    conn.close()
    # Retorna uma lista de dicionários para facilitar o uso no Flask/Jinja
    return [{"categoria": c, "total": t} for c, t in categorias]




