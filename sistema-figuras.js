///////////////////////////////////////////////////////////
// SISTEMA EXTENDIDO DE FIGURAS GEOMÉTRICAS - POO AVANZADO
///////////////////////////////////////////////////////////

// =========================
// Utilidad para validaciones
// =========================
function validarNumero(valor, nombre) {
  if (typeof valor !== 'number' || valor <= 0) {
    throw new Error(`El parámetro "${nombre}" debe ser un número mayor que 0`);
  }
}

// ==========================
// Estrategia: Comparación de similitud (Strategy Pattern)
// ==========================
class SimilitudStrategy {
  sonSimilares(fig1, fig2) {
    throw new Error('Método no implementado');
  }
}

// Mismo tipo de figura
class SimilitudTipo extends SimilitudStrategy {
  sonSimilares(fig1, fig2) {
    return fig1.nombre === fig2.nombre;
  }
}

// Áreas proporcionalmente similares
class SimilitudArea extends SimilitudStrategy {
  sonSimilares(fig1, fig2) {
    const a1 = fig1.calcularArea();
    const a2 = fig2.calcularArea();
    const ratio = a1 / a2;
    return ratio > 0.8 && ratio < 1.2; // ±20%
  }
}

// ==========================
// ADAPTER PATTERN para figuras 3D
// ==========================
class Figura3DAdapter {
  constructor(figura3D) {
    this.figura3D = figura3D;
    this.nombre = figura3D.nombre;
  }

  // Proyectar volumen a área 2D (solo para compatibilidad)
  calcularArea() {
    return this.figura3D.calcularVolumen() ** (2/3);
  }

  calcularPerimetro() {
    return 0; // No aplica
  }

  describir() {
    return `${this.nombre} (3D) - Volumen: ${this.figura3D
      .calcularVolumen()
      .toFixed(2)}`;
  }

  dibujarASCII() {
    return this.figura3D.dibujarASCII();
  }
}

// ==============================
// Clase abstracta FiguraGeometrica
// ==============================
class FiguraGeometrica {
  #id;

  constructor(nombre) {
    this.nombre = nombre;
    this.#id = Math.random().toString(36).substr(2, 9);
  }

  calcularArea() {
    throw new Error('Método calcularArea debe ser implementado');
  }

  calcularPerimetro() {
    throw new Error('Método calcularPerimetro debe ser implementado');
  }

  dibujarASCII() {
    return `[No implementado para ${this.nombre}]`;
  }

  describir() {
    return `${this.nombre} - Área: ${this.calcularArea().toFixed(
      2
    )}, Perímetro: ${this.calcularPerimetro().toFixed(2)}`;
  }

  get id() {
    return this.#id;
  }

  // Strategy para similitud
  compararSimilitud(figura, estrategia = new SimilitudTipo()) {
    return estrategia.sonSimilares(this, figura);
  }

  // Fábrica mejorada (Factory Method)
  static crear(tipo, parametros) {
    switch (tipo) {
      case 'circulo':
        return new Circulo(parametros.radio);
      case 'rectangulo':
        return new Rectangulo(parametros.ancho, parametros.alto);
      case 'pentagono':
        return new Pentagono(parametros.lado);
      case 'hexagono':
        return new Hexagono(parametros.lado);
      case 'cubo':
        return new Figura3DAdapter(new Cubo(parametros.lado));
      case 'esfera':
        return new Figura3DAdapter(new Esfera(parametros.radio));
      default:
        throw new Error('Tipo no reconocido');
    }
  }
}

// ====================
// Figuras 2D
// ====================

class Circulo extends FiguraGeometrica {
  constructor(radio) {
    validarNumero(radio, 'radio');
    super('Círculo');
    this.radio = radio;
  }

  calcularArea() {
    return Math.PI * this.radio ** 2;
  }

  calcularPerimetro() {
    return 2 * Math.PI * this.radio;
  }

  dibujarASCII() {
    return `
   ***   
 *     * 
 *     * 
   ***   
`;
  }
}

