# Videojuegos 2022-23
Repositorio de las prácticas de la asignatura de Videojuegos del año 2022-23 de la Universidad de Zaragoza. La asignatura y las prácticas se desarrollarán mediante la utilización de la librería [Raylib](https://www.raylib.com).

El siguiente tutorial esta orientado únicamente a Windows, por lo que para probar los ejemplos de las prácticas en otros sistemas operativos, uno deberá conocer por su cuenta como tener Raylib instalado.

## Obtención de la libreria
### Primer método. Compilando el código fuente
#### (Opcional) Obtención del compilador de C/C++
En este caso se hará uso del compilador ofrecido por el entorno GCC [MinGW-w64](https://www.mingw-w64.org). Si ya se tiene instalado, ignorar este paso.
1. (Opcional) Instalar MinGW-w64:
    1. [Descargarlo](https://github.com/skeeto/w64devkit/releases/download/v1.17.0/w64devkit-1.17.0.zip).
    2. Añadir en las variables de entorno el directorio con los binarios. Por ejemplo, si se ha descomprimido en la carpeta `Descargas`, el directorio será `C:\Descargas\w64devkit\bin`.
2. (Este no es opcional) Instalar [Raylib](https://www.raylib.com):
    1. Clonar el repositorio: `git clone https://github.com/raysan5/raylib`
    2. Compilar el código fuente: `cd raylib/src && mingw32-make PLATFORM=PLATFORM_DESKTOP`
3. ¿Cómo compilo un proyecto de Raylib?
    - Los directorios del comando presuponen que raylib esta en la carpeta raiz `../raylib/src` y cada main de cada práctica en su propia carpeta. Para indicar otra directorio, simplemente hay que poner donde se encuentra en vez de la índicada en el comando.
    - `<file>.cpp` es el nombre con el main del proyecto.
    - `-I../raylib/src` indica la carpeta donde buscar los ficheros include definidos en el código fuente del juego (es para poner en vez de `#include "../raylib/src/raylib.h"` poner `"#include raylib.h"` y no depender de donde se encuentra la libreria por si se cambia y no tener que cambiarlo en todos los ficheros del juego si ha de hacerse).
    - `-L../raylib/src` indica donde buscar las librerias necesarias para compilar el código.
    - `-l<...>` indica la libreria a cargar, las cuatro opciones son necesarias para poder compilar correctamente el código.
    - `-o <output>` indica el nombre del ejectuable resultante.

```console
g++ <file>.cpp -Wall -Wno-missing-braces -I../raylib/src -L../raylib/src -lraylib -lopengl32 -lgdi32 -lwinmm -o <output>
```
