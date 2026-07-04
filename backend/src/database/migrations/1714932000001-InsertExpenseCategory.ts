import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertExpenseCategory1714932000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT IGNORE INTO \`categoria_despesa\` (\`nome_categoria\`)
      VALUES ('Outro')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM \`categoria_despesa\`
      WHERE \`nome_categoria\` = 'Outro'
        AND \`id_categoria_despesa\` NOT IN (
          SELECT DISTINCT \`fk_id_categoria_despesa\`
          FROM \`despesa\`
          WHERE \`fk_id_categoria_despesa\` IS NOT NULL
        )
    `);
  }
}
