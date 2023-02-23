#include <cmath>
#include <iomanip>
#include <iostream>
#include <memory>
#include <random>
#include <sstream>
#include <vector>

#include "animator.h"
#include "colisiones.h"
#include "raylib.h"


// Dimensiones de la ventana.
int WINDOW_WIDTH  = 720;
int WINDOW_HEIGHT = 720;

Font NES;

// Movimiento.
int GetAxis(std::string axis) {
    if (axis == "Horizontal") {
        bool left_key  = IsKeyDown(KEY_A) || IsKeyDown(KEY_LEFT);
        bool right_key = IsKeyDown(KEY_D) || IsKeyDown(KEY_RIGHT); 
        if (left_key && right_key) return 0;
        else if (left_key) return -1;
        else if (right_key) return 1;
    } else if (axis == "Vertical") {
        bool down_key = IsKeyDown(KEY_S) || IsKeyDown(KEY_DOWN);
        bool up_key   = IsKeyDown(KEY_W) || IsKeyDown(KEY_UP); 
        if (down_key && up_key) return 0;
        if (down_key) return -1;
        else if (up_key) return 1;
    }
    return 0;
}

// Test de coliisiones.
//Rectangle techo{200, WINDOW_HEIGHT - 200, 100, 50};
//Rectangle suelo{0, WINDOW_HEIGHT - 67, WINDOW_WIDTH, 67};

class GameObject {
private:
    //...
public:
    // Propiedades hardcodeadas.
    bool isRight;      // Telling us if the object is facing to the right.
    bool isJumping;    // Telling us if the object is jumping.
    float speed;       // GameObject speed.
    Vector2 position;  // GameObject position.
    Animator animator; // Animator component.

    std::unordered_map<std::string, Component> components;

    GameObject(float speed, Vector2 position, Animator animator) {
        isRight = true;
        isJumping = false;
        this->speed    = speed;
        this->position = position; 
        this->animator = animator;
    }

    void AddComponent(std::string id, Component c) {
        components[id] = c;
    }

    void Move() {
        // Horizontal movement:
        int move = GetAxis("Horizontal");
        if (!move) {
            if (!isJumping) animator["Idle"];
        } else {
            if (!isJumping) animator["Walk"];
            if ((move < 0 && isRight) || (move > 0 && !isRight)) {
                isRight = !isRight;
                animator.Flip();
            }
        }
        position.x += (move * (speed + (IsKeyDown(KEY_LEFT_SHIFT) || IsKeyDown(KEY_RIGHT_SHIFT) ? 80 : 0)) * GetFrameTime());

        // Jump:
        /*
        if (!jumping && (IsKeyPressed(KEY_SPACE) || IsKeyPressed(KEY_W))) {
            PlaySound(jump);
            jumping = true;
            jump_direction = true;
            sprite = Popo_jump_up;
            src.height = Popo_jump_up.height;
            src.width = Popo_jump_up.width * sense;
            dst.height = Popo_jump_up.height*3;
            dst.width = Popo_jump_up.width*3;
        } else if (jumping) {
            sprite = Popo_jump_up;
            src.height = Popo_jump_up.height;
            src.width = Popo_jump_up.width * sense;
            dst.height = Popo_jump_up.height*3;
            dst.width = Popo_jump_up.width*3;
            float offset = (speed*3) * GetFrameTime();
            if (jump_height <= max_jump_height && jump_direction == true) {
                jump_height += offset;

                if (CollisionHelper::Collides(dst, techo)) jump_direction = false;
                else dst.y -= offset;

            } else {
                sprite = Popo_jump_down;
                src.height = Popo_jump_down.height;
                src.width = Popo_jump_down.width * sense;
                dst.height = Popo_jump_down.height*3;
                dst.width = Popo_jump_down.width*3;
                jump_direction = false;
                if (jump_height - offset > 0) {
                    jump_height -= offset;
                    dst.y += offset;
                }
                //if (!CollisionHelper::Collides(dst, suelo))
                //{
                //    jump_height -= offset;
                //    dst.y += offset;
                //}
                else
                {
                    jump_height = 0;
                    dst.y = WINDOW_HEIGHT - Popo_sprite.height*2.0f - 91;
                    //dst.y = suelo.y;
                    jumping = false;
                    sprite = Popo_sprite;
                    src.height = Popo_sprite.height;
                    src.width = Popo_sprite.width * sense;
                    dst.height = Popo_sprite.height*3;
                    dst.width = Popo_sprite.width*3;
                }
            }
        }
        */
    }

    void Draw() {
        /*
        if (position.x + position.width < 0) {
            position.x = GetScreenWidth();
        } if (dst.x > GetScreenWidth()) {
            position.x = -position.width;
        }
        */
        animator.Play(Vector2{position.x, position.y});
    }

};