class Rectangulo extends FiguraGeometrica {
  constructor(ancho, alto) {
    validarNumero(ancho, 'ancho');
    validarNumero(alto, 'alto');
    super('Rectángulo');
    this.ancho = ancho;
    this.alto = alto;
  }

  calcularArea() {
    return this.ancho * this.alto;
  }

  calcularPerimetro() {
    return 2 * (this.ancho + this.alto);
  }

  dibujarASCII() {
    return `
+-----------+
|           |
|           |
+-----------+
`;
  }
}

class Pentagono extends FiguraGeometrica {
  constructor(lado) {
    validarNumero(lado, 'lado');
    super('Pentágono');
    this.lado = lado;
  }

  calcularArea() {
    return (5 * this.lado ** 2) / (4 * Math.tan(Math.PI / 5));
  }

  calcularPerimetro() {
    return 5 * this.lado;
  }

  dibujarASCII() {
    return `
   /\\
  /  \\
 /____\\
 \\    /
  \\__/
`;
  }
}

class Hexagono extends FiguraGeometrica {
  constructor(lado) {
    validarNumero(lado, 'lado');
    super('Hexágono');
    this.lado = lado;
  }

  calcularArea() {
    return ((3 * Math.sqrt(3)) / 2) * this.lado ** 2;
  }

  calcularPerimetro() {
    return 6 * this.lado;
  }

  dibujarASCII() {
    return `
  ____  
 /    \\ 
/      \\
\\      /
 \\____/
`;
  }
}

// ====================
// Figuras 3D
// ====================

class Cubo {
  constructor(lado) {
    validarNumero(lado, 'lado');
    this.nombre = 'Cubo';
    this.lado = lado;
  }

  calcularVolumen() {
    return this.lado ** 3;
  }

  dibujarASCII() {
    return `
+------+
|      |
+------+
|      |
+------+
`;
  }
}

class Esfera {
  constructor(radio) {
    validarNumero(radio, 'radio');
    this.nombre = 'Esfera';
    this.radio = radio;
  }

  calcularVolumen() {
    return (4 / 3) * Math.PI * this.radio ** 3;
  }

  dibujarASCII() {
    return `
   ***   
 *     * 
 *     * 
   ***   
`;
  }
}

// ====================
// Colección de figuras
// ====================
class ColeccionFiguras {
  constructor() {
    this.figuras = [];
  }

  agregar(figura) {
    this.figuras.push(figura);
  }

  listar() {
    console.log('=== FIGURAS ===');
    this.figuras.forEach(f => console.log(f.describir()));
  }
}

// =================================================
// DEMOSTRACIÓN COMPLETA
// =================================================

console.log("\n🚀 SISTEMA EXTENDIDO DE FIGURAS \n");

const coleccion = new ColeccionFiguras();

// Crear figuras usando Factory
const circulo = FiguraGeometrica.crear('circulo', { radio: 5 });
const pentagono = FiguraGeometrica.crear('pentagono', { lado: 4 });
const hexagono = FiguraGeometrica.crear('hexagono', { lado: 6 });
const cubo = FiguraGeometrica.crear('cubo', { lado: 3 });
const esfera = FiguraGeometrica.crear('esfera', { radio: 4 });

coleccion.agregar(circulo);
coleccion.agregar(pentagono);
coleccion.agregar(hexagono);
coleccion.agregar(cubo);
coleccion.agregar(esfera);

coleccion.listar();

// Comparación de similitud
console.log("\n🔍 Similitud entre figuras:");
console.log("Círculo ~ Pentágono (tipo):", circulo.compararSimilitud(pentagono));
console.log(
  "Pentágono ~ Hexágono (área):",
  pentagono.compararSimilitud(hexagono, new SimilitudArea())
);

// Dibujos ASCII
console.log("\n🖼️ DIBUJOS ASCII:");
console.log(circulo.dibujarASCII());
console.log(hexagono.dibujarASCII());
console.log(esfera.dibujarASCII());

console.log("\n✅ Sistema extendido ejecutado con éxito");
