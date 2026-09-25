#pragma once
#include <string>
#include <vector>
#include <cmath>

namespace actip {

struct TechniqueVector {
    std::string id;
    std::string name;
    std::string tactic;
    std::vector<float> embedding;
};

struct MatchResult {
    std::string id;
    std::string name;
    std::string tactic;
    float score;
};

class VectorSimilarityEngine {
public:
    VectorSimilarityEngine() = default;

    static float cosineSimilarity(const std::vector<float>& a, const std::vector<float>& b) {
        if (a.empty() || a.size() != b.size()) return 0.0f;
        float dot = 0.0f;
        float normA = 0.0f;
        float normB = 0.0f;
        for (size_t i = 0; i < a.size(); ++i) {
            dot += a[i] * b[i];
            normA += a[i] * a[i];
            normB += b[i] * b[i];
        }
        if (normA == 0.0f || normB == 0.0f) return 0.0f;
        return dot / (std::sqrt(normA) * std::sqrt(normB));
    }

    std::vector<MatchResult> searchTopK(
        const std::vector<float>& queryVec,
        const std::vector<TechniqueVector>& corpus,
        size_t k = 5,
        float threshold = 0.65f
    );
};

} // namespace actip
