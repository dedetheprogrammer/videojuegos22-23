#include <cmath>
#include <iostream>
#include <random>
#include <vector>
#include "raylibext.h"

std::random_device rd;
std::mt19937 mt(rd());
std::uniform_int_distribution<> S(0,1);
std::uniform_real_distribution<float> C(0,1);

class Asteroid {
private:
    //float time;
public:
    //---- XY-axis movement:
    float move_speed;      // Speed of XY-axis movement.
    Vector2 origin;        // Asteroid XY origin.
    Vector2 position;      // Asteroid XY current coordinates.
    Vector2 mov_dir;       // XY-axis movement direction.
    //---- OZ-axis movement:
    float scale;           // Asteroid current scale.
    float scale_factor;    // Scaling cuantity.
    float scale_speed;     // Scaling speed.
    //---- rotation:
    float rotation;        // Asteroid current rotation.
    float rotation_factor; // Rotation cuantity.
    float rotation_speed;  // Rotation speed.
    //-- aspect:
    Texture2D sprite;      // Asteroid aspect.

    Asteroid (
        float move_speed, Vector2 origin, Vector2 mov_dir, // XY-movement.
        float scale_factor, float scale_speed,             // OZ-movement.
        float rotation_factor, float rotation_speed,       // Rotation.
        Texture2D sprite                                   // Aspect.
    ) {

        //-- Private properties
        //time = 0.0;
        //-- Asteroid properties
        //---- XY-axis movement
        this->move_speed      = move_speed;
        this->origin = position = origin;
        this->mov_dir         = mov_dir;
        //---- OZ-axis movement
        this->scale           = 0.0;
        this->scale_factor    = scale_factor;
        this->scale_speed     = scale_speed;
        //---- rotation
        this->rotation        = 0.0;
        this->rotation_factor = rotation_factor;
        this->rotation_speed  = rotation_speed;
        //---- aspect
        this->sprite = sprite;
    }

    void Update() {
        //-- Update asteroid properties
        //---- XY-axis movement
        position += (mov_dir * move_speed * GetFrameTime());
        //---- OZ-axis movement
        scale += (scale_factor * scale_speed * GetFrameTime());
        //---- rotation
        rotation += (rotation_factor * rotation_speed * GetFrameTime());
        //-- Drawing texture
        DrawTextureEx(sprite, position, rotation, scale, WHITE);
    }

    bool Renderable() {
        return (position.x <= GetScreenWidth()  && position.x + sprite.width  * scale >= 0 
            &&  position.y <= GetScreenHeight() && position.y + sprite.height * scale >= 0);
    }

/*
    void Update() {

        //time += GetFrameTime();
        current_scale += (initial_scale * 20 * GetFrameTime());
        current_pos += (mov_dir * 600 * GetFrameTime());
        DrawTextureEx(sprite, current_pos, 0, current_scale, WHITE);
        if (current_pos.x > GetScreenWidth()  || current_pos.x + sprite.width *current_scale < 0 ||
            current_pos.y > GetScreenHeight() || current_pos.y + sprite.height*current_scale < 0) {
                time = 0;
                current_scale = initial_scale; 
                current_pos   = initial_pos;
                direction     = random_direction();
        }
    }*/

        /*
    void Update() {
        
        time += GetFrameTime();
        //Vector2 aux = Vector2{(float)sprite.width, (float)sprite.height} * current_scale;
        current_scale += (initial_scale * speed * GetFrameTime()); //std::exp((speed * time)/0.75 - 3);
        //aux = (Vector2{(float)sprite.width, (float)sprite.height} * current_scale) - aux;
        //if (direction.x < 0) aux.x *= -1;
        //if (direction.y < 0) aux.y *= -1;
        //current_pos -= aux;
        current_pos += (Vector2{-10,1} * speed * GetFrameTime());
        //Rectangle r{current_pos.x, current_pos.y, (float)sprite.width * current_scale, ()float)sprite.height * current_scale};
        //DrawTexturePro(sprite, origin, r, Vector2{0,0}, 0, WHITE);
        DrawTextureEx(sprite, current_pos, 0, current_scale, WHITE);
        if (current_pos.x > GetScreenWidth()  || current_pos.x + sprite.width *current_scale < 0 ||
            current_pos.y > GetScreenHeight() || current_pos.y + sprite.height*current_scale < 0) {
                time = 0;
                //current_scale = initial_scale; 
                //current_pos   = initial_pos;
                //direction     = random_direction();
        }
    }*/

