# Mutant Detector

Una aplicación web desarrollada en Angular para detectar si un humano es mutante basándose en su secuencia de ADN. La aplicación analiza una matriz de ADN (NxN) y determina si contiene más de una secuencia de cuatro letras nitrogenadas iguales (A, T, C, G) en direcciones horizontal, vertical o diagonal.

## Características

- **Interfaz intuitiva**: Ingresa el ADN en una cuadrícula de celdas individuales.
- **Validación automática**: Solo acepta letras válidas (A, T, C, G) y matrices cuadradas.
- **Resaltado visual**: Las secuencias válidas se marcan con colores alternados (verde, rojo, azul, amarillo, morado).
- **Navegación automática**: El foco pasa a la siguiente celda al ingresar una letra válida.
- **Detección eficiente**: Algoritmo optimizado para matrices de hasta 6x6.
- **Pruebas unitarias**: Cobertura completa con Vitest.

## Cómo funciona

### Lógica de detección
1. **Entrada**: Recibe una matriz de ADN como array de strings, donde cada string representa una fila.
2. **Validación**: Verifica que la matriz sea cuadrada y contenga solo letras válidas (A, T, C, G).
3. **Análisis**: Busca secuencias de 4 letras iguales en 4 direcciones:
   - Horizontal (izquierda a derecha)
   - Vertical (arriba a abajo)
   - Diagonal principal (arriba-izquierda a abajo-derecha)
   - Diagonal inversa (arriba-derecha a abajo-izquierda)
4. **Resultado**: Si encuentra más de una secuencia válida, clasifica como mutante.
5. **Resaltado**: Muestra las secuencias encontradas con colores diferenciados.

### Ejemplo
Para el ADN:
```
ATGCGA
CAGTGC
TTATGT
AGAAGG
CCCCTA
TCACTG
```

La aplicación detecta múltiples secuencias (como `AAAA` en diagonal y `CCCC` horizontal) y marca al individuo como mutante.

## Cómo usar

### Requisitos previos
- Node.js (versión 18 o superior)
- npm o yarn

### Instalación
1. Clona el repositorio:
   ```bash
   git clone <url-del-repositorio>
   cd angular-mutant-detector
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

### Ejecutar la aplicación
1. Inicia el servidor de desarrollo:
   ```bash
   npm start
   ```

2. Abre tu navegador y ve a `http://localhost:4200`.

3. Ingresa el ADN:
   - La aplicación carga un ejemplo mutante por defecto.
   - Haz clic en una celda y escribe una letra (A, T, C, G).
   - El foco se mueve automáticamente a la siguiente celda.
   - Completa todas las 36 celdas (6x6).

4. Presiona "Validar ADN":
   - La app verifica el ADN y muestra el resultado.
   - Las secuencias válidas se resaltan con colores.

### Desarrollo
Para desarrollo local con recarga automática:
```bash
npm start
```

### Construcción para producción
```bash
npm run build
```

Los archivos compilados se guardan en `dist/`.

### Ejecutar pruebas
```bash
npm test
```

Ejecuta las pruebas unitarias con Vitest.

## Tecnologías

- **Angular 21**: Framework principal para la UI.
- **TypeScript**: Lenguaje de programación.
- **Vitest**: Framework de pruebas unitarias.
- **CSS**: Estilos personalizados para la interfaz.

## Estructura del proyecto

```
src/
├── app/
│   ├── app.ts              # Componente principal con lógica de detección
│   ├── app.html            # Plantilla de la interfaz
│   ├── app.css             # Estilos de la aplicación
│   ├── app.spec.ts         # Pruebas unitarias
│   └── app.config.ts       # Configuración de Angular
├── main.ts                 # Punto de entrada
└── styles.css              # Estilos globales
```

## Contribuir

1. Fork el proyecto.
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`).
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`).
4. Push a la rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.
