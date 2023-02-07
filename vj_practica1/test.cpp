#include <cmath>
#include <iostream>
#include "raylib.h"

int main() {
    const int height = 1000;
    const int width = 1000;

    SetConfigFlags(FLAG_WINDOW_RESIZABLE);

    InitWindow(width, height, "COÑO");
    InitAudioDevice();
    Vector2 pos = { width/2, height/2 };
    SetTargetFPS(60);
    Texture2D img = LoadTexture("dvd.png");
    auto moveX = 200;
    auto moveY = 200;
    Sound ping = LoadSound("cartoon118.mp3");


    int old_width = width, old_height = height;
    int new_width = width, new_height = height;
    auto aspect_ratio = (img_width >= img_height) ? 
        (float)img_height/(float)img_width :
        (float)img_width/(float)img_height;
    auto canvas_ratio = std::max(width/img_width, height/img_height);

    while(!WindowShouldClose()) {
        img.width  = std::min(GetScreenWidth(), GetScreenHeight()) / canvas_ratio;
        img.height = img.width * aspect_ratio; 

        if(pos.x + img.width > GetScreenWidth()) {
            pos.x = GetScreenWidth() - img.width;
        }
        if (pos.x < 0) {
            pos.x = 0;
        } 
        if(pos.y + img.height > GetScreenHeight()) {
            pos.y = GetScreenHeight() - img.height;
        }
        if((pos.y < 0)) {
            pos.y = 0;
        }
        if((pos.x + moveX * GetFrameTime() + img.width > GetScreenWidth()) || (pos.x + moveX * GetFrameTime() < 0)) {
            moveX *= -1;
            PlaySoundMulti(ping);
        } 
        if((pos.y + moveY * GetFrameTime() + img.height > GetScreenHeight()) || (pos.y + moveY * GetFrameTime() < 0)) {
            moveY *= -1;
            PlaySoundMulti(ping);
        }
        pos.x += moveX * GetFrameTime();
        pos.y += moveY * GetFrameTime();
        BeginDrawing();
        ClearBackground(GRAY);
        DrawTextureV(img, pos, WHITE);
        EndDrawing();
    }
    StopSoundMulti();
    UnloadSound(ping);
    CloseAudioDevice();
    CloseWindow();
    return 0;
}