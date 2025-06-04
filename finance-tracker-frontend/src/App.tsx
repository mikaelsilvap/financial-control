import './App.css';
import { useState, useEffect, FormEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTransactions, createTransaction, deleteTransaction, getSummary } from './api/transactions';
import type { Transaction, CreateTransactionData, Summary } from './api/transactions';
import { Trash2 } from 'lucide-react';

function App() {
  const queryClient = useQueryClient();
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [value, setValue] = useState<number | ''>('');

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    setDate(`${year}-${month}-${day}`);
  }, []);

  const { data: transactions, isLoading, isError, error } = useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: getTransactions,
  });

    const { data: summary, isLoading: isLoadingSummary, isError: isErrorSummary } = useQuery<Summary>({
    queryKey: ['summary'],
    queryFn: getSummary,
  });

  const addTransactionMutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
      setDescription('');
      setCategory('');
      setValue('');
    },
    onError: (err) => {
      console.error("Erro ao adicionar transação:", err);
      alert("Erro ao adicionar transação.");
    }
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
    },
    onError: (err) => {
      console.error("Erro ao deletar transação:", err);
      alert("Erro ao deletar transação.");
    }
  });

  const handleDelete = (id: number) => {
    if (window.confirm("Tem certeza que deseja deletar este lançamento?")) {
      deleteTransactionMutation.mutate(id);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!date || !description || !category || value === '' || isNaN(Number(value))) {
      alert('Por favor, preencha todos os campos corretamente.');
      return;
    }

    const newTransaction: CreateTransactionData = {
      date,
      description,
      category,
      value: Number(value),
    };

    addTransactionMutation.mutate(newTransaction);
  };

  const formatValue = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);
  };

  const formatDate = (isoDateString: string) => {
    return new Date(isoDateString).toLocaleDateString('pt-BR');
  };

  if (isLoading || isLoadingSummary) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-xl text-slate-700">Carregando lançamentos...</p>
      </div>
    );
  }

  if (isError || isLoadingSummary) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center">
        <p className="text-xl text-red-600">Erro ao carregar lançamentos: {error?.message || "Erro no resumo"}</p>
        <p className="text-md text-red-500">Verifique se o backend está rodando no Docker (http://localhost:3000).</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-center text-slate-800 mb-8">
          💸 Finance Tracker
        </h1>
        
        <section className="mb-8 p-4 border rounded-md bg-blue-50">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">Resumo Financeiro</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-500">Entradas</p>
              <p className="font-bold text-green-600 text-lg">{formatValue(summary?.totalEntries || 0)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Saídas</p>
              <p className="font-bold text-red-600 text-lg">{formatValue(summary?.totalExpenses || 0)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Saldo Atual</p>
              <p className={`font-bold text-lg ${summary && summary.currentBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {formatValue(summary?.currentBalance || 0)}
              </p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-slate-700 mb-4">Novo Lançamento</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Data</label>
                <input
                  type="date"
                  className="mt-1 block w-full border border-slate-300 rounded-xl shadow-sm p-2"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Categoria</label>
                <input
                  type="text"
                  placeholder="Ex: Moradia"
                  className="mt-1 block w-full border border-slate-300 rounded-xl shadow-sm p-2"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Descrição</label>
              <input
                type="text"
                placeholder="Ex: Conta de luz"
                className="mt-1 block w-full border border-slate-300 rounded-xl shadow-sm p-2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Valor (positivo = entrada, negativo = saída)
              </label>
              <input
                type="number"
                placeholder="Ex: -200 ou 500"
                className="mt-1 block w-full border border-slate-300 rounded-xl shadow-sm p-2"
                value={value}
                onChange={(e) => setValue(e.target.value === '' ? '' : parseFloat(e.target.value))}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
              disabled={addTransactionMutation.isPending}
            >
              {addTransactionMutation.isPending ? 'Adicionando...' : 'Adicionar'}
            </button>
          </form>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-slate-700 mb-4">Meus Lançamentos</h2>
          <div className="space-y-4">
            {transactions && transactions.length > 0 ? (
              transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
                >
                  <div>
                    <p className="font-semibold text-slate-800">
                      {formatDate(transaction.date)} - {transaction.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm px-2 py-0.5 bg-slate-200 rounded-full text-slate-700">
                        {transaction.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <p className={`font-bold ${transaction.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatValue(transaction.value)}
                    </p>
                    <button
                      onClick={() => handleDelete(transaction.id)}
                      className="text-red-500 hover:text-red-700"
                      disabled={deleteTransactionMutation.isLoading && deleteTransactionMutation.variables === transaction.id}
                    >
                      {deleteTransactionMutation.isLoading && deleteTransactionMutation.variables === transaction.id ? (
                        '...'
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-600 text-center">Nenhum lançamento. Adicione acima!</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