    friend std::ostream& operator<<(std::ostream& os, const Asteroid& a) {
        return os << "Initial position: " << a.position;
    }
};


void DVD() {

    //-- Window properties
    int WINDOW_WIDTH  = 1000;
    int WINDOW_HEIGHT = 1000;
    SetWindowSize(WINDOW_WIDTH, WINDOW_HEIGHT);
    SetWindowState(FLAG_WINDOW_RESIZABLE);

    //-- DVD logo properties
    float speed = 500;
    Vector2 position {(float)WINDOW_WIDTH/2,(float)WINDOW_HEIGHT/2};
    Vector2 direction {(float)(!S(mt) ? -1.0 : 1.0), (float)(!S(mt) ? -1.0 : 1.0)};
    Texture2D dvd = LoadTexture("dvd.png");

    //-- Sound
    InitAudioDevice();
    Sound oof = LoadSound("cartoon118.mp3");

    SetTargetFPS(60);
    while(!WindowShouldClose()) {
        //-- Recalculating dvd logo position:
        if (position.x < 0) {
            position.x = 0;
        }
        if(position.x + dvd.width > GetScreenWidth()) {
            position.x = GetScreenWidth() - dvd.width;
        }
        if (position.y < 0) {
            position.y = 0;
        }
        if (position.y + dvd.height > GetScreenHeight()) {
            position.y = GetScreenHeight() - dvd.height;
        }
        position += direction * speed * GetFrameTime();
        if (position.x + dvd.width > GetScreenWidth() || position.x < 0) {
            direction.x *= -1;
            PlaySoundMulti(oof);
        }
        if (position.y + dvd.height > GetScreenHeight() || position.y < 0) {
            direction.y *= -1;
            PlaySoundMulti(oof);
        }
        BeginDrawing();
        ClearBackground(GRAY);
        DrawTextureV(dvd, position, WHITE);
        DrawText("DVD DEMO", 25, 25, 50, WHITE);
        EndDrawing();
    }
    UnloadTexture(dvd);
    StopSoundMulti();
    UnloadSound(oof);
    CloseAudioDevice();
}


