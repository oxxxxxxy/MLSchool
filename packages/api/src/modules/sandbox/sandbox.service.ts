import { Injectable } from '@nestjs/common';
import { MathEngine, Point2D, Vector2D } from '@ml-school/shared';

@Injectable()
export class SandboxService {
  evaluateLinear(x: number, k: number, b: number): number {
    return MathEngine.linear(x, k, b);
  }

  evaluateParabola(x: number, a: number, b: number, c: number): number {
    return MathEngine.parabola(x, a, b, c);
  }

  evaluateMSE(points: Point2D[], k: number, b: number): number {
    return MathEngine.computeMSE(points, k, b);
  }

  evaluateCosineSimilarity(u: Vector2D, v: Vector2D): { dotProduct: number; similarity: number; angleDegrees: number } {
    return {
      dotProduct: MathEngine.vectorDotProduct(u, v),
      similarity: MathEngine.vectorCosineSimilarity(u, v),
      angleDegrees: MathEngine.vectorAngleDegrees(u, v)
    };
  }
}
