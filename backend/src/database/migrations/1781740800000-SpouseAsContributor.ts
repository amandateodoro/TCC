import { MigrationInterface, QueryRunner } from 'typeorm';

type LegacyContributor = {
  id_contribuinte: number;
  endereco: string | null;
  nome_conjuge: string;
  telefone_conjuge: string | null;
  data_nascimento_conjuge: string | null;
  fk_id_usuario: number | null;
};

export class SpouseAsContributor1781740800000 implements MigrationInterface {
  name = 'SpouseAsContributor1781740800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `contribuinte` ADD `fk_id_conjuge` int NULL',
    );

    const contributors = await queryRunner.query(`
      SELECT
        \`id_contribuinte\`,
        \`endereco\`,
        \`nome_conjuge\`,
        \`telefone_conjuge\`,
        \`data_nascimento_conjuge\`,
        \`fk_id_usuario\`
      FROM \`contribuinte\`
      WHERE \`casado\` = 1
        AND \`nome_conjuge\` IS NOT NULL
        AND TRIM(\`nome_conjuge\`) <> ''
    `) as LegacyContributor[];

    for (const contributor of contributors) {
      const result = await queryRunner.query(
        `
          INSERT INTO \`contribuinte\` (
            \`nome_completo\`,
            \`endereco\`,
            \`telefone\`,
            \`data_de_nascimento\`,
            \`casado\`,
            \`fk_id_profissao_contribuinte\`,
            \`fk_id_usuario\`,
            \`fk_id_conjuge\`
          ) VALUES (?, ?, ?, ?, 1, NULL, ?, ?)
        `,
        [
          contributor.nome_conjuge,
          contributor.endereco,
          contributor.telefone_conjuge,
          contributor.data_nascimento_conjuge,
          contributor.fk_id_usuario,
          contributor.id_contribuinte,
        ],
      );

      await queryRunner.query(
        'UPDATE `contribuinte` SET `fk_id_conjuge` = ? WHERE `id_contribuinte` = ?',
        [result.insertId, contributor.id_contribuinte],
      );
    }

    await queryRunner.query(
      'CREATE UNIQUE INDEX `IDX_contribuinte_conjuge` ON `contribuinte` (`fk_id_conjuge`)',
    );
    await queryRunner.query(`
      ALTER TABLE \`contribuinte\`
      ADD CONSTRAINT \`FK_contribuinte_conjuge\`
      FOREIGN KEY (\`fk_id_conjuge\`)
      REFERENCES \`contribuinte\`(\`id_contribuinte\`)
      ON DELETE SET NULL ON UPDATE CASCADE
    `);
    await queryRunner.query(
      'ALTER TABLE `contribuinte` DROP COLUMN `nome_conjuge`',
    );
    await queryRunner.query(
      'ALTER TABLE `contribuinte` DROP COLUMN `telefone_conjuge`',
    );
    await queryRunner.query(
      'ALTER TABLE `contribuinte` DROP COLUMN `data_nascimento_conjuge`',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `contribuinte` ADD `nome_conjuge` varchar(120) NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `contribuinte` ADD `telefone_conjuge` varchar(20) NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `contribuinte` ADD `data_nascimento_conjuge` date NULL',
    );
    await queryRunner.query(`
      UPDATE \`contribuinte\` AS contribuinte
      LEFT JOIN \`contribuinte\` AS conjuge
        ON conjuge.\`id_contribuinte\` = contribuinte.\`fk_id_conjuge\`
      SET
        contribuinte.\`nome_conjuge\` = conjuge.\`nome_completo\`,
        contribuinte.\`telefone_conjuge\` = conjuge.\`telefone\`,
        contribuinte.\`data_nascimento_conjuge\` = conjuge.\`data_de_nascimento\`
    `);
    await queryRunner.query(
      'ALTER TABLE `contribuinte` DROP FOREIGN KEY `FK_contribuinte_conjuge`',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_contribuinte_conjuge` ON `contribuinte`',
    );
    await queryRunner.query(
      'ALTER TABLE `contribuinte` DROP COLUMN `fk_id_conjuge`',
    );
  }
}
