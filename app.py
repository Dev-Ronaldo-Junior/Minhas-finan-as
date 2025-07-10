from flask import Flask, render_template, request, redirect
from database import criar_banco, inserir_transacao, listar_transacoes, deletar_transacao, calcular_saldo

app = Flask(__name__)
criar_banco()

@app.route('/')
def index():
    transacoes = listar_transacoes()
    ganhos, despesas, saldo = calcular_saldo()
    return render_template('index.html', transacoes=transacoes, ganhos=ganhos, despesas=despesas, saldo=saldo)

@app.route('/adicionar', methods=['POST'])
def adicionar():
    nome = request.form['nome']
    tipo = request.form['tipo']
    valor = float(request.form['valor'])
    inserir_transacao(nome, tipo, valor)
    return redirect('/')

@app.route('/deletar/<int:id>')
def deletar(id):
    deletar_transacao(id)
    return redirect('/')

if __name__ == '__main__':
    app.run(debug=True)


