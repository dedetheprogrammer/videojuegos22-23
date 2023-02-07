#!/bin/bash
g++ test.cpp -Wall -Wno-missing-braces -std=c++11 -I../raylib/src -L../raylib/src -lraylib -lopengl32 -lgdi32 -lwinmm -o main