import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCboCodeToProfession1781748000000
  implements MigrationInterface
{
  name = 'AddCboCodeToProfession1781748000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `profissao` ADD `codigo_cbo` varchar(10) NULL',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `IDX_profissao_codigo_cbo` ON `profissao` (`codigo_cbo`)',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX `IDX_profissao_codigo_cbo` ON `profissao`',
    );
    await queryRunner.query(
      'ALTER TABLE `profissao` DROP COLUMN `codigo_cbo`',
    );
  }
}
