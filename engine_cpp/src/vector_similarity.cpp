#include "vector_similarity.hpp"
#include <algorithm>

namespace actip {

std::vector<MatchResult> VectorSimilarityEngine::searchTopK(
    const std::vector<float>& queryVec,
    const std::vector<TechniqueVector>& corpus,
    size_t k,
    float threshold
) {
    std::vector<MatchResult> results;
    results.reserve(corpus.size());

    for (const auto& tech : corpus) {
        float sim = cosineSimilarity(queryVec, tech.embedding);
        if (sim >= threshold) {
            results.push_back({tech.id, tech.name, tech.tactic, sim});
        }
    }

    std::sort(results.begin(), results.end(), [](const MatchResult& a, const MatchResult& b) {
        return a.score > b.score;
    });

    if (results.size() > k) {
        results.resize(k);
    }

    return results;
}

} // namespace actip
