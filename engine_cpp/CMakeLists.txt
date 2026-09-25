cmake_minimum_required(VERSION 3.10)
project(actip_core_engine CXX)

set(CMAKE_CXX_STANDARD 14)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include_directories(src)

set(SOURCES
    src/main.cpp
    src/vector_similarity.cpp
    src/jarm_fingerprint.cpp
    src/snort_rule_generator.cpp
    src/bgp_trie.cpp
)

add_executable(actip_engine ${SOURCES})
