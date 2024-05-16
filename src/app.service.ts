import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async getProcesso(n_processo: string) {
    const processo = this.validaNumero(n_processo);
    const numeroCNJ = processo.numeroCNJ; 

    if (!this.tribunais[processo.j] || !this.tribunais[processo.j][processo.tr -1] || !this.tribunais[processo.j][processo.tr -1].link) {
      return console.error(`Erro! O Tribunal não possui API.`);
    }
    const api = this.tribunais[processo.j][processo.tr -1].link;
    const tribunal = this.tribunais[processo.j][processo.tr - 1].nome;
     const result ={ api, tribunal, numeroCNJ };
    
    const resultado = await this.consomeApi(result)
    return resultado;
  }

  async getProcessoMov(n_processo: string) {
    const processo = this.validaNumero(n_processo);
    const numeroCNJ = processo.numeroCNJ; 

    if (!this.tribunais[processo.j] || !this.tribunais[processo.j][processo.tr -1] || !this.tribunais[processo.j][processo.tr -1].link) {
      return console.error(`Erro! O Tribunal não possui API.`);
    }
    const api = this.tribunais[processo.j][processo.tr -1].link;
    const tribunal = this.tribunais[processo.j][processo.tr - 1].nome;
     const result ={ api, tribunal, numeroCNJ };
    
    const resultado = await this.consomeApi(result)

    return resultado[0]._source.movimentos;
  }


  validaNumero(n_processo: string){
    const numero = n_processo;
    const bcmod = (x, y) =>
      {
        const take = 5;
        let mod:any = '';
    
        do
        {
          let a = parseInt(mod + x.substr(0, take));
          x = x.substr(take);
          mod = a % y;
        }
        while (x.length);
    
        return mod;
      };
    
      const numeroProcesso:any = numero.replace(/[.-]/g, '')
    
      if (numeroProcesso.length < 14 || isNaN(numeroProcesso)) {
        return false;
      }
    
      const digitoVerificadorExtraido = parseInt(numeroProcesso.substr(-13, 2));
    
      const vara = numeroProcesso.substr(-4, 4); 
      const tribunal = numeroProcesso.substr(-6, 2);
      const ramo = numeroProcesso.substr(-7, 1);
      const anoInicio = numeroProcesso.substr(-11, 4);
      const tamanho = numeroProcesso.length - 13;
      const numeroSequencial = numeroProcesso.substr(0, tamanho).padStart(7, '0');
    
      const digitoVerificadorCalculado = 98 - bcmod((numeroSequencial + anoInicio + ramo + tribunal + vara + '00'), '97');
    
      if( digitoVerificadorExtraido !== digitoVerificadorCalculado){
        console.error("Tá errado o numero")
        return;
      };
    const processo: any = {};
    processo.numeroCNJ = n_processo.replace(/\D/g, '');
    processo.n = processo.numeroCNJ.slice(0, 7);
    processo.d = processo.numeroCNJ.slice(7, 9);
    processo.a = processo.numeroCNJ.slice(9, 13);
    processo.j = processo.numeroCNJ.slice(13, 14);
    processo.tr = processo.numeroCNJ.slice(14, 16);
    processo.o = processo.numeroCNJ.slice(16, 20);
  
    return processo;
  }

  async consomeApi(data: { api: string, tribunal: string, numeroCNJ:string }): Promise<any> {
    try {
      const response = await axios.post(data.api, {
        query: {
          match: {
            numeroProcesso: data.numeroCNJ
          }
        }
      }, {
        headers: {
          'Authorization': 'APIKey cDZHYzlZa0JadVREZDJCendQbXY6SkJlTzNjLV9TRENyQk1RdnFKZGRQdw==',
          'Content-Type': 'application/json',
          'x-li-format': 'json'
        }
      });
  
      if (!response.data.hits.hits[0]) {
        return console.error("Erro! Não foi possível encontrar dados do processo. Isso pode acontecer porque ele é sigiloso ou não há movimentações ou está tramitando em outro tribunal.");
      } 
  
      return response.data.hits.hits;
    } catch (error) {
      console.error('Erro ao consumir a API:', error);
      throw error;
    }
  }

  tribunais = {
    1: [{ link: '', nome: 'Supremo Tribunal Federal' }],
    2: [{ link: '', nome: 'Conselho Nacional de Justiça' }],
    3: [{ link: 'https://api-publica.datajud.cnj.jus.br/api_publica_stj/_search', nome: 'Superior Tribunal de Justiça' }],
    4: [
      { link: 'https://api-publica.datajud.cnj.jus.br/api_publica_trf1/_search', nome: 'Tribunal Regional Federal da 1a Região' },
      { link: 'https://api-publica.datajud.cnj.jus.br/api_publica_trf2/_search', nome: 'Tribunal Regional Federal da 2a Região' },
      { link: 'https://api-publica.datajud.cnj.jus.br/api_publica_trf3/_search', nome: 'Tribunal Regional Federal da 3a Região' },
      { link: 'https://api-publica.datajud.cnj.jus.br/api_publica_trf4/_search', nome: 'Tribunal Regional Federal da 4a Região' },
      { link: 'https://api-publica.datajud.cnj.jus.br/api_publica_trf5/_search', nome: 'Tribunal Regional Federal da 5a Região' },
      { link: 'https://api-publica.datajud.cnj.jus.br/api_publica_trf6/_search', nome: 'Tribunal Regional Federal da 6a Região' }
    ],
   5 : [
        {link: 'https://api-publica.datajud.cnj.jus.br/api_publica_tst/_search', nome : 'Tribunal Superior do Trabalho'},
        {link: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt1/_search', nome : 'Tribunal Regional do Trabalho da 1 região'},
        {link: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt2/_search', nome : 'Tribunal Regional do Trabalho da 2 região'},
        {link: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt3/_search', nome : 'Tribunal Regional do Trabalho da 3 região'},
        {link: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt4/_search', nome : 'Tribunal Regional do Trabalho da 4 região'},
        {link: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt5/_search', nome : 'Tribunal Regional do Trabalho da 5 região'},
        {link: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt6/_search', nome : 'Tribunal Regional do Trabalho da 6 região'},
        {link: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt7/_search', nome : 'Tribunal Regional do Trabalho da 7 região'},
        {link: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt8/_search', nome : 'Tribunal Regional do Trabalho da 8 região'},
        {link: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt9/_search', nome : 'Tribunal Regional do Trabalho da 9 região'},
        {link: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt10/_search', nome : 'Tribunal Regional do Trabalho da 10 região'},
        {link: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt11/_search', nome : 'Tribunal Regional do Trabalho da 11 região'},
        {link: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt12/_search', nome : 'Tribunal Regional do Trabalho da 12 região'},
        {link: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt13/_search', nome : 'Tribunal Regional do Trabalho da 13 região'},
        {link: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt14/_search', nome : 'Tribunal Regional do Trabalho da 14 região'},
        {link: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt15/_search', nome : 'Tribunal Regional do Trabalho da 15 região'},
        {link: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt16/_search', nome : 'Tribunal Regional do Trabalho da 16 região'},
        {link: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt17/_search', nome : 'Tribunal Regional do Trabalho da 17 região'},
        {link: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt18/_search', nome : 'Tribunal Regional do Trabalho da 18 região'},
        {link: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt19/_search', nome : 'Tribunal Regional do Trabalho da 19 região'},
        {link: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt20/_search', nome : 'Tribunal Regional do Trabalho da 20 região'},
        {link: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt21/_search', nome : 'Tribunal Regional do Trabalho da 21 região'},
        {link: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt22/_search', nome : 'Tribunal Regional do Trabalho da 22 região'},
        {link: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt23/_search', nome : 'Tribunal Regional do Trabalho da 23 região'},
        {link: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt24/_search', nome : 'Tribunal Regional do Trabalho da 24 região'}
    ],
    6 : [
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tse/_search', nome : 'Tribunal Superior Eleitoral'},
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-ac/_search', nome : 'Tribunal Regional Eleitoral do Acre'},
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-al/_search', nome : 'Tribunal Regional Eleitoral de Alagoas'},
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-ap/_search', nome : 'Tribunal Regional Eleitoral do Amapá'},
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-am/_search', nome : 'Tribunal Regional Eleitoral de Amazonas'},
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-ba/_search', nome : 'Tribunal Regional Eleitoral da Bahia'},
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-ce/_search', nme: 'Tribunal Regional Eleitoral do Ceara'},
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-dft/_search', nome : 'Tribunal Regional Eleitoral do Distrito Federal'},
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-es/_search', nome : 'Tribunal Regional Eleitoral do Espirito Santo'},
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-go/_search', nome : 'Tribunal Regional Eleitoral de Goias'},
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-ma/_search', nome : 'Tribunal Regional Eleitoral do Maranhão'},
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-mt/_search', nome : 'Tribunal Regional Eleitoral do Mato Grosso'},
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-ms/_search', nome : 'Tribunal Regional Eleitoral do Mato Grosso do Sul'},
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-mg/_search', nome : 'Tribunal Regional Eleitoral de Minas Gerais'},
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-pa/_search', nome : 'Tribunal Regional Eleitoral do Pará'},
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-pb/_search', nome : 'Tribunal Regional Eleitoral da Paraíba'},
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-pr/_search', nome : 'Tribunal Regional Eleitoral do Paraná'},
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-pe/_search', nome : 'Tribunal Regional Eleitoral de Pernambuco'},
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-pi/_search', nome : 'Tribunal Regional Eleitoral do Piaui'},
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-rj/_search', nome : 'Tribunal Regional Eleitoral do Rio de Janeiro'},
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-rn/_search', nome : 'Tribunal Regional Eleitoral do Rio Grande do Norte'},
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-rs/_search', nome : 'Tribunal Regional Eleitoral do Rio Grande do Sul'},
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-ro/_search', nome : 'Tribunal Regional Eleitoral de Rondonia'},
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-rr/_search', nome : 'Tribunal Regional Eleitoral de Roraima'},
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-sc/_search', nome : 'Tribunal Regional Eleitoral de Santa Catarina'},
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-se/_search', nome : 'Tribunal Regional Eleitoral de Sergipe'},
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-sp/_search', nome : 'Tribunal Regional Eleitoral de São Paulo'},
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-to/_search', nome : 'Tribunal Regional Eleitoral de Tocantins'}
    ],
    7 : [
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_stm/_search', nome : 'Tribunal Superior Militar'},
        {link : '', nome : '1a Circunscrição Judiciária Militar'},
        {link : '', nome : '2a Circunscrição Judiciária Militar'},
        {link : '', nome : '3a Circunscrição Judiciária Militar'},
        {link : '', nome : '4a Circunscrição Judiciária Militar'},
        {link : '', nome : '5a Circunscrição Judiciária Militar'},
        {link : '', nome : '6a Circunscrição Judiciária Militar'},
        {link : '', nome : '7a Circunscrição Judiciária Militar'},
        {link : '', nome : '8a Circunscrição Judiciária Militar'},
        {link : '', nome : '9a Circunscrição Judiciária Militar'},
        {link : '', nome : '10a Circunscrição Judiciária Militar'},
        {link : '', nome : '11a Circunscrição Judiciária Militar'},
        {link : '', nome : '12a Circunscrição Judiciária Militar'},
    ],
    8 : [
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tjac/_search', nome : 'Tribunal de Justiça do Estado do Acre'},
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tjal/_search', nome : 'Tribunal de Justiça do Estado de Alagoas'},
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tjap/_search', nome : 'Tribunal de Justiça do Estado do Amapá'},
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tjam/_search', nome : 'Tribunal de Justiça do Estado de Amazonas'},
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tjba/_search', nome : 'Tribunal de Justiça do Estado da Bahia'},
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tjce/_search', nome : 'Tribunal de Justiça do Estado do Ceara'},
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tjdft/_search', nome : 'Tribunal de Justiça do Estado do Distrito }ederal'},
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tjes/_search', nome : 'Tribunal de Justiça do Estado do Espirito }anto'},
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tjgo/_search', nome : 'Tribunal de Justiça do Estado de Goias'},
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tjma/_search', nome : 'Tribunal de Justiça do Estado do Maranhão'},
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tjmt/_search', nome : 'Tribunal de Justiça do Estado do Mato Grosso'},
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tjms/_search', nome : 'Tribunal de Justiça do Estado do Mato Grosso do Sul'},
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tjmg/_search', nome : 'Tribunal de Justiça do Estado de Minas Gerais'},
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tjpa/_search', nome : 'Tribunal de Justiça do Estado do Pará'},
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tjpb/_search', nome : 'Tribunal de Justiça do Estado da Paraíba'},
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tjpr/_search', nome : 'Tribunal de Justiça do Estado do Paraná'},
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tjpe/_search', nome : 'Tribunal de Justiça do Estado de Pernambuco'},
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tjpi/_search', nome : 'Tribunal de Justiça do Estado do Piaui'},
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tjrj/_search', nome : 'Tribunal de Justiça do Estado do Rio De Janeiro'},
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tjrs/_search', nome : 'Tribunal de Justiça do Estado do Rio Grande do Sul'},
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tjrn/_search', nome : 'Tribunal de Justiça do Estado do Rio Grande do Norte'},
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tjro/_search', nome : 'Tribunal de Justiça do Estado de Rondonia'},
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tjrr/_search', nome : 'Tribunal de Justiça do Estado de Roraima'},
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tjsc/_search', nome : 'Tribunal de Justiça do Estado de Santa Catarina'},
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tjse/_search', nome : 'Tribunal de Justiça do Estado de Sergipe'},
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tjsp/_search', nome : 'Tribunal de Justiça do Estado de São Paulo'},
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tjto/_search', nome : 'Tribunal de Justiça do Estado de Tocantins'}
    ],
    9 : [
        {link : '', nome : ''},
        {link : '', nome : ''},
        {link : '', nome : ''},
        {link : '', nome : ''},
        {link : '', nome : ''},
        {link : '', nome : ''},
        {link : '', nome : ''},
        {link : '', nome : ''},
        {link : '', nome : ''},
        {link : '', nome : ''},
        {link : '', nome : ''},
        {link : '', nome : ''},
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tjmmg/_search', nome : 'Tribunal Regional Eleitoral de Minas Gerais'},
        {link : '', nome : ''},
        {link : '', nome : ''},
        {link : '', nome : ''},
        {link : '', nome : ''},
        {link : '', nome : ''},
        {link : '', nome : ''},
        {link : '', nome : ''},
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tjmrs/_search', nome : 'Tribunal Regional Eleitoral do Rio Grande do Sul'},
        {link : '', nome : ''},
        {link : '', nome : ''},
        {link : '', nome : ''},
        {link : '', nome : ''},
        {link : 'https://api-publica.datajud.cnj.jus.br/api_publica_tjmsp/_search', nome : 'Tribunal Regional Eleitoral de São Paulo'},
        {link : '', nome : ''}
    ],
  };

}
