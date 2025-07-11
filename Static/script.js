// script.js
console.log("JavaScript carregado!");

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    if (form) { // Verifica se o formulário existe na página
        form.addEventListener("submit", function () {
            // alert("Transação enviada!"); // Você pode remover este alerta se não quiser
        });
    }

    // --- Lógica para o Gráfico Chart.js de Ganhos vs Despesas ---
    // Renomeado a variável ctx para ctxFinancial para evitar conflitos com outros gráficos
    const ctxFinancial = document.getElementById('financialChart');

    // Verifica se o elemento canvas existe antes de tentar criar o gráfico
    if (ctxFinancial) {
        // Pega os valores de ganhos e despesas do HTML
        const ganhosElement = document.querySelector('.ganhos-valor');
        const despesasElement = document.querySelector('.despesas-valor');

        let ganhos = 0;
        let despesas = 0;

        if (ganhosElement) {
            // --- RESTAURADO: Lógica de conversão ORIGINAL que você usava ---
            ganhos = parseFloat(ganhosElement.textContent.replace('R$', '').replace(',', '.').trim());
            if (isNaN(ganhos)) { // Proteção caso a conversão falhe
                ganhos = 0;
            }
        }
        if (despesasElement) {
            // --- RESTAURADO: Lógica de conversão ORIGINAL que você usava ---
            despesas = parseFloat(despesasElement.textContent.replace('R$', '').replace(',', '.').trim());
            if (isNaN(despesas)) { // Proteção caso a conversão falhe
                despesas = 0;
            }
        }

        new Chart(ctxFinancial, { // Usar ctxFinancial aqui
            type: 'bar', // Tipo de gráfico: barras
            data: {
                labels: ['Ganhos', 'Despesas'], // Rótulos das barras
                datasets: [{
                    label: 'Valores Financeiros (R$)',
                    data: [ganhos, despesas], // Dados para as barras
                    backgroundColor: [
                        'rgba(40, 167, 69, 0.8)', // Verde para Ganhos
                        'rgba(220, 53, 69, 0.8)'  // Vermelho para Despesas
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
                            // --- TAMANHO DA FONTE DO EIXO Y (mantido 18) ---
                            font: {
                                size: 18
                            }
                            // O callback para formatação inteligente (K/M) não estava na sua versão final que você gostou,
                            // então não o incluí aqui para o gráfico de barras.
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)' // Cor das linhas de grade do eixo Y
                        }
                    },
                    x: {
                        ticks: {
                            color: '#E0E0E0', // Cor dos rótulos do eixo X
                            // --- TAMANHO DA FONTE DO EIXO X (mantido 18) ---
                            font: {
                                size: 18
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
                            color: '#E0E0E0', // Cor do texto da legenda
                            // font: { size: 14 } // Opcional: para o tamanho da legenda
                        }
                    },
                    title: {
                        display: true,
                        text: 'Comparativo de Ganhos e Despesas',
                        color: '#E0E0E0', // Cor do título do gráfico
                        font: {
                            size: 18
                        }
                    },
                    tooltip: { // Melhorar a exibição do tooltip
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += 'R$ ' + context.parsed.y.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }

    // --- NOVO: GRÁFICO DE LINHA - HISTÓRICO DE SALDO ---
    // A variável global 'saldoHistoricoData' é populada no index.html pelo Jinja2
    const ctxHistorico = document.getElementById('saldoHistoricoChart');
    if (ctxHistorico && typeof saldoHistoricoData !== 'undefined' && saldoHistoricoData.length > 0) {
        // Prepara os rótulos (datas) e dados (saldo)
        // Certifique-se que o saldoHistoricoData vem com o formato de data correto (YYYY-MM-DD)
        const labelsHistorico = saldoHistoricoData.map(item => item.data);
        const dataHistorico = saldoHistoricoData.map(item => item.saldo);

        new Chart(ctxHistorico, {
            type: 'line',
            data: {
                labels: labelsHistorico,
                datasets: [{
                    label: 'Saldo Acumulado (R$)',
                    data: dataHistorico,
                    borderColor: 'rgba(0, 123, 255, 0.8)', // Azul vibrante
                    backgroundColor: 'rgba(0, 123, 255, 0.2)', // Fundo suave
                    fill: true, // Preenche a área abaixo da linha
                    tension: 0.3, // Curvatura da linha
                    pointBackgroundColor: 'rgba(0, 123, 255, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(0, 123, 255, 1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#E0E0E0',
                            font: { size: 14 }, // Ajuste o tamanho da fonte
                            callback: function(value) { // Formatação de moeda
                                return 'R$ ' + value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#E0E0E0',
                            font: { size: 12 } // Ajuste o tamanho da fonte
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#E0E0E0',
                            font: { size: 14 }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Evolução do Saldo',
                        color: '#E0E0E0',
                        font: { size: 18 }
                    },
                    tooltip: { // Melhorar a exibição do tooltip
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += 'R$ ' + context.parsed.y.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }

    // --- NOVO: GRÁFICO DE PIZZA - DESPESAS POR CATEGORIA ---
    // A variável global 'despesasCategoriaData' é populada no index.html pelo Jinja2
    const ctxCategorias = document.getElementById('despesasCategoriaChart');
    if (ctxCategorias && typeof despesasCategoriaData !== 'undefined' && despesasCategoriaData.length > 0) {
        // Prepara os rótulos (categorias) e dados (totais)
        const labelsCategorias = despesasCategoriaData.map(item => item.categoria || 'Outros'); // 'Outros' para categorias nulas/vazias
        const dataCategorias = despesasCategoriaData.map(item => item.total);

        // Gera cores aleatórias para as fatias da pizza
        const backgroundColors = labelsCategorias.map(() => {
            const r = Math.floor(Math.random() * 200) + 50; // Evita cores muito escuras
            const g = Math.floor(Math.random() * 200) + 50;
            const b = Math.floor(Math.random() * 200) + 50;
            return `rgba(${r}, ${g}, ${b}, 0.8)`;
        });
        const borderColors = backgroundColors.map(color => color.replace('0.8', '1'));

        new Chart(ctxCategorias, {
            type: 'pie', // Tipo de gráfico: pizza
            data: {
                labels: labelsCategorias,
                datasets: [{
                    data: dataCategorias,
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right', // Posição da legenda para gráficos de pizza
                        labels: {
                            color: '#E0E0E0',
                            font: { size: 14 } // Ajuste o tamanho da fonte da legenda
                        }
                    },
                    title: {
                        display: true,
                        text: 'Distribuição de Despesas por Categoria',
                        color: '#E0E0E0',
                        font: { size: 18 }
                    },
                    tooltip: { // Melhorar a exibição do tooltip
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed !== null) {
                                    const total = context.dataset.data.reduce((sum, current) => sum + current, 0);
                                    const percentage = (context.parsed / total * 100).toFixed(1) + '%';
                                    label += 'R$ ' + context.parsed.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' (' + percentage + ')';
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }
});