#include <iostream>
#include "raylib.h"

int main() {
    const int height = 1000;
    const int width = 1400;
    const int img_height = 217;
    const int img_width = 350;

    SetConfigFlags(FLAG_WINDOW_RESIZABLE);

    InitWindow(width, height, "P0_1");
    InitAudioDevice();
    Vector2 pos = { width/2, height/2 };
    SetTargetFPS(60);
    Texture2D img = LoadTexture("dvd.png");
    img.height = img_height;
    img.width = img_width;
    auto moveX = 200;
    auto moveY = 200;
    Sound ping = LoadSound("cartoon118.mp3");

    auto ratioX = width / img_width;
    auto ratioY = height / img_height;
    while(!WindowShouldClose()) {
        img.width = GetScreenWidth() / ratioX;
        img.height = GetScreenHeight() / ratioY;
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
        ClearBackground(WHITE);
        DrawTexture(img, (int)pos.x, (int)pos.y, WHITE);
        EndDrawing();
    }
    StopSoundMulti();
    UnloadSound(ping);
    CloseAudioDevice();
    CloseWindow();
    return 0;
}