import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedExpenseCategories1781838000000
  implements MigrationInterface
{
  name = 'SeedExpenseCategories1781838000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT IGNORE INTO \`categoria_despesa\` (\`nome_categoria\`)
      VALUES
        ('Água e Energia'),
        ('Limpeza e Higiene'),
        ('Material de Escritório'),
        ('Manutenção'),
        ('Alimentação')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM \`categoria_despesa\`
      WHERE \`nome_categoria\` IN (
        'Água e Energia',
        'Limpeza e Higiene',
        'Material de Escritório',
        'Manutenção',
        'Alimentação'
      )
      AND NOT EXISTS (
        SELECT 1
        FROM \`despesa\`
        WHERE \`despesa\`.\`fk_id_categoria_despesa\` =
          \`categoria_despesa\`.\`id_categoria_despesa\`
      )
    `);
  }
}
