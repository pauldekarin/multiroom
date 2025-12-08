//
// Created by bimba on 11/15/25.
//

#ifndef PATH_HPP
#define PATH_HPP
#include <filesystem>
#include <string>

#define CONFIGURATION_DIR "configuration"
#define BIN_DIR "bin"

namespace Path
{
    static std::filesystem::path configuration(const std::string& path)
    {
        return std::filesystem::current_path().parent_path() .parent_path().parent_path()/ (CONFIGURATION_DIR) / (path);
    }

    static std::filesystem::path bin(const std::filesystem::path& path)
    {
        return std::filesystem::current_path() / (BIN_DIR) / (path);
    }
};

#endif //PATH_HPP
