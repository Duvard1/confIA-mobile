export interface SocialEngineeringTechnique {
  name: string;
  confidence: number; // 0..1
  evidence: string;
}

export interface EvidenceItem {
  text: string;
  category: string;
}

export interface BenfordMetrics {
  mad: number;
  chi2: number;
  kl: number;
  js: number;
}

export interface BenfordBlock {
  n_values: number;
  observed_distribution: number[];
  expected_distribution: number[];
  metrics: BenfordMetrics;
}

export interface FeatureScore {
  feature: string;
  mad: number;
  kl: number;
  js: number;
  chi2?: number;
}

export interface AnalysisData {
  metadata: {
    analysis_id: string;
    created_at: string;
    processing_time_ms: number;
    models: {
      transcription: string;
      llm: string;
      acoustic_service: string;
    };
  };
  audio: {
    original_name: string;
    duration_seconds: number;
    sample_rate: number;
    channels: number;
    format: string;
    description?: string;
    contact_type?: string;
  };
  transcription: {
    language: string;
    confidence: number;
    text: string;
  };
  semantic_analysis: {
    summary: {
      description: string;
      risk_level: string;
    };
    fraud_analysis: {
      detected: boolean;
      fraud_probability: number;
      fraud_types: string[];
    };
    social_engineering: {
      detected: boolean;
      score: number;
      techniques: SocialEngineeringTechnique[];
    };
    manipulation: {
      score: number;
      indicators: string[];
    };
    requests: {
      money_request: boolean;
      personal_information_request: boolean;
      security_code_request: boolean;
    };
    evidence: EvidenceItem[];
    recommendations: string[];
  };
  acoustic_analysis: {
    classification: {
      prediction: 'REAL' | 'AI' | string;
      confidence: string;
      ai_voice_probability: number;
    };
    features: Record<string, any>;
  };
  overall_assessment: {
    risk_score: number;
    risk_level: string;
    fraud_detected: boolean;
    ai_voice_detected: boolean;
    final_message: string;
  };
  dashboard: {
    cards: { title: string; value: number; unit: string; status: string }[];
    gauges: { fraud: number; ai_voice: number; manipulation: number };
    radar: { urgency: number; fear: number; authority: number; pressure: number };
    benford: Record<string, { observed: number[]; expected: number[] }>;
    feature_scores: FeatureScore[];
    timeline: any[];
  };
  local_predict?: any;
}

export interface AnalyzeResponse {
  success: boolean;
  data: AnalysisData;
}

export type CallerType = 'Familiar' | 'Amigo' | 'Empresa' | 'Desconocido';

export interface HistoryEntry {
  id: string;
  fileName: string;
  createdAt: string;
  riskScore: number;
  riskLevel: string;
  data: AnalysisData;
}
