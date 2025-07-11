// script.js
console.log("JavaScript carregado!");

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    if (form) { 
        form.addEventListener("submit", function () {
             alert("Transação enviada!");
        });
    }

    // --- Lógica para o Gráfico Chart.js de Ganhos vs Despesas ---
    const ctxFinancial = document.getElementById('financialChart');

    // Verifica se o elemento canvas existe antes de tentar criar o gráfico
    if (ctxFinancial) {
        // Pega os valores de ganhos e despesas do HTML
        const ganhosElement = document.querySelector('.ganhos-valor');
        const despesasElement = document.querySelector('.despesas-valor');

        let ganhos = 0;
        let despesas = 0;

        if (ganhosElement) {
            ganhos = parseFloat(ganhosElement.textContent.replace('R$', '').replace(',', '.').trim());
            if (isNaN(ganhos)) { 
                ganhos = 0;
            }
        }
        if (despesasElement) {
            despesas = parseFloat(despesasElement.textContent.replace('R$', '').replace(',', '.').trim());
            if (isNaN(despesas)) { 
                despesas = 0;
            }
        }

        new Chart(ctxFinancial, { 
            type: 'bar', 
            data: {
                labels: ['Ganhos', 'Despesas'], 
                datasets: [{
                    label: 'Valores Financeiros (R$)',
                    data: [ganhos, despesas], 
                    backgroundColor: [
                        'rgba(40, 167, 69, 0.8)', 
                        'rgba(220, 53, 69, 0.8)'  
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
                maintainAspectRatio: false, 
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#E0E0E0', 
                            font: {
                                size: 18
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)' 
                        }
                    },
                    x: {
                        ticks: {
                            color: '#E0E0E0', 
                            font: {
                                size: 18
                            }
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
                        }
                    },
                    title: {
                        display: true,
                        text: 'Comparativo de Ganhos e Despesas',
                        color: '#E0E0E0', 
                        font: {
                            size: 18
                        }
                    },
                    tooltip: { 
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

    const ctxHistorico = document.getElementById('saldoHistoricoChart');
    if (ctxHistorico && typeof saldoHistoricoData !== 'undefined' && saldoHistoricoData.length > 0) {
        const labelsHistorico = saldoHistoricoData.map(item => item.data);
        const dataHistorico = saldoHistoricoData.map(item => item.saldo);

        new Chart(ctxHistorico, {
            type: 'line',
            data: {
                labels: labelsHistorico,
                datasets: [{
                    label: 'Saldo Acumulado (R$)',
                    data: dataHistorico,
                    borderColor: 'rgba(0, 123, 255, 0.8)', 
                    backgroundColor: 'rgba(0, 123, 255, 0.2)', 
                    fill: true, 
                    tension: 0.3, 
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
                            font: { size: 14 }, 
                            callback: function(value) { 
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
                            font: { size: 12 } 
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
                    tooltip: { 
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

    const ctxCategorias = document.getElementById('despesasCategoriaChart');
    if (ctxCategorias && typeof despesasCategoriaData !== 'undefined' && despesasCategoriaData.length > 0) {
        const labelsCategorias = despesasCategoriaData.map(item => item.categoria || 'Outros'); 
        const dataCategorias = despesasCategoriaData.map(item => item.total);

        const backgroundColors = labelsCategorias.map(() => {
            const r = Math.floor(Math.random() * 200) + 50; 
            const g = Math.floor(Math.random() * 200) + 50;
            const b = Math.floor(Math.random() * 200) + 50;
            return `rgba(${r}, ${g}, ${b}, 0.8)`;
        });
        const borderColors = backgroundColors.map(color => color.replace('0.8', '1'));

        new Chart(ctxCategorias, {
            type: 'pie', 
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
                        position: 'right', 
                        labels: {
                            color: '#E0E0E0',
                            font: { size: 14 } 
                        }
                    },
                    title: {
                        display: true,
                        text: 'Distribuição de Despesas por Categoria',
                        color: '#E0E0E0',
                        font: { size: 18 }
                    },
                    tooltip: { 
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