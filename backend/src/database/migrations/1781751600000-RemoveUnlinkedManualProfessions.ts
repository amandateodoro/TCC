import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveUnlinkedManualProfessions1781751600000
  implements MigrationInterface
{
  name = 'RemoveUnlinkedManualProfessions1781751600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE profissao
      FROM \`profissao\`
      LEFT JOIN \`profissao_contribuinte\`
        ON \`profissao_contribuinte\`.\`fk_id_profissao\` = \`profissao\`.\`id_profissao\`
      WHERE \`profissao\`.\`codigo_cbo\` IS NULL
        AND \`profissao_contribuinte\`.\`fk_id_profissao\` IS NULL
    `);
  }

  public async down(): Promise<void> {
    // Registros manuais removidos nao podem ser reconstruidos com seguranca.
  }
}
