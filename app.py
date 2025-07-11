from flask import Flask, render_template, request, redirect
from database import (
    criar_banco, 
    inserir_transacao, 
    listar_transacoes, 
    deletar_transacao, 
    calcular_saldo,
    listar_saldo_historico,           
    listar_despesas_por_categoria     
)

app = Flask(__name__)
criar_banco()

@app.route('/')
def index():
    transacoes = listar_transacoes()
    ganhos, despesas, saldo = calcular_saldo()
    
    # --- NOVOS DADOS PARA OS GRÁFICOS ---
    saldo_historico = listar_saldo_historico()
    despesas_por_categoria = listar_despesas_por_categoria()

    return render_template(
        'index.html', 
        transacoes=transacoes, 
        ganhos=ganhos, 
        despesas=despesas, 
        saldo=saldo,
        saldo_historico=saldo_historico,           
        despesas_por_categoria=despesas_por_categoria  
    )

@app.route('/adicionar', methods=['POST'])
def adicionar():
    nome = request.form['nome']
    tipo = request.form['tipo']
    valor = float(request.form['valor'])
    data = request.form['data'] 
    
    # <--- NOVA: Obter a categoria do formulário. Use .get() para evitar erro se não for enviado.
    # A categoria só é relevante para despesas, mas vamos capturá-la sempre.
    categoria = request.form.get('categoria') 

    # Chamar a função de inserção com os novos parâmetros
    inserir_transacao(nome, tipo, valor, data, categoria) 
    return redirect('/')

@app.route('/deletar/<int:id>')
def deletar(id):
    deletar_transacao(id)
    return redirect('/')

if __name__ == '__main__':
    app.run(debug=True)


