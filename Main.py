from Funcoes import (
    criar_banco,
    cadastrar_transacao,
    mostrar_transacoes,
    excluir_transacao,
    calcular_saldo
)
from rich.console import Console
from rich.panel import Panel

console = Console()

def menu():
    console.print(Panel.fit(
        "[bold cyan]💰 CONTROLE FINANCEIRO 💰[/bold cyan]\n\n"
        "[1] Cadastrar transação\n"
        "[2] Listar transações\n"
        "[3] Excluir transação\n"
        "[4] Mostrar saldo final\n"
        "[0] Sair",
        title="[green]MENU[/green]",
        border_style="bright_blue"
    ))

def main():
    criar_banco()

    while True:
        menu()
        opcao = input("Escolha uma opção: ")

        if opcao == "1":
            cadastrar_transacao()
        elif opcao == "2":
            mostrar_transacoes()
        elif opcao == "3":
            excluir_transacao()
        elif opcao == "4":
            calcular_saldo()
        elif opcao == "0":
            print("Vou nessa vacilão, espero ter ajudado!")
            break
        else:
            print("Opção inválida! Tente novamente.")

if __name__ == "__main__":
    main() 


