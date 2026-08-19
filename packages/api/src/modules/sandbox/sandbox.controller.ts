import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SandboxService } from './sandbox.service';
import { Point2D, Vector2D } from '@ml-school/shared';

@ApiTags('sandbox')
@Controller('api/sandbox')
export class SandboxController {
  constructor(private readonly sandboxService: SandboxService) {}

  @Post('evaluate-linear')
  @ApiOperation({ summary: 'Calculate y = kx + b' })
  evalLinear(@Body() body: { x: number; k: number; b: number }) {
    return { y: this.sandboxService.evaluateLinear(body.x, body.k, body.b) };
  }

  @Post('evaluate-parabola')
  @ApiOperation({ summary: 'Calculate y = ax^2 + bx + c' })
  evalParabola(@Body() body: { x: number; a: number; b: number; c: number }) {
    return { y: this.sandboxService.evaluateParabola(body.x, body.a, body.b, body.c) };
  }

  @Post('evaluate-mse')
  @ApiOperation({ summary: 'Calculate Mean Squared Error for points' })
  evalMSE(@Body() body: { points: Point2D[]; k: number; b: number }) {
    return { mse: this.sandboxService.evaluateMSE(body.points, body.k, body.b) };
  }

  @Post('evaluate-vector-similarity')
  @ApiOperation({ summary: 'Calculate Cosine similarity and angle between 2 vectors' })
  evalVectorSim(@Body() body: { u: Vector2D; v: Vector2D }) {
    return this.sandboxService.evaluateCosineSimilarity(body.u, body.v);
  }
}
