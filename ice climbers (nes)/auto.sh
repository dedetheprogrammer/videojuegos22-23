#!/bin/bash
g++ main.cpp -Wall -Wno-missing-braces -std=c++11 -I../raylib -L../raylib -lraylib -lopengl32 -lgdi32 -lwinmm -o main && ./main