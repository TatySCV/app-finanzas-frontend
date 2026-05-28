// src/context/FinancialContext.jsx
import { createContext, useContext, useState } from "react";

const FinancialContext = createContext();

export function FinancialProvider({ children }) {
  // Estados existentes
  const [incomeList, setIncomeList] = useState([]);
  const [expenseList, setExpenseList] = useState([]);
  const [savingList, setSavingList] = useState([]);
  const [creditList, setCreditList] = useState([]);
  const [debtList, setDebtList] = useState([]);

  // Metas de ahorro
  const [savingGoals, setSavingGoals] = useState([]);

  // --- Funciones de Ahorro (metas) ---
  const addSavingGoal = (goal) => {
    setSavingGoals((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: goal.name,
        target: Number(goal.target),
        deadline: goal.deadline || null,
        allocated: 0,
      },
    ]);
  };

  const allocateToGoal = (goalId, amount) => {
    setSavingGoals((prev) =>
      prev.map((goal) =>
        goal.id === goalId
          ? { ...goal, allocated: goal.allocated + amount }
          : goal
      )
    );
  };

  const deleteSavingGoal = (goalId) => {
    setSavingGoals((prev) => prev.filter((goal) => goal.id !== goalId));
  };

  // --- Funciones para Créditos ---
  const addCredit = (credit) => {
    setCreditList((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: credit.name,
        totalAmount: Number(credit.totalAmount),
        remaining: Number(credit.totalAmount),
        interestRate: credit.interestRate ? Number(credit.interestRate) : 0,
        startDate: credit.startDate,
        payments: [],
        status: "pending",
      },
    ]);
  };

  const addCreditPayment = (creditId, payment) => {
    setCreditList((prev) =>
      prev.map((credit) => {
        if (credit.id !== creditId) return credit;
        const newPayments = [...credit.payments, { id: Date.now(), ...payment }];
        const totalPaid = newPayments.reduce((sum, p) => sum + Number(p.amount), 0);
        const remaining = credit.totalAmount - totalPaid;
        const status = remaining <= 0 ? "paid" : "pending";
        return {
          ...credit,
          payments: newPayments,
          remaining,
          status,
        };
      })
    );
  };

  const deleteCredit = (creditId) => {
    setCreditList((prev) => prev.filter((c) => c.id !== creditId));
  };

  // --- Funciones para Deudas ---
  const addDebt = (debt) => {
    setDebtList((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: debt.name,
        totalAmount: Number(debt.totalAmount),
        remaining: Number(debt.totalAmount),
        interestRate: debt.interestRate ? Number(debt.interestRate) : 0,
        startDate: debt.startDate,
        payments: [],
        status: "pending",
      },
    ]);
  };

  const addDebtPayment = (debtId, payment) => {
    setDebtList((prev) =>
      prev.map((debt) => {
        if (debt.id !== debtId) return debt;
        const newPayments = [...debt.payments, { id: Date.now(), ...payment }];
        const totalPaid = newPayments.reduce((sum, p) => sum + Number(p.amount), 0);
        const remaining = debt.totalAmount - totalPaid;
        const status = remaining <= 0 ? "paid" : "pending";
        return {
          ...debt,
          payments: newPayments,
          remaining,
          status,
        };
      })
    );
  };

  const deleteDebt = (debtId) => {
    setDebtList((prev) => prev.filter((d) => d.id !== debtId));
  };

  // Valor del contexto (objeto que se expone)
  const value = {
    incomeList,
    setIncomeList,
    expenseList,
    setExpenseList,
    savingList,
    setSavingList,
    creditList,
    setCreditList,
    debtList,
    setDebtList,
    // Metas de ahorro
    savingGoals,
    setSavingGoals,
    addSavingGoal,
    allocateToGoal,
    deleteSavingGoal,
    // Créditos
    addCredit,
    addCreditPayment,
    deleteCredit,
    // Deudas
    addDebt,
    addDebtPayment,
    deleteDebt,
  };

  return (
    <FinancialContext.Provider value={value}>
      {children}
    </FinancialContext.Provider>
  );
}

export function useFinancial() {
  return useContext(FinancialContext);
}