import { EnnVariables } from './enn-variables';

export type FoodDetail = {
  id: number;
  name: string;
  quality: 'PREMIUM' | 'PADRÃO' | 'ECONÔMICO';
  enn: number | null;
  description: string;
  variables: EnnVariables;
  suggestion: string;
};

export type ComparativeAnalysisAPiResponse = {
  status: 'SUCESSO' | 'IMPRECISA' | 'FALHA';
  response_title: string;
  description: string;
  details?: FoodDetail[];
  suggestion: string;
};
