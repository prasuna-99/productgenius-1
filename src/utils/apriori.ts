import { Transaction, FrequentItemset, AssociationRule, Product, AprioriRecommendation } from '../types';

/**
 * Check if set A contains all elements of set B
 */
function isSubset(subset: string[], superset: string[]): boolean {
  const superSet = new Set(superset);
  return subset.every(item => superSet.has(item));
}

/**
 * Get combinations of an array with specific size k
 */
function getCombinations<T>(arr: T[], k: number): T[][] {
  if (k === 0) return [[]];
  if (arr.length === 0) return [];
  const head = arr[0];
  const tail = arr.slice(1);
  const withHead = getCombinations(tail, k - 1).map(c => [head, ...c]);
  const withoutHead = getCombinations(tail, k);
  return [...withHead, ...withoutHead];
}

/**
 * Generate candidate itemsets C_k from L_{k-1}
 */
function generateCandidates(prevFrequentItemsets: string[][], k: number): string[][] {
  const candidates: string[][] = [];
  const n = prevFrequentItemsets.length;

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const itemset1 = prevFrequentItemsets[i];
      const itemset2 = prevFrequentItemsets[j];

      // Join step: merge if first k-2 items are identical
      const prefix1 = itemset1.slice(0, k - 2);
      const prefix2 = itemset2.slice(0, k - 2);
      if (prefix1.every((val, idx) => val === prefix2[idx])) {
        const union = Array.from(new Set([...itemset1, ...itemset2])).sort();
        if (union.length === k) {
          // Prune step: check if all k-1 subsets are frequent
          const subsets = getCombinations(union, k - 1);
          const allSubsetsFrequent = subsets.every(sub =>
            prevFrequentItemsets.some(f => f.length === sub.length && sub.every((item, idx) => item === f[idx]))
          );
          if (allSubsetsFrequent) {
            candidates.push(union);
          }
        }
      }
    }
  }

  // Deduplicate
  const uniqueKeys = new Set<string>();
  const uniqueCandidates: string[][] = [];
  for (const c of candidates) {
    const key = c.join(':::');
    if (!uniqueKeys.has(key)) {
      uniqueKeys.add(key);
      uniqueCandidates.push(c);
    }
  }

  return uniqueCandidates;
}

/**
 * Counts occurrences of itemset across transactions
 */
function countSupport(itemset: string[], transactions: Transaction[]): number {
  let count = 0;
  for (const tx of transactions) {
    if (isSubset(itemset, tx.itemIds)) {
      count++;
    }
  }
  return count;
}

/**
 * Apriori Mining: Discovers all frequent itemsets that meet minSupport
 */
export function runApriori(
  transactions: Transaction[],
  minSupport: number = 0.15,
  maxItemsetSize: number = 3
): FrequentItemset[] {
  const total = transactions.length;
  if (total === 0) return [];

  const minCount = Math.max(1, Math.ceil(minSupport * total));
  const allFrequentItemsets: FrequentItemset[] = [];

  // Step 1: Find L1 (frequent 1-itemsets)
  const itemCounts: Record<string, number> = {};
  for (const tx of transactions) {
    for (const itemId of tx.itemIds) {
      itemCounts[itemId] = (itemCounts[itemId] || 0) + 1;
    }
  }

  let currentFrequent: string[][] = [];
  for (const [itemId, count] of Object.entries(itemCounts)) {
    if (count >= minCount) {
      currentFrequent.push([itemId]);
      allFrequentItemsets.push({
        items: [itemId],
        supportCount: count,
        support: Number((count / total).toFixed(4)),
      });
    }
  }

  // Sort lexicographically
  currentFrequent.sort((a, b) => a[0].localeCompare(b[0]));

  // Step 2: Iteratively find L_k for k = 2..maxItemsetSize
  let k = 2;
  while (currentFrequent.length > 0 && k <= maxItemsetSize) {
    const candidates = generateCandidates(currentFrequent, k);
    const nextFrequent: string[][] = [];

    for (const cand of candidates) {
      const count = countSupport(cand, transactions);
      if (count >= minCount) {
        nextFrequent.push(cand);
        allFrequentItemsets.push({
          items: cand,
          supportCount: count,
          support: Number((count / total).toFixed(4)),
        });
      }
    }

    currentFrequent = nextFrequent;
    k++;
  }

  return allFrequentItemsets;
}

/**
 * Generates Association Rules (A -> B) from frequent itemsets
 * Filtered by minConfidence threshold
 */
