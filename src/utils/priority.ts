import { EMBEDDING_SEEDS, PRIORITY_KEYWORDS, PRIORITY_THRESHOLDS } from './constants';
import { PriorityAnalysis } from '../types';

// Mock embedding similarity calculation
// In production, this would use actual sentence embeddings
const calculateSimilarity = (text: string, seeds: string[]): number => {
  const textLower = text.toLowerCase();
  let maxSimilarity = 0;
  
  for (const seed of seeds) {
    const seedWords = seed.toLowerCase().split(' ');
    const textWords = textLower.split(' ');
    
    // Simple word overlap similarity
    const overlap = seedWords.filter(word => 
      textWords.some(textWord => 
        textWord.includes(word) || word.includes(textWord)
      )
    ).length;
    
    const similarity = overlap / Math.max(seedWords.length, 1);
    maxSimilarity = Math.max(maxSimilarity, similarity);
  }
  
  return maxSimilarity;
};

const categorizeComplaint = (text: string): 'healthcare' | 'education' => {
  const healthcareScore = calculateSimilarity(text, EMBEDDING_SEEDS.healthcare);
  const educationScore = calculateSimilarity(text, EMBEDDING_SEEDS.education);
  
  return healthcareScore >= educationScore ? 'healthcare' : 'education';
};

const calculateSemanticSeverity = (text: string): { score: number; matched: string[] } => {
  const highScore = calculateSimilarity(text, EMBEDDING_SEEDS.severity.high);
  const mediumScore = calculateSimilarity(text, EMBEDDING_SEEDS.severity.medium);
  const lowScore = calculateSimilarity(text, EMBEDDING_SEEDS.severity.low);
  
  const maxScore = Math.max(highScore, mediumScore, lowScore);
  let matched: string[] = [];
  
  if (maxScore === highScore && highScore > 0) {
    matched = EMBEDDING_SEEDS.severity.high.filter(seed => 
      text.toLowerCase().includes(seed.toLowerCase())
    );
  } else if (maxScore === mediumScore && mediumScore > 0) {
    matched = EMBEDDING_SEEDS.severity.medium.filter(seed => 
      text.toLowerCase().includes(seed.toLowerCase())
    );
  } else if (maxScore === lowScore && lowScore > 0) {
    matched = EMBEDDING_SEEDS.severity.low.filter(seed => 
      text.toLowerCase().includes(seed.toLowerCase())
    );
  }
  
  return { score: maxScore, matched };
};

const calculateKeywordIntent = (text: string): { score: number; matched: string[] } => {
  const textLower = text.toLowerCase();
  let totalScore = 0;
  const matched: string[] = [];
  
  Object.entries(PRIORITY_KEYWORDS).forEach(([category, keywords]) => {
    const categoryMatches = keywords.filter(keyword => 
      textLower.includes(keyword.toLowerCase())
    );
    
    if (categoryMatches.length > 0) {
      matched.push(...categoryMatches);
      
      // Weight different categories
      const weight = category === 'urgent' ? 0.4 : 
                    category === 'medical' ? 0.3 :
                    category === 'vulnerable' ? 0.2 : 0.1;
      
      totalScore += (categoryMatches.length / keywords.length) * weight;
    }
  });
  
  return { score: Math.min(totalScore, 1), matched };
};

const calculateVulnerabilityBoost = (text: string): number => {
  const vulnerableKeywords = PRIORITY_KEYWORDS.vulnerable;
  const textLower = text.toLowerCase();
  
  const matches = vulnerableKeywords.filter(keyword => 
    textLower.includes(keyword.toLowerCase())
  ).length;
  
  return Math.min(matches * 0.2, 0.5); // Max 0.5 boost
};

const calculateRecencyBoost = (text: string): number => {
  const textLower = text.toLowerCase();
  const recencyPatterns = [
    /today|now|immediately|urgent/i,
    /yesterday|since yesterday/i,
    /(\d+)\s*(day|days)\s*ago/i,
    /(\d+)\s*(week|weeks)\s*ago/i
  ];
  
  if (recencyPatterns[0].test(textLower)) return 0.3;
  if (recencyPatterns[1].test(textLower)) return 0.2;
  if (recencyPatterns[2].test(textLower)) return 0.1;
  if (recencyPatterns[3].test(textLower)) return 0.05;
  
  return 0;
};

const calculateEvidenceBoost = (hasAttachments: boolean, clusterCount: number = 0): number => {
  let boost = 0;
  
  if (hasAttachments) boost += 0.1;
  if (clusterCount > 1) boost += Math.min(clusterCount * 0.05, 0.2);
  
  return boost;
};

export const analyzePriority = (
  text: string, 
  hasAttachments: boolean = false,
  clusterCount: number = 0
): PriorityAnalysis & { category: 'healthcare' | 'education'; priority_score: number; priority_label: 'high' | 'medium' | 'low' } => {
  
  const category = categorizeComplaint(text);
  const semanticResult = calculateSemanticSeverity(text);
  const keywordResult = calculateKeywordIntent(text);
  const vulnerabilityBoost = calculateVulnerabilityBoost(text);
  const recencyBoost = calculateRecencyBoost(text);
  const evidenceBoost = calculateEvidenceBoost(hasAttachments, clusterCount);
  
  // Priority scoring formula as specified
  const priorityScore = Math.min(
    0.45 * semanticResult.score +
    0.25 * keywordResult.score +
    0.15 * vulnerabilityBoost +
    0.10 * recencyBoost +
    0.05 * evidenceBoost,
    1.0
  );
  
  // Map to priority label
  const priorityLabel: 'high' | 'medium' | 'low' = 
    priorityScore >= PRIORITY_THRESHOLDS.HIGH ? 'high' :
    priorityScore >= PRIORITY_THRESHOLDS.MEDIUM ? 'medium' : 'low';
  
  return {
    category,
    priority_score: priorityScore,
    priority_label: priorityLabel,
    semantic_severity: semanticResult.score,
    keyword_intent: keywordResult.score,
    vulnerability_boost: vulnerabilityBoost,
    recency_boost: recencyBoost,
    evidence_boost: evidenceBoost,
    matched_seeds: semanticResult.matched,
    matched_keywords: keywordResult.matched
  };
};

export const explainPriority = (analysis: PriorityAnalysis): string => {
  const explanations: string[] = [];
  
  if (analysis.semantic_severity > 0.3) {
    explanations.push(`High severity indicators: ${analysis.matched_seeds.join(', ')}`);
  }
  
  if (analysis.keyword_intent > 0.2) {
    explanations.push(`Urgent keywords: ${analysis.matched_keywords.join(', ')}`);
  }
  
  if (analysis.vulnerability_boost > 0) {
    explanations.push('Vulnerable population mentioned');
  }
  
  if (analysis.recency_boost > 0) {
    explanations.push('Time-sensitive issue');
  }
  
  if (analysis.evidence_boost > 0) {
    explanations.push('Supporting evidence provided');
  }
  
  return explanations.join('; ') || 'Standard priority assessment';
};