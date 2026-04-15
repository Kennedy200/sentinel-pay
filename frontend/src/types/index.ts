export interface Transaction {
  id: string;
  amount: number;
  merchant: string;
  timestamp: string;
  location: string;
  status: 'approved' | 'blocked' | 'pending';
}

export interface AIAnalysis {
  fraudScore: number;
  reasons: string[];
  riskLevel: 'low' | 'medium' | 'high';
}