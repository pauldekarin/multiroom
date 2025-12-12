//
// Created by bimba on 11/15/25.
//

#ifndef PATH_HPP
#define PATH_HPP
#include <filesystem>
#include <string>


namespace Path
{
    static std::filesystem::path ROOT = std::filesystem::current_path().parent_path();
    static std::filesystem::path BIN = ROOT / "bin";
    static std::filesystem::path CONFIG = ROOT / "config";

    static std::filesystem::path config(const std::string& path)
    {
        return (CONFIG) / (path);
    }

    static std::filesystem::path bin(const std::filesystem::path& path)
    {
        return (BIN) / (path);
    }
}

#endif //PATH_HPP
