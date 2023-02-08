#include <iostream>
#include <vector>
#include <random>
#include <ctime>
#include "raylib.h"

int main() {
    const int height = 1000;
    const int width = 1400;
    const int img_height = 50;
    const int img_width = 50;

    std::mt19937 rng(time(0));
    std::uniform_real_distribution<float> distribution(1.2f, 1.3f);
    std::uniform_int_distribution<int> distribution2(0, 100);
    std::uniform_real_distribution<float> distribution3(0.0f, 1.0f);


    SetConfigFlags(FLAG_WINDOW_RESIZABLE);

    InitWindow(width, height, "P0_1");
    SetTargetFPS(60);
    Texture2D img = LoadTexture("dvd.png");

    img.height = img_height;
    img.width = img_width;
    auto moveX = 140;
    auto moveY = 100;
    
    auto crec = 1.2;

    std::vector<Texture2D> imgs;
    for (int i = 0; i < 20; i++)
        imgs.push_back(img);
    std::vector<Vector3> infos;
    for (int i = 0; i < 20; i++)
        infos.push_back(Vector3{ width/2, height/2, distribution(rng) });
    std::vector<Vector2> dirs;
    for (int i = 0; i < 20; i++) {
        dirs.push_back(Vector2{ (distribution2(rng) < 50 ? -1 : 1) * distribution3(rng),
            (distribution2(rng) < 50 ? -1 : 1) * distribution3(rng) });
        std::cout << dirs.back().x << ", " << dirs.back().y << "\n";
    }

    while(!WindowShouldClose()) {
        for(auto i = 0; i < imgs.size(); i++) {
            if((infos[i].x > GetScreenWidth()) || (infos[i].x + imgs[i].width < 0)) {
                infos[i].x = width/2;
                infos[i].y = height/2;
                imgs[i].width = 50;
                imgs[i].height = 50;
            }
            else if((infos[i].y > GetScreenHeight()) || (infos[i].y + imgs[i].height < 0)) {
                infos[i].x = width/2;
                infos[i].y = height/2;
                imgs[i].width = 50;
                imgs[i].height = 50;
            }
            infos[i].x += (moveX * GetFrameTime() * dirs[i].x);
            infos[i].y += (moveY * GetFrameTime() * dirs[i].y);
            imgs[i].width *= infos[i].z;
            imgs[i].height *= infos[i].z;
            
        }
        
        BeginDrawing();
        ClearBackground(WHITE);
        for (int i = 0; i < imgs.size(); i++){
            DrawTexture(imgs[i], (int)infos[i].x, (int)infos[i].y, BLACK);
        }
        EndDrawing();
    }
    CloseWindow();
    return 0;
}