# Autores
- Alberto Lardiés (735976).
- Devid Dokash (780131).
- Álvaro Pérez (781035).
# Decisiones de diseño
- Para el input, se ha decidido implementar un método que permita la utilización de múltiples teclas simultaneamente, asi hay mayor respuesta del movimiento o de otras opciones a la hora de pulsar las teclas.
- Para el movimiento de cámara, se mueve tanto el centro de la cámara (`eye`) como el objetivo (`target`). Esto se debe a que si solo se mueve uno de los dos, la camara se mueve pero queda fija en uno de los extremos, por lo que no se mueve libremente.
- La vista perspectiva y la vista ortogonal comparten la misma variable, pero en una aumenta el FOV y en la otra el zoom con una sencilla formula.
- La camara rota mediante el objetivo (`target`), se tenía la teoría de que tambien habia que rotar el vector `up`, pero los resultados no erán los esperados.
- Esta a pantalla completa porque se ve mejor y se puede reescalar, pero hay que vigilar no deformarlo, se podría mantener el ratio pero saldría cortada la visión.
- Los colores del fondo se han puesto por que molaba y se veia mas chulo.
# Fuentes
- [Pulsar múltiples teclas Pt.I](https://www.gavsblog.com/blog/detect-single-and-multiple-keypress-events-javascript)
- [Pulsar múltiples teclas Pt.II](https://stackoverflow.com/questions/5203407/how-to-detect-if-multiple-keys-are-pressed-at-once-using-javascript)
- [Página para obtener Codigo/Nombre de cada tecla](https://www.toptal.com/developers/keycode)
- [Cámara ortográfica](https://stackoverflow.com/questions/24147546/webgl-orthographic-camera)
- [MouseEvent.button](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
- [Densidad de pixeles Pt.I](https://stackoverflow.com/questions/19142993/how-draw-in-high-resolution-to-canvas-on-chrome-and-why-if-devicepixelratio)
- [Densidad de pixeles Pt.II](https://stackoverflow.com/a/15666143)