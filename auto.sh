#!/bin/bash
git clone https://github.com/raysan5/raylib
cd raylib/src
mingw32-make PLATFORM=PLATFORM_DESKTOP
# Para compilar un programa en raylib:
# g++ <file>.cpp -Wall -Wno-missing-braces -I../raylib/src -L../raylib/src -lraylib -lopengl32 -lgdi32 -lwinmm -o <output>