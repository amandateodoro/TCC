import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCoreRelationships1781744400000
  implements MigrationInterface
{
  name = 'UpdateCoreRelationships1781744400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.dropForeignKeyForColumn(
      queryRunner,
      'contribuinte',
      'fk_id_profissao_contribuinte',
    );
    await this.dropForeignKeyForColumn(
      queryRunner,
      'contribuinte',
      'fk_id_usuario',
    );

    await queryRunner.query(
      'RENAME TABLE `profissao_contribuinte` TO `profissao`',
    );
    await queryRunner.query(`
      ALTER TABLE \`profissao\`
      CHANGE \`id_profissao_contribuinte\` \`id_profissao\` int NOT NULL AUTO_INCREMENT
    `);

    await queryRunner.query(`
      CREATE TABLE \`profissao_contribuinte\` (
        \`fk_id_profissao\` int NOT NULL,
        \`fk_id_contribuinte\` int NOT NULL,
        INDEX \`IDX_profissao_contribuinte_profissao\` (\`fk_id_profissao\`),
        INDEX \`IDX_profissao_contribuinte_contribuinte\` (\`fk_id_contribuinte\`),
        PRIMARY KEY (\`fk_id_profissao\`, \`fk_id_contribuinte\`)
      ) ENGINE=InnoDB
    `);
    await queryRunner.query(`
      INSERT INTO \`profissao_contribuinte\`
        (\`fk_id_profissao\`, \`fk_id_contribuinte\`)
      SELECT
        \`fk_id_profissao_contribuinte\`,
        \`id_contribuinte\`
      FROM \`contribuinte\`
      WHERE \`fk_id_profissao_contribuinte\` IS NOT NULL
    `);
    await queryRunner.query(`
      ALTER TABLE \`profissao_contribuinte\`
      ADD CONSTRAINT \`FK_profissao_contribuinte_profissao\`
      FOREIGN KEY (\`fk_id_profissao\`)
      REFERENCES \`profissao\`(\`id_profissao\`)
      ON DELETE CASCADE ON UPDATE CASCADE
    `);
    await queryRunner.query(`
      ALTER TABLE \`profissao_contribuinte\`
      ADD CONSTRAINT \`FK_profissao_contribuinte_contribuinte\`
      FOREIGN KEY (\`fk_id_contribuinte\`)
      REFERENCES \`contribuinte\`(\`id_contribuinte\`)
      ON DELETE CASCADE ON UPDATE CASCADE
    `);
    await queryRunner.query(
      'ALTER TABLE `contribuinte` DROP COLUMN `fk_id_profissao_contribuinte`',
    );
    await queryRunner.query(
      'ALTER TABLE `contribuinte` DROP COLUMN `fk_id_usuario`',
    );

    await queryRunner.query(
      'ALTER TABLE `contribuicao` ADD `fk_id_contribuinte` int NULL',
    );
    await queryRunner.query(`
      UPDATE \`contribuicao\` AS contribuicao
      INNER JOIN (
        SELECT
          \`fk_id_contribuicao\`,
          MIN(\`fk_id_contribuinte\`) AS \`fk_id_contribuinte\`
        FROM \`contribuinte_contribuicao\`
        GROUP BY \`fk_id_contribuicao\`
      ) AS relacao
        ON relacao.\`fk_id_contribuicao\` = contribuicao.\`id_contribuicao\`
      SET contribuicao.\`fk_id_contribuinte\` = relacao.\`fk_id_contribuinte\`
    `);
    await this.dropForeignKeyForColumn(
      queryRunner,
      'contribuinte_contribuicao',
      'fk_id_contribuinte',
    );
    await this.dropForeignKeyForColumn(
      queryRunner,
      'contribuinte_contribuicao',
      'fk_id_contribuicao',
    );
    await queryRunner.query('DROP TABLE `contribuinte_contribuicao`');
    await queryRunner.query(
      'CREATE INDEX `IDX_contribuicao_contribuinte` ON `contribuicao` (`fk_id_contribuinte`)',
    );
    await queryRunner.query(`
      ALTER TABLE \`contribuicao\`
      ADD CONSTRAINT \`FK_contribuicao_contribuinte\`
      FOREIGN KEY (\`fk_id_contribuinte\`)
      REFERENCES \`contribuinte\`(\`id_contribuinte\`)
      ON DELETE RESTRICT ON UPDATE CASCADE
    `);

    await queryRunner.query(
      'ALTER TABLE `despesa` ADD `fk_id_usuario` int NULL',
    );
    await queryRunner.query(`
      UPDATE \`despesa\` AS despesa
      INNER JOIN (
        SELECT
          \`fk_id_despesa\`,
          MIN(\`fk_id_usuario\`) AS \`fk_id_usuario\`
        FROM \`usuario_despesa\`
        GROUP BY \`fk_id_despesa\`
      ) AS relacao
        ON relacao.\`fk_id_despesa\` = despesa.\`id_despesa\`
      SET despesa.\`fk_id_usuario\` = relacao.\`fk_id_usuario\`
    `);
    await queryRunner.query(
      'UPDATE `despesa` SET `fk_id_usuario` = (SELECT MIN(`id_usuario`) FROM `usuario`) WHERE `fk_id_usuario` IS NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `despesa` MODIFY `fk_id_usuario` int NOT NULL',
    );
    await this.dropForeignKeyForColumn(
      queryRunner,
      'usuario_despesa',
      'fk_id_usuario',
    );
    await this.dropForeignKeyForColumn(
      queryRunner,
      'usuario_despesa',
      'fk_id_despesa',
    );
    await queryRunner.query('DROP TABLE `usuario_despesa`');
    await queryRunner.query(
      'CREATE INDEX `IDX_despesa_usuario` ON `despesa` (`fk_id_usuario`)',
    );
    await queryRunner.query(`
      ALTER TABLE \`despesa\`
      ADD CONSTRAINT \`FK_despesa_usuario\`
      FOREIGN KEY (\`fk_id_usuario\`)
      REFERENCES \`usuario\`(\`id_usuario\`)
      ON DELETE RESTRICT ON UPDATE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `despesa` DROP FOREIGN KEY `FK_despesa_usuario`',
    );
    await queryRunner.query('DROP INDEX `IDX_despesa_usuario` ON `despesa`');
    await queryRunner.query(`
      CREATE TABLE \`usuario_despesa\` (
        \`fk_id_despesa\` int NOT NULL,
        \`fk_id_usuario\` int NOT NULL,
        INDEX \`IDX_usuario_despesa_despesa\` (\`fk_id_despesa\`),
        INDEX \`IDX_usuario_despesa_usuario\` (\`fk_id_usuario\`),
        PRIMARY KEY (\`fk_id_despesa\`, \`fk_id_usuario\`)
      ) ENGINE=InnoDB
    `);
    await queryRunner.query(`
      INSERT INTO \`usuario_despesa\` (\`fk_id_despesa\`, \`fk_id_usuario\`)
      SELECT \`id_despesa\`, \`fk_id_usuario\` FROM \`despesa\`
    `);
    await queryRunner.query(`
      ALTER TABLE \`usuario_despesa\`
      ADD CONSTRAINT \`FK_usuario_despesa_despesa\`
      FOREIGN KEY (\`fk_id_despesa\`)
      REFERENCES \`despesa\`(\`id_despesa\`)
      ON DELETE CASCADE ON UPDATE CASCADE
    `);
    await queryRunner.query(`
      ALTER TABLE \`usuario_despesa\`
      ADD CONSTRAINT \`FK_usuario_despesa_usuario\`
      FOREIGN KEY (\`fk_id_usuario\`)
      REFERENCES \`usuario\`(\`id_usuario\`)
      ON DELETE CASCADE ON UPDATE CASCADE
    `);
    await queryRunner.query(
      'ALTER TABLE `despesa` DROP COLUMN `fk_id_usuario`',
    );

    await queryRunner.query(
      'ALTER TABLE `contribuicao` DROP FOREIGN KEY `FK_contribuicao_contribuinte`',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_contribuicao_contribuinte` ON `contribuicao`',
    );
    await queryRunner.query(`
      CREATE TABLE \`contribuinte_contribuicao\` (
        \`fk_id_contribuicao\` int NOT NULL,
        \`fk_id_contribuinte\` int NOT NULL,
        INDEX \`IDX_contribuinte_contribuicao_contribuicao\` (\`fk_id_contribuicao\`),
        INDEX \`IDX_contribuinte_contribuicao_contribuinte\` (\`fk_id_contribuinte\`),
        PRIMARY KEY (\`fk_id_contribuicao\`, \`fk_id_contribuinte\`)
      ) ENGINE=InnoDB
    `);
    await queryRunner.query(`
      INSERT INTO \`contribuinte_contribuicao\`
        (\`fk_id_contribuicao\`, \`fk_id_contribuinte\`)
      SELECT \`id_contribuicao\`, \`fk_id_contribuinte\`
      FROM \`contribuicao\`
      WHERE \`fk_id_contribuinte\` IS NOT NULL
    `);
    await queryRunner.query(`
      ALTER TABLE \`contribuinte_contribuicao\`
      ADD CONSTRAINT \`FK_contribuinte_contribuicao_contribuicao\`
      FOREIGN KEY (\`fk_id_contribuicao\`)
      REFERENCES \`contribuicao\`(\`id_contribuicao\`)
      ON DELETE CASCADE ON UPDATE CASCADE
    `);
    await queryRunner.query(`
      ALTER TABLE \`contribuinte_contribuicao\`
      ADD CONSTRAINT \`FK_contribuinte_contribuicao_contribuinte\`
      FOREIGN KEY (\`fk_id_contribuinte\`)
      REFERENCES \`contribuinte\`(\`id_contribuinte\`)
      ON DELETE CASCADE ON UPDATE CASCADE
    `);
    await queryRunner.query(
      'ALTER TABLE `contribuicao` DROP COLUMN `fk_id_contribuinte`',
    );

    await queryRunner.query(
      'ALTER TABLE `profissao_contribuinte` DROP FOREIGN KEY `FK_profissao_contribuinte_contribuinte`',
    );
    await queryRunner.query(
      'ALTER TABLE `profissao_contribuinte` DROP FOREIGN KEY `FK_profissao_contribuinte_profissao`',
    );
    await queryRunner.query(
      'ALTER TABLE `contribuinte` ADD `fk_id_profissao_contribuinte` int NULL',
    );
    await queryRunner.query(`
      UPDATE \`contribuinte\` AS contribuinte
      INNER JOIN (
        SELECT
          \`fk_id_contribuinte\`,
          MIN(\`fk_id_profissao\`) AS \`fk_id_profissao\`
        FROM \`profissao_contribuinte\`
        GROUP BY \`fk_id_contribuinte\`
      ) AS relacao
        ON relacao.\`fk_id_contribuinte\` = contribuinte.\`id_contribuinte\`
      SET contribuinte.\`fk_id_profissao_contribuinte\` = relacao.\`fk_id_profissao\`
    `);
    await queryRunner.query('DROP TABLE `profissao_contribuinte`');
    await queryRunner.query(`
      ALTER TABLE \`profissao\`
      CHANGE \`id_profissao\` \`id_profissao_contribuinte\` int NOT NULL AUTO_INCREMENT
    `);
    await queryRunner.query(
      'RENAME TABLE `profissao` TO `profissao_contribuinte`',
    );
    await queryRunner.query(
      'ALTER TABLE `contribuinte` ADD `fk_id_usuario` int NULL',
    );
    await queryRunner.query(`
      ALTER TABLE \`contribuinte\`
      ADD CONSTRAINT \`FK_contribuinte_profissao\`
      FOREIGN KEY (\`fk_id_profissao_contribuinte\`)
      REFERENCES \`profissao_contribuinte\`(\`id_profissao_contribuinte\`)
      ON DELETE SET NULL ON UPDATE CASCADE
    `);
    await queryRunner.query(`
      ALTER TABLE \`contribuinte\`
      ADD CONSTRAINT \`FK_contribuinte_usuario\`
      FOREIGN KEY (\`fk_id_usuario\`)
      REFERENCES \`usuario\`(\`id_usuario\`)
      ON DELETE SET NULL ON UPDATE CASCADE
    `);
  }

  private async dropForeignKeyForColumn(
    queryRunner: QueryRunner,
    table: string,
    column: string,
  ) {
    const constraints = (await queryRunner.query(
      `
        SELECT \`CONSTRAINT_NAME\` AS \`constraintName\`
        FROM \`INFORMATION_SCHEMA\`.\`KEY_COLUMN_USAGE\`
        WHERE \`TABLE_SCHEMA\` = DATABASE()
          AND \`TABLE_NAME\` = ?
          AND \`COLUMN_NAME\` = ?
          AND \`REFERENCED_TABLE_NAME\` IS NOT NULL
      `,
      [table, column],
    )) as Array<{ constraintName: string }>;

    for (const constraint of constraints) {
      await queryRunner.query(
        `ALTER TABLE \`${table}\` DROP FOREIGN KEY \`${constraint.constraintName}\``,
      );
    }
  }
}
