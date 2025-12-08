//
// Created by bimba on 11/15/25.
//

#include "Tests.hpp"

TEST(Path, configuration)
{
    std::string filename = "app.yaml";
    ASSERT_TRUE(absl::EndsWith( Path::configuration(filename).string(), "/configuration/" + filename));
}
