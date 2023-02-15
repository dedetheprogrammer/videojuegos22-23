#include <cmath>
#include <iostream>
#include <random>
#include <vector>
#include "raylib.h"

Texture2D Popo_sprite;
Texture2D Popo_walk[6];
Texture2D Popo_jump_up;
Texture2D Popo_jump_down;

class Object {
private:
    // ...
    Rectangle src;
    Rectangle dst;
    bool jumping;
    bool jump_direction;
    float jump_height;
    float max_jump_height = 150;
public:

    float speed;
    Vector2 position;
    Texture2D sprite;
    Sound jump;
    int count = 0;
    int count2 = 0;
    int step_interval = 300;


    Object(float speed, Vector2 position, Texture2D sprite, Sound jump) : position(position), sprite(sprite) {
        this->speed = speed;
        jumping = false;
        jump_height = 0;
        this->jump = jump;
        src = {0, 0, (float)sprite.width, (float)sprite.height};
        dst = {position.x, position.y, sprite.width*3.0f, sprite.height*3.0f};
    }

    void Move() {
        
        if (IsGamepadAvailable(0)) {
            float x_move = GetGamepadAxisMovement(0, GAMEPAD_AXIS_LEFT_X);
            if (x_move > 0) {
                if (src.width > 0) {
                    src.width *= -1;
                }
            } else if (x_move < 0) {
                if (src.width < 0) {
                    src.width *= -1;
                }
            }
            if (IsGamepadButtonDown(0, GAMEPAD_BUTTON_LEFT_THUMB)) {
                dst.x += x_move * (speed + 80) * GetFrameTime();
            } else {
                dst.x += x_move * speed * GetFrameTime();
            }
            if (!jumping && IsGamepadButtonDown(0, GAMEPAD_BUTTON_RIGHT_FACE_DOWN)) {
                PlaySound(jump);
                jumping = true;
                jump_direction = true;
            } else if (jumping) {
                float offset = (speed*3) * GetFrameTime();
                if (jump_height <= max_jump_height && jump_direction == true) {
                    jump_height += offset;
                    dst.y -= offset;
                } else {
                    jump_direction = false;
                    if (jump_height > 0) {
                        jump_height -= offset;
                        dst.y += offset;
                    } else {
                        jump_height = 0;
                        jumping = false;
                    }
                }
            }
        } else {
            int sense = 0;
            if (IsKeyDown(KEY_RIGHT) || IsKeyDown(KEY_D)) {
                sense = 1;
                count2++;
                if (count2 > step_interval){
                    sprite = Popo_walk[count];
                    src.height = Popo_walk[count].height;
                    src.width = Popo_walk[count].width;
                    dst.height = Popo_walk[count].height*3;
                    dst.width = Popo_walk[count].width*3;
                    count = (count + 1) % 6;
                    count2 = 0;
                }
                if (src.width > 0) {
                    src.width *= -1;
                }
            } else if (IsKeyDown(KEY_LEFT) || IsKeyDown(KEY_A)) {
                sense = -1;
                count2++;
                if (count2 > step_interval){
                    sprite = Popo_walk[count];
                    src.height = Popo_walk[count].height;
                    src.width = Popo_walk[count].width;
                    dst.height = Popo_walk[count].height*3;
                    dst.width = Popo_walk[count].width*3;
                    count = (count + 1) % 6;
                    count2 = 0;
                }
                if (src.width < 0) {
                    src.width *= -1;
                }
            } else {
                count = 0;
                count2 = 0;
                sprite = Popo_sprite;
                src.height = Popo_sprite.height;
                src.width = Popo_sprite.width;
                dst.height = Popo_sprite.height*3;
                dst.width = Popo_sprite.width*3;
            }
            if (IsKeyDown(KEY_LEFT_SHIFT) || IsKeyDown(KEY_RIGHT_SHIFT)) {
                dst.x += sense * (speed + 80) * GetFrameTime();
                step_interval = 150;
            } else {
                dst.x += sense * speed * GetFrameTime();
                step_interval = 300;
            }
            if (!jumping && IsKeyPressed(KEY_SPACE)) {
                PlaySound(jump);
                jumping = true;
                jump_direction = true;
                sprite = Popo_jump_up;
                src.height = Popo_jump_up.height;
                src.width = Popo_jump_up.width;
                dst.height = Popo_jump_up.height*3;
                dst.width = Popo_jump_up.width*3;
            } else if (jumping) {
                sprite = Popo_jump_up;
                src.height = Popo_jump_up.height;
                src.width = Popo_jump_up.width;
                dst.height = Popo_jump_up.height*3;
                dst.width = Popo_jump_up.width*3;
                float offset = (speed*3) * GetFrameTime();
                if (jump_height <= max_jump_height && jump_direction == true) {
                    jump_height += offset;
                    dst.y -= offset;
                } else {
                    sprite = Popo_jump_down;
                    src.height = Popo_jump_down.height;
                    src.width = Popo_jump_down.width;
                    dst.height = Popo_jump_down.height*3;
                    dst.width = Popo_jump_down.width*3;
                    jump_direction = false;
                    if (jump_height > 0) {
                        jump_height -= offset;
                        dst.y += offset;
                    } else {
                        jump_height = 0;
                        jumping = false;
                    }
                }
            }
        }
    }