export function generateAssociationRules(
  frequentItemsets: FrequentItemset[],
  transactions: Transaction[],
  minConfidence: number = 0.5
): AssociationRule[] {
  const total = transactions.length;
  if (total === 0) return [];

  // Build a lookup map of support for itemsets
  const supportMap = new Map<string, { count: number; support: number }>();
  for (const itemset of frequentItemsets) {
    const key = [...itemset.items].sort().join(':::');
    supportMap.set(key, { count: itemset.supportCount, support: itemset.support });
  }

  // Helper to get support of any itemset
  const getSupport = (items: string[]) => {
    const key = [...items].sort().join(':::');
    if (supportMap.has(key)) return supportMap.get(key)!;
    const count = countSupport(items, transactions);
    return { count, support: count / total };
  };

  const rules: AssociationRule[] = [];

  // We only examine itemsets of size >= 2
  const multiItemsets = frequentItemsets.filter(fi => fi.items.length >= 2);

  for (const fi of multiItemsets) {
    const items = fi.items;
    const n = items.length;
    const itemsetSupport = fi.support;
    const itemsetCount = fi.supportCount;

    // Generate all non-empty proper subsets as antecedents
    // For size 2: 1-item antecedents
    // For size 3: 1-item and 2-item antecedents
    for (let r = 1; r < n; r++) {
      const antecedentCombinations = getCombinations(items, r);

      for (const antecedent of antecedentCombinations) {
        const antecedentSet = new Set(antecedent);
        const consequent = items.filter(x => !antecedentSet.has(x));

        const antecedentData = getSupport(antecedent);
        if (antecedentData.count === 0) continue;

        const confidence = itemsetCount / antecedentData.count;

        if (confidence >= minConfidence) {
          const consequentData = getSupport(consequent);
          const lift = consequentData.support > 0 
            ? confidence / consequentData.support 
            : 1.0;

          const ruleId = `${antecedent.sort().join('+')}_to_${consequent.sort().join('+')}`;

          rules.push({
            id: ruleId,
            antecedent: antecedent.sort(),
            consequent: consequent.sort(),
            support: Number(itemsetSupport.toFixed(4)),
            confidence: Number(confidence.toFixed(4)),
            lift: Number(lift.toFixed(2)),
            transactionCount: itemsetCount,
            antecedentCount: antecedentData.count,
          });
        }
      }
    }
  }

  // Deduplicate and Sort: primarily by confidence DESC, secondarily by support DESC, then lift DESC
  const seenRuleIds = new Set<string>();
  const uniqueRules: AssociationRule[] = [];

  for (const rule of rules) {
    if (!seenRuleIds.has(rule.id)) {
      seenRuleIds.add(rule.id);
      uniqueRules.push(rule);
    }
  }

  uniqueRules.sort((a, b) => {
    if (b.confidence !== a.confidence) return b.confidence - a.confidence;
    if (b.support !== a.support) return b.support - a.support;
    return b.lift - a.lift;
  });

  return uniqueRules;
}

/**
 * Given a set of items (e.g. cart or current product), recommend products
 * that have the highest confidence and support according to mined Apriori rules
 */
export function getAprioriRecommendationsForCart(
  cartProductIds: string[],
  rules: AssociationRule[],
  products: Product[],
  limit: number = 4
): AprioriRecommendation[] {
  const productMap = new Map<string, Product>();
  products.forEach(p => productMap.set(p.id, p));

  const recommendations: AprioriRecommendation[] = [];
  const recommendedIds = new Set<string>(cartProductIds); // don't recommend what's already in cart

  // 1. Direct antecedent matches: rules where the antecedent is a subset of the cart
  const matchingRules = rules.filter(r => {
    const antecedentMatches = isSubset(r.antecedent, cartProductIds);
    // At least one consequent item should NOT be in the cart
    const hasNewItem = r.consequent.some(id => !recommendedIds.has(id));
    return antecedentMatches && hasNewItem;
  });

  // Sort matching rules by highest confidence, then support
  matchingRules.sort((a, b) => (b.confidence * b.support) - (a.confidence * a.support));

  for (const rule of matchingRules) {
    for (const conseqId of rule.consequent) {
      if (!recommendedIds.has(conseqId) && productMap.has(conseqId)) {
        recommendedIds.add(conseqId);
        const recommendedProduct = productMap.get(conseqId)!;
        const basedOnProducts = rule.antecedent
          .map(id => productMap.get(id))
          .filter((p): p is Product => Boolean(p));

        const confPct = Math.round(rule.confidence * 100);
        const supPct = Math.round(rule.support * 100);

        recommendations.push({
          rule,
          recommendedProduct,
          basedOnProducts,
          confidencePercent: confPct,
          supportPercent: supPct,
          lift: rule.lift,
          reason: `Discovered from historical customer baskets: ${confPct}% of customers who bought ${basedOnProducts.map(p => p.title).join(' & ')} also purchased this product.`,
        });

        if (recommendations.length >= limit) return recommendations;
      }
    }
  }

  // 2. If cart is empty or fewer recommendations found, supplement with top global rules with highest confidence
  if (recommendations.length < limit) {
    for (const rule of rules) {
      for (const conseqId of rule.consequent) {
        if (!recommendedIds.has(conseqId) && productMap.has(conseqId)) {
          recommendedIds.add(conseqId);
          const recommendedProduct = productMap.get(conseqId)!;
          const basedOnProducts = rule.antecedent
            .map(id => productMap.get(id))
            .filter((p): p is Product => Boolean(p));

          const confPct = Math.round(rule.confidence * 100);
          const supPct = Math.round(rule.support * 100);

          recommendations.push({
            rule,
            recommendedProduct,
            basedOnProducts,
            confidencePercent: confPct,
            supportPercent: supPct,
            lift: rule.lift,
            reason: `Top Association Rule across store: ${confPct}% confidence and ${supPct}% support with ${basedOnProducts.map(p => p.title).join(' & ')}.`,
          });

          if (recommendations.length >= limit) return recommendations;
        }
      }
    }
  }

  return recommendations;
}
