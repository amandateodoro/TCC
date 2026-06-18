import { MigrationInterface, QueryRunner } from 'typeorm';

export class ExpandProfessionName1781755200000
  implements MigrationInterface
{
  name = 'ExpandProfessionName1781755200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const indexes = (await queryRunner.query(`
      SELECT \`INDEX_NAME\` AS \`indexName\`
      FROM \`INFORMATION_SCHEMA\`.\`STATISTICS\`
      WHERE \`TABLE_SCHEMA\` = DATABASE()
        AND \`TABLE_NAME\` = 'profissao'
        AND \`COLUMN_NAME\` = 'nome_profissao'
        AND \`NON_UNIQUE\` = 0
        AND \`INDEX_NAME\` <> 'PRIMARY'
    `)) as Array<{ indexName: string }>;

    for (const index of indexes) {
      await queryRunner.query(
        `DROP INDEX \`${index.indexName}\` ON \`profissao\``,
      );
    }

    await queryRunner.query(
      'ALTER TABLE `profissao` MODIFY `nome_profissao` varchar(255) NOT NULL',
    );
    await queryRunner.query(
      'CREATE INDEX `IDX_profissao_nome` ON `profissao` (`nome_profissao`)',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX `IDX_profissao_nome` ON `profissao`');
    await queryRunner.query(
      'ALTER TABLE `profissao` MODIFY `nome_profissao` varchar(80) NOT NULL',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `IDX_profissao_nome_unico` ON `profissao` (`nome_profissao`)',
    );
  }
}
