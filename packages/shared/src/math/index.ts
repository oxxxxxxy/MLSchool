// Mathematical utilities for interactive lessons and ML foundation

export interface Point2D {
  x: number;
  y: number;
}

export interface Vector2D {
  x: number;
  y: number;
}

export class MathEngine {
  /**
   * Linear function calculation: y = k * x + b
   */
  static linear(x: number, k: number, b: number): number {
    return k * x + b;
  }

  /**
   * Parabola calculation: y = a * x^2 + b * x + c
   */
  static parabola(x: number, a: number, b: number, c: number): number {
    return a * x * x + b * x + c;
  }

  /**
   * Parabola vertex (minimum / maximum): x = -b / (2a)
   */
  static parabolaVertex(a: number, b: number, c: number): Point2D {
    if (a === 0) return { x: 0, y: c };
    const vx = -b / (2 * a);
    const vy = this.parabola(vx, a, b, c);
    return { x: vx, y: vy };
  }

  /**
   * Numerical derivative estimation: (f(x + dx) - f(x - dx)) / (2 * dx)
   */
  static numericalDerivative(fn: (x: number) => number, x: number, dx: number = 0.0001): number {
    return (fn(x + dx) - fn(x - dx)) / (2 * dx);
  }

  /**
   * Secant slope between two points (x1, f(x1)) and (x2, f(x2))
   */
  static secantSlope(fn: (x: number) => number, x1: number, x2: number): number {
    if (Math.abs(x2 - x1) < 1e-9) return this.numericalDerivative(fn, x1);
    return (fn(x2) - fn(x1)) / (x2 - x1);
  }

  /**
   * Vector operations
   */
  static vectorLength(v: Vector2D): number {
    return Math.sqrt(v.x * v.x + v.y * v.y);
  }

  static vectorDotProduct(u: Vector2D, v: Vector2D): number {
    return u.x * v.x + u.y * v.y;
  }

  static vectorCosineSimilarity(u: Vector2D, v: Vector2D): number {
    const lenU = this.vectorLength(u);
    const lenV = this.vectorLength(v);
    if (lenU === 0 || lenV === 0) return 0;
    return this.vectorDotProduct(u, v) / (lenU * lenV);
  }

  static vectorAngleDegrees(u: Vector2D, v: Vector2D): number {
    const cos = Math.max(-1, Math.min(1, this.vectorCosineSimilarity(u, v)));
    return (Math.acos(cos) * 180) / Math.PI;
  }

  /**
   * Mean Squared Error (MSE) calculation: sum((y_i - y_hat_i)^2) / N
   */
  static computeMSE(points: Point2D[], k: number, b: number): number {
    if (points.length === 0) return 0;
    const totalSqErr = points.reduce((sum, p) => {
      const pred = this.linear(p.x, k, b);
      return sum + Math.pow(p.y - pred, 2);
    }, 0);
    return totalSqErr / points.length;
  }
}
