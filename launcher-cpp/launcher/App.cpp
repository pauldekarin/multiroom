//
// Created by bimba on 11/15/25.
//

#include "Launcher.hpp"
#include "argparse/argparse.hpp"

int main(int argc, char** argv)
{
    argparse::ArgumentParser parser("multiroom");

    parser.add_argument("--root_dir")
          .help("Path to root directory")
          .default_value("../");
    parser.add_argument("--config_dir")
          .help("Path to config directory")
          .default_value("../config");
    parser.add_argument("--bin_dir")
          .help("Path to binary directory")
          .default_value("../bin");

    try
    {
        parser.parse_args(argc, argv);

        Path::BIN = std::filesystem::path(parser.get<std::string>("bin_dir"));
        Path::ROOT = std::filesystem::path(parser.get<std::string>("root_dir"));
        Path::CONFIG = std::filesystem::path(parser.get<std::string>("config_dir"));

        settings settings;
        Launcher launcher;
        launcher.launch(settings);
    }
    catch (const std::exception& e)
    {
        std::cerr << e.what() << std::endl;
        std::cerr << parser;
        std::exit(EXIT_FAILURE);
    }
}
