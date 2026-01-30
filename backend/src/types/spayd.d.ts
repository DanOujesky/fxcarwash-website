declare module "spayd" {
  export default class Spayd {
    constructor(accountNumber: string, bankCode: string);

    amount(value: number): this;
    currency(value: string): this;
    variableSymbol(value: string): this;
    message(value: string): this;

    generate(): string;
  }
}
