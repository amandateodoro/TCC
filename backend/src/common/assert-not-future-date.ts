import { BadRequestException } from '@nestjs/common';

const todayIsoDate = () => new Date().toISOString().slice(0, 10);

export const assertNotFutureDate = (date: string | undefined, fieldLabel: string) => {
  if (date && date > todayIsoDate()) {
    throw new BadRequestException(`${fieldLabel} nao pode ser uma data futura.`);
  }
};
