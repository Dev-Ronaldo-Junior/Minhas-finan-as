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
    cursor.execute('''
        INSERT INTO transacoes (nome, tipo, valor)
        VALUES (?, ?, ?)
    ''', (nome, tipo, valor))
    conn.commit()
    conn.close()

def listar_transacoes():
    conn = sqlite3.connect("controle_financeiro.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM transacoes")
    resultados = cursor.fetchall()
    conn.close()
    return resultados

def deletar_transacao(id):
    conn = sqlite3.connect("controle_financeiro.db")
    cursor = conn.cursor()
    cursor.execute("DELETE FROM transacoes WHERE id = ?", (id,))
    conn.commit()
    conn.close()
    print(f"Transação com ID {id} apagada com sucesso.")

def cadastrar_transacao():
    tipo = input("Tipo (ganho/despesa): ").lower()
    nome = input("Descrição: ")
    try:
        valor = float(input("Valor: "))
    except ValueError:
        print("Valor inválido! Digite um número.")
        return

    if tipo not in ['ganho', 'despesa']:
        print("Tipo inválido. Por favor, digite 'ganho' ou 'despesa'.")
        return

    inserir_transacao(nome, tipo, valor)
    print(f"{tipo.capitalize()} '{nome}' de R$ {valor:.2f} cadastrado com sucesso.")

def mostrar_transacoes():
    transacoes = listar_transacoes()
    if not transacoes:
        print("Nenhuma transação cadastrada.")
        return

    for t in transacoes:
        print(f"ID: {t[0]} | Nome: {t[1]} | Tipo: {t[2]} | Valor: R$ {t[3]}")

def calcular_saldo():
    transacoes = listar_transacoes()
    total_ganhos = sum(t[3] for t in transacoes if t[2] == 'ganho')
    total_despesas = sum(t[3] for t in transacoes if t[2] == 'despesa')
    saldo = total_ganhos - total_despesas

    print(f"\nTotal de ganhos: R$ {total_ganhos:.2f}")
    print(f"Total de despesas: R$ {total_despesas:.2f}")
    print(f"Saldo final: R$ {saldo:.2f}")

def excluir_transacao():
    mostrar_transacoes()
    try:
        id_escolhido = int(input("Digite o ID da transação que deseja excluir: "))
        deletar_transacao(id_escolhido)
    except ValueError:
        print("ID inválido. Digite um número.")



