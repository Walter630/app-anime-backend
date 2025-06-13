import express, { Application, RequestHandler } from "express";

export class Api {
  public readonly app: Application;

  constructor() {
    this.app = express();
    this.app.use(express.json());
  }

  public addRota(caminho: string, metodo: string, handler: RequestHandler) {
    (this.app as any)[metodo.toLowerCase()](caminho, handler);
  }

  public iniciar(porta: number) {
    this.app.listen(porta, () => {
      console.log(`Rodando na porta ${porta}`);
    });
  }
}
