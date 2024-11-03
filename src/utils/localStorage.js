// src/utils/localStorage.js

// Guarda los casos en LocalStorage
export const saveCasesToLocalStorage = (cases) => {
  localStorage.setItem('cases', JSON.stringify(cases));
};

// Obtiene los casos desde LocalStorage
export const getCasesFromLocalStorage = () => {
  const cases = localStorage.getItem('cases');
  return cases ? JSON.parse(cases) : [];
};

// Elimina un caso específico (opcional, para futuros sprints)
export const removeCaseFromLocalStorage = (caseId) => {
  const cases = getCasesFromLocalStorage();
  const updatedCases = cases.filter((c) => c.id !== caseId);
  saveCasesToLocalStorage(updatedCases);
};
