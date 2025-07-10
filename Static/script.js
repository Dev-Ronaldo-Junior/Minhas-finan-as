// script.js
console.log("JavaScript carregado!");

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    if (form) { // Verifica se o formulário existe na página
        form.addEventListener("submit", function () {
            // alert("Transação enviada!"); // Você pode remover este alerta se não quiser
        });
    }

    // --- Lógica para o Gráfico Chart.js ---
    const ctx = document.getElementById('financialChart');

    // Verifica se o elemento canvas existe antes de tentar criar o gráfico
    if (ctx) {
        // Pega os valores de ganhos e despesas do HTML
        // Estes valores são passados pelo Flask e renderizados diretamente no HTML
        // Usamos querySelector para pegar o texto e parseFloat para converter para número
        const ganhosElement = document.querySelector('.ganhos-valor');
        const despesasElement = document.querySelector('.despesas-valor');

        let ganhos = 0;
        let despesas = 0;

        if (ganhosElement) {
            // Remove "R$" e espaços, depois substitui vírgula por ponto para parseFloat
            ganhos = parseFloat(ganhosElement.textContent.replace('R$', '').replace(',', '.').trim());
        }
        if (despesasElement) {
            despesas = parseFloat(despesasElement.textContent.replace('R$', '').replace(',', '.').trim());
        }

        new Chart(ctx, {
            type: 'bar', // Tipo de gráfico: barras
            data: {
                labels: ['Ganhos', 'Despesas'], // Rótulos das barras
                datasets: [{
                    label: 'Valores Financeiros (R$)',
                    data: [ganhos, despesas], // Dados para as barras
                    backgroundColor: [
                        'rgba(40, 167, 69, 0.8)', // Verde para Ganhos (var(--accent-green))
                        'rgba(220, 53, 69, 0.8)'  // Vermelho para Despesas (var(--accent-red))
                    ],
                    borderColor: [
                        'rgba(40, 167, 69, 1)',
                        'rgba(220, 53, 69, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // Permite que o gráfico se ajuste ao tamanho do contêiner
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#E0E0E0', // Cor dos rótulos do eixo Y
                            // --- APENAS ESTA ADIÇÃO PARA O EIXO Y ---
                            font: {
                                size: 18 // <-- Tamanho da fonte dos NÚMEROS do eixo Y (ex: 1000, 2000)
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)' // Cor das linhas de grade do eixo Y
                        }
                    },
                    x: {
                        ticks: {
                            color: '#E0E0E0', // Cor dos rótulos do eixo X
                            // --- APENAS ESTA ADIÇÃO PARA O EIXO X ---
                            font: {
                                size: 18 // <-- Tamanho da fonte dos rótulos 'Ganhos' e 'Despesas'
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)' // Cor das linhas de grade do eixo X
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#E0E0E0' // Cor do texto da legenda
                            // --- OPCIONAL: ADICIONE AQUI SE QUISER MUDAR A LEGENDA ---
                            // font: {
                            //     size: 14 // <-- Descomente e ajuste se quiser que a legenda seja maior
                            // }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Comparativo de Ganhos e Despesas',
                        color: '#E0E0E0', // Cor do título do gráfico
                        font: {
                            size: 18
                        }
                    }
                }
            }
        });
    }
});