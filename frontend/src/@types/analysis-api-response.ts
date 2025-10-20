import { EnnVariables } from './enn-variables';

export type AnalysisAPiResponse = {
  status: 'SUCESSO' | 'IMPRECISA' | 'FALHA';
  enn: number | null;
  response_title: 'Análise Final' | 'Dados Incompletos';
  description: string;
  variables: EnnVariables;
  suggestion: string;
};
