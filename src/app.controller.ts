import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get(':n_processo')
  getNumeroProcesso(@Param('n_processo') n_processo: string) {
    return this.appService.getProcesso(n_processo);
  }

  @Get('/mov/:n_processo')
  getNumeroProcessoMov( @Param('n_processo') n_processo: string)  {
    return this.appService.getProcessoMov(n_processo);
  }
}
