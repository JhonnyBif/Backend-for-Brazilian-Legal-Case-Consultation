import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  postNumeroProcesso( @Body() n_processo: string)  {
    const processo:any = n_processo;
    return this.appService.getProcesso(processo.n_processo);
  }

  @Post('/mov')
  postNumeroProcessoMov( @Body() n_processo: string)  {
    const processo:any = n_processo;
    return this.appService.getProcessoMov(processo.n_processo);
  }
}