void Asteroids() {
    
    int WINDOW_WIDTH  = 1080;
    int WINDOW_HEIGHT = 720;

    // Asteroids properties:
    const int N_ASTEROIDS = 20;
    float move_speed      = 1000;
    float scale_factor    = 0.1;
    float scale_speed     = 35;
    float rotation_factor = 10;
    float rotation_speed  = 10;

    //-- Origin of the Saul goodman faces.
    int x_range = 100, y_range = 100;
    Vector2 origin{(float)WINDOW_WIDTH/2, (float)WINDOW_HEIGHT/2};
    std::uniform_int_distribution<> X_O(0,x_range), Y_O(0,y_range);

    //-- Window
    SetWindowSize(WINDOW_WIDTH, WINDOW_HEIGHT);
    SetWindowState(FLAG_WINDOW_RESIZABLE);
    SetTargetFPS(60);

    //-- Sound
    InitAudioDevice();
    Sound bcs = LoadSound("bettercallsaul.mp3");

    Texture2D asteroid_sprite = LoadTexture("saul_goodman.png");
    Vector2 offset{(float)asteroid_sprite.width/2, (float)asteroid_sprite.height/2};

    std::vector<Asteroid> asteroids;
    for (int i = 0; i < N_ASTEROIDS; i++) {

        int X_sign = (!S(mt) ? -1.0 : 1.0), Y_sign = (!S(mt) ? -1.0 : 1.0);
        Vector2 asteroid_origin{
            (float)((X_sign * X_O(mt)) + origin.x), 
            (float)((Y_sign * Y_O(mt)) + origin.y)
        }, asteroid_dir = nor({X_sign * C(mt), Y_sign * C(mt)});

        asteroids.push_back(
            Asteroid(
                move_speed, asteroid_origin - offset, asteroid_dir,
                scale_factor, scale_speed,
                (!S(mt) ? -1.0 : 1.0) * rotation_factor, rotation_speed,
                asteroid_sprite
            )
        );
        PlaySoundMulti(bcs);
        //std::cout << "Asteroid: " << asteroids.back() << "\n"; 
    }

    while(!WindowShouldClose()) {
        BeginDrawing();
        ClearBackground(BLACK);
        DrawTextureV(asteroid_sprite, origin-offset, WHITE);
        for (auto it = asteroids.begin(); it!= asteroids.end(); /*it++*/) {
            it->Update();
            if(!it->Renderable()) {
                it = asteroids.erase(it);
            } else {
                it++;
            }
        }
        for (int i = asteroids.size(); i < N_ASTEROIDS; i++) {
            int X_sign = (!S(mt) ? -1.0 : 1.0), Y_sign = (!S(mt) ? -1.0 : 1.0);
            Vector2 asteroid_origin{
                (float)((X_sign * X_O(mt)) + origin.x), 
                (float)((Y_sign * Y_O(mt)) + origin.y)
            }, asteroid_dir = nor({X_sign * C(mt), Y_sign * C(mt)});

            asteroids.push_back(
                Asteroid(
                    move_speed, asteroid_origin, asteroid_dir,
                    scale_factor, scale_speed,
                    (!S(mt) ? -1.0 : 1.0) * rotation_factor, rotation_speed,
                    asteroid_sprite
                )
            );
            PlaySoundMulti(bcs);
        }
        DrawText("ASTEROIDS DEMO", 25, 25, 50, WHITE);
        EndDrawing();
        if (WINDOW_WIDTH != GetScreenWidth() || WINDOW_HEIGHT != GetScreenHeight()) {
            WINDOW_WIDTH  = GetScreenWidth();
            WINDOW_HEIGHT = GetScreenHeight();
            origin = {(float)WINDOW_WIDTH/2, (float)WINDOW_HEIGHT/2};
        }
    }
    UnloadTexture(asteroid_sprite);
    UnloadSound(bcs);
    CloseAudioDevice();
    CloseWindow();
}

int main(void) {

    float current_time = 0, time = 0.5;
    std::vector<Color> colors = {
        LIGHTGRAY,GRAY,DARKGRAY,YELLOW,GOLD,ORANGE,PINK,RED,MAROON,GREEN,LIME,
        DARKGREEN,SKYBLUE,BLUE,DARKBLUE,PURPLE,VIOLET,DARKPURPLE, BEIGE,BROWN,
        DARKBROWN
    };
    std::uniform_int_distribution<> c(0,colors.size()-1);
    Color color = colors[c(mt)];

    int WINDOW_WIDTH  = 720;
    int WINDOW_HEIGHT = 720;
    InitWindow(WINDOW_WIDTH,WINDOW_HEIGHT,"COÑO");

    while(!WindowShouldClose()) {
        BeginDrawing();
        if (current_time > time) {
            color = colors[c(mt)];
            current_time = 0;
        } else {
            current_time += GetFrameTime();
        }
        ClearBackground(color);
        DrawText("Press 1 to play DVD demo.", (float)WINDOW_WIDTH/2-115, (float)WINDOW_HEIGHT/2-20, 20, WHITE);
        DrawText("Press 2 to play Asteroids demo.", (float)WINDOW_WIDTH/2-150, (float)WINDOW_HEIGHT/2+20, 20, WHITE);
        if (IsKeyPressed(KEY_ONE)) {
            DVD();
            SetWindowSize(WINDOW_WIDTH, WINDOW_HEIGHT);
            ClearWindowState(FLAG_WINDOW_RESIZABLE);
        } else if (IsKeyPressed(KEY_TWO)) {
            Asteroids();
            SetWindowSize(WINDOW_WIDTH, WINDOW_HEIGHT);
            ClearWindowState(FLAG_WINDOW_RESIZABLE);
        }
        EndDrawing();
    }
    
    CloseWindow();


}