class AudioSource {
private:
    //...
public:

    AudioSource() {}

    void Play() {

    }

};

class SoundType : public AudioSource {
private:
    Sound source;
public:
    SoundType (const char *fileName) {
        source = LoadSound(fileName);
    }

    void Unload() {
        UnloadSound(source);
    }
};

class MusicType : public AudioSource {
private:
    Music source;
public:
    MusicType (const char *fileName, bool loop) {
        source = LoadMusicStream(fileName);
        source.looping = loop;
        PlayMusicStream(source);
    }

    //void Init() {
    //    PlayMusicStream(source);
    //}

    void Play() {
        UpdateMusicStream(source);
    }

    void Unload() {
        UnloadMusicStream(source);
    }
};

void game() {

    // Audio. Source/Sound player component?
    SoundType Jump("Assets/NES - Ice Climber - Sound Effects/09-Jump.wav");
    MusicType BGM("Assets/NES - Ice Climber - Sound Effects/03-Play-BGM.mp3", true);
    
    // Textures. Sprite component?
    Texture2D Snowball = LoadTexture("Assets/NES - Ice Climber - Sprites/03-Snowball.png");
    Texture2D Pause_frame = LoadTexture("Assets/NES - Ice Climber - Sprites/04-Small-frame.png");
    Texture2D Mountain_sprite = LoadTexture("Assets/NES - Ice Climber - Sprites/01-Mountain.png");
    Texture2D Popo_sprite = LoadTexture("Assets/NES - Ice Climber - Sprites/02-Popo-Idle.png");

    // Animations & Animator component.
    Animator PopoAnimator(
        "Idle", 
        {
            {"Idle", Animation("Assets/NES - Ice Climber - Sprites/02-Popo-Idle.png", 16, 24, 3, 0.2)},
            {"Walk", Animation("Assets/NES - Ice Climber - Sprites/03-Popo-Walk.png", 16, 24, 3, 0.135)}
        }
    );

    // Rectangles = Sprites component?
    // Mountain background:
    Rectangle src{0, (float)(Mountain_sprite.height - Mountain_sprite.width), (float)Mountain_sprite.width, (float)Mountain_sprite.width};
    Rectangle dst{0, 0, (float)WINDOW_WIDTH, (float)WINDOW_HEIGHT};
    
    // PAUSE frame:
    float paused_showtime = 0.75;
    bool show = true;
    Rectangle src_0{0, 0, (float)Pause_frame.width, (float)Pause_frame.height};
    Rectangle dst_1{(WINDOW_WIDTH - Pause_frame.width*3.0f)/2.0f + 4, (WINDOW_HEIGHT - Pause_frame.height)/2.0f - 3, Pause_frame.width*3.0f, Pause_frame.height*3.0f};
    
    // GameObject.
    GameObject Popo(100, Vector2{(WINDOW_WIDTH - Popo_sprite.width*2.0f)/2,(WINDOW_HEIGHT - Popo_sprite.height*2.0f)-91}, PopoAnimator);

    bool paused = false;
    while(!WindowShouldClose()) {
        BGM.Play();
        BeginDrawing();
        ClearBackground(BLACK);
        if (IsGamepadAvailable(0)) {
            if (IsGamepadButtonPressed(0, GAMEPAD_BUTTON_MIDDLE_RIGHT)) {
                paused = !paused;
            }
        }
        if (!paused) {
            Popo.Move();
            Popo.Draw();
        } else {
            DrawTexturePro(Pause_frame, src_0, dst_1, Vector2{0,0}, 0, WHITE);
            if (show) {
                if (paused_showtime <= 0) {
                    paused_showtime = 0.75;
                    show = false;
                } else {
                    DrawTextPro(NES, "PAUSED", Vector2{WINDOW_WIDTH/2.0f-55, WINDOW_HEIGHT/2.0f}, Vector2{0,0}, 0, 30, 1.5, WHITE);
                }
            } else {
                if (paused_showtime <= 0){
                    paused_showtime = 0.75;
                    show = true;
                }
            }
            paused_showtime -= GetFrameTime();
        }
        
        DrawTexturePro(Mountain_sprite, src, dst, Vector2{0,0}, 0, WHITE);
        //DrawRectangle(techo.x, techo.y, techo.width, techo.height, BLUE);
        //DrawRectangle(suelo.x, suelo.y, suelo.width, suelo.height, RED);
        //Popo_animations.animations["Walk"].Play(Vector2{350,581});
        EndDrawing();
    }
    UnloadTexture(Popo_sprite);
    UnloadTexture(Mountain_sprite);
    UnloadTexture(Pause_frame);
    UnloadTexture(Snowball);
    PopoAnimator.Unload();
    BGM.Unload();
    Jump.Unload();

}

int main() {

    std::ostringstream s;
    InitWindow(WINDOW_WIDTH,WINDOW_HEIGHT,"COÑO");
    InitAudioDevice(); // Initialize audio device.

    NES = LoadFont("Assets/NES - Ice Climber - Fonts/Pixel_NES/Pixel_NES.otf");

    // Title screen.
    // ---- Sprite
    Texture2D ts_bg = LoadTexture("Assets/NES - Ice Climber - Sprites/01-Title-screen.png");
    Texture2D ts_hammer = LoadTexture("Assets/NES - Ice Climber - Sprites/05-Menu-hammer.png");
    Rectangle ts_src{0, 0, (float)ts_bg.width, (float)ts_bg.height};
    Rectangle ts_dst{0, 0, (float)WINDOW_WIDTH, (float)WINDOW_HEIGHT};
    Rectangle ts_hammer_src{0, 0, (float)ts_hammer.width, (float)ts_hammer.height};
    int option = 0, options = 2;
    float option_change_timer = 0;
    Rectangle ts_hammer_dst_0{161, 388, ts_hammer.width*3.0f, ts_hammer.height*3.0f};
    Rectangle ts_hammer_dst_1{161, 438, ts_hammer.width*3.0f, ts_hammer.height*3.0f};
    int mountain = 0, mountains = 32;

    // ---- Music
    Music ts_music = LoadMusicStream("Assets/NES - Ice Climber - Sound Effects/01-Main-Title.mp3");
    ts_music.looping = true;
    bool play_music = false;

    PlayMusicStream(ts_music);

    SetTargetFPS(30);
    while(!WindowShouldClose()) {
        if (IsKeyPressed(KEY_M)) {
            play_music = !play_music;
        }
        if (play_music) {
            UpdateMusicStream(ts_music);
        }
        BeginDrawing();
        DrawTexturePro(ts_bg, ts_src, ts_dst, Vector2{0,0}, 0, WHITE);
        if (IsGamepadAvailable(0)) {
            if (option_change_timer <= 0) {
                option_change_timer = 0.12;
                int move = GetGamepadAxisMovement(0, GAMEPAD_AXIS_LEFT_Y);
                if (move < 0) {
                    option = (((option-1)%options) + options) % options;
                } else if (move > 0) {
                    option = (option+1)%options;
                }
            }
            if (IsGamepadButtonPressed(0,GAMEPAD_BUTTON_LEFT_FACE_UP)) {
                option = (((option-1)%options) + options) % options;
            }
            if (IsGamepadButtonPressed(0,GAMEPAD_BUTTON_LEFT_FACE_DOWN)) {
                option = (option+1)%options;
            }
            if (IsGamepadButtonPressed(0,GAMEPAD_BUTTON_LEFT_FACE_LEFT)) {
                mountain = (((mountain-1)%mountains) + mountains) % mountains;
            }
            if (IsGamepadButtonPressed(0,GAMEPAD_BUTTON_LEFT_FACE_RIGHT)) {
                mountain = (mountain+1)%mountains;
            }
        }
        if (option == 0) {
            DrawTexturePro(ts_hammer, ts_hammer_src, ts_hammer_dst_0, Vector2{0,0}, 0, WHITE);
        } else if (option == 1) {
            DrawTexturePro(ts_hammer, ts_hammer_src, ts_hammer_dst_1, Vector2{0,0}, 0, WHITE);
        }
        DrawText("Press [M] to mute the music", 20, 20, 20, WHITE);
        s << std::setw(2) << std::setfill('0') << mountain+1;
        //DrawTextPro(NES, "PAUSED", Vector2{WINDOW_WIDTH/2.0f-55, WINDOW_HEIGHT/2.0f}, Vector2{0,0}, 0, 30, 1.5, WHITE);
        DrawTextPro(NES, s.str().c_str(), Vector2{427, 485}, Vector2{0,0}, 0, 30, 4, Color{168,228,252,255});
        s.str("");
        EndDrawing();
        option_change_timer -= GetFrameTime();
        if (IsGamepadAvailable(0)) {
            if (IsGamepadButtonPressed(0, GAMEPAD_BUTTON_RIGHT_FACE_DOWN)) {
                StopMusicStream(ts_music);
                game();
                PlayMusicStream(ts_music);
            }
        }
        if (IsKeyPressed(KEY_ENTER)) {
            StopMusicStream(ts_music);
            game();
            PlayMusicStream(ts_music);
        }
    }

    // Title screen.
    UnloadFont(NES);
    UnloadTexture(ts_bg);
    UnloadMusicStream(ts_music);
    CloseAudioDevice();
    CloseWindow();

}