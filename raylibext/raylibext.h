#include <cmath>
#include <iostream>
#include "raylib.h"


Vector2 operator+(Vector2 v, Vector2 w) {
    return Vector2{v.x + w.x, v.y + w.y};
}

void operator+=(Vector2& v, Vector2 w) {
    v.x += w.x;
    v.y += w.y;
}

Vector2 operator-(Vector2 v, Vector2 w) {
    return Vector2{v.x - w.x, v.y - w.y};
}

void operator-=(Vector2& v, Vector2 w) {
    v.x -= w.x;
    v.y -= w.y;
}

template <typename T>
Vector2 operator*(Vector2 v, T d) {
    return Vector2{v.x*d, v.y*d};
}

template <typename T>
Vector2 operator/(Vector2 v, T d) {
    return Vector2{v.x/d, v.y/d};
}

float mod(Vector2 v) {
    return std::sqrt(v.x*v.x + v.y*v.y);
}

Vector2 nor(Vector2 v) {
    return v/mod(v);
}

std::ostream& operator<<(std::ostream& os, Vector2 v) {
    return os << "(" << v.x << "," << v.y << ")";
}