    void Draw() {
        if (dst.x + dst.width < 0) {
            dst.x = GetScreenWidth();
        } if (dst.x > GetScreenWidth()) {
            dst.x = -dst.width;
        }
        DrawTexturePro(sprite, src, dst, Vector2{0,0}, 0, WHITE);
    }

};


int main(void) {


    int WINDOW_WIDTH  = 720;
    int WINDOW_HEIGHT = 720;
    InitWindow(WINDOW_WIDTH,WINDOW_HEIGHT,"COÑO");
    InitAudioDevice(); // Initialize audio device.

    Sound jump  = LoadSound("NES - Ice Climber - Sound Effects/09-Jump.wav");
    Music music = LoadMusicStream("NES - Ice Climber - Sound Effects/03-Main-BGM.ogg");
    music.looping = true;

    Popo_sprite = LoadTexture("ICE-CLIMBER-POPO-1.png");
    Popo_walk[0] = LoadTexture("ICE-CLIMBER-POPO-WALK-1.png");
    Popo_walk[1] = LoadTexture("ICE-CLIMBER-POPO-WALK-1.png");
    Popo_walk[2] = LoadTexture("ICE-CLIMBER-POPO-WALK-2.png");
    Popo_walk[3] = LoadTexture("ICE-CLIMBER-POPO-WALK-2.png");
    Popo_walk[4] = LoadTexture("ICE-CLIMBER-POPO-WALK-3.png");
    Popo_walk[5] = LoadTexture("ICE-CLIMBER-POPO-WALK-3.png");
    Popo_jump_up = LoadTexture("ICE-CLIMBER-POPO-JUMP-UP.png");
    Popo_jump_down = LoadTexture("ICE-CLIMBER-POPO-JUMP-DOWN.png");
    Texture2D Mountain_sprite = LoadTexture("ICE-CLIMBER-MOUNTAIN.png");
    Rectangle src{0, (float)(Mountain_sprite.height - Mountain_sprite.width), (float)Mountain_sprite.width, (float)Mountain_sprite.width};
    Rectangle dst{0, 0, (float)WINDOW_WIDTH, (float)WINDOW_HEIGHT};

    Object Popo(100, Vector2{(WINDOW_WIDTH - Popo_sprite.width*2.0f)/2,(WINDOW_HEIGHT - Popo_sprite.height*2.0f)-91}, Popo_sprite, jump);

    PlayMusicStream(music);
    while(!WindowShouldClose()) {
        UpdateMusicStream(music);
        BeginDrawing();
        ClearBackground(BLACK);
        //DrawTexturePro(Mountain_sprite, src, dst, Vector2{0,0}, 0, WHITE);
        Popo.Move();
        Popo.Draw();
        DrawTexturePro(Mountain_sprite, src, dst, Vector2{0,0}, 0, WHITE);
        EndDrawing();
    }
    UnloadTexture(Popo_sprite);
    UnloadTexture(Popo_walk[0]);
    UnloadTexture(Popo_walk[1]);
    UnloadTexture(Popo_walk[2]);
    UnloadTexture(Popo_walk[3]);
    UnloadTexture(Popo_walk[4]);
    UnloadTexture(Popo_walk[5]);
    UnloadMusicStream(music);  // Unload music stream buffers from RAM
    UnloadSound(jump);  // Unload music stream buffers from RAM
    CloseAudioDevice();
    CloseWindow();
}