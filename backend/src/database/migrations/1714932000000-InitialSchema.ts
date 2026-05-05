import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1714932000000 implements MigrationInterface {
  name = 'InitialSchema1714932000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasTable('usuario')) {
      return;
    }

    await queryRunner.query(`
      CREATE TABLE \`usuario\` (
        \`id_usuario\` int NOT NULL AUTO_INCREMENT,
        \`nome_completo\` varchar(120) NOT NULL,
        \`nome_de_usuario\` varchar(60) NOT NULL,
        \`senha\` varchar(120) NOT NULL,
        \`email\` varchar(120) NOT NULL,
        \`nivel_acesso\` enum ('Administrador', 'Secretaria') NOT NULL DEFAULT 'Secretaria',
        \`telefone\` varchar(20) NULL,
        UNIQUE INDEX \`IDX_usuario_nome_de_usuario\` (\`nome_de_usuario\`),
        UNIQUE INDEX \`IDX_usuario_email\` (\`email\`),
        PRIMARY KEY (\`id_usuario\`)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`profissao_contribuinte\` (
        \`id_profissao_contribuinte\` int NOT NULL AUTO_INCREMENT,
        \`nome_profissao\` varchar(80) NOT NULL,
        UNIQUE INDEX \`IDX_profissao_nome\` (\`nome_profissao\`),
        PRIMARY KEY (\`id_profissao_contribuinte\`)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`categoria_despesa\` (
        \`id_categoria_despesa\` int NOT NULL AUTO_INCREMENT,
        \`nome_categoria\` varchar(80) NOT NULL,
        UNIQUE INDEX \`IDX_categoria_despesa_nome\` (\`nome_categoria\`),
        PRIMARY KEY (\`id_categoria_despesa\`)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`contribuinte\` (
        \`id_contribuinte\` int NOT NULL AUTO_INCREMENT,
        \`nome_completo\` varchar(120) NOT NULL,
        \`endereco\` varchar(180) NULL,
        \`telefone\` varchar(20) NULL,
        \`data_de_nascimento\` date NULL,
        \`casado\` tinyint NOT NULL DEFAULT 0,
        \`nome_conjuge\` varchar(120) NULL,
        \`telefone_conjuge\` varchar(20) NULL,
        \`data_nascimento_conjuge\` date NULL,
        \`fk_id_profissao_contribuinte\` int NULL,
        \`fk_id_usuario\` int NULL,
        INDEX \`IDX_contribuinte_profissao\` (\`fk_id_profissao_contribuinte\`),
        INDEX \`IDX_contribuinte_usuario\` (\`fk_id_usuario\`),
        PRIMARY KEY (\`id_contribuinte\`)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`contribuicao\` (
        \`id_contribuicao\` int NOT NULL AUTO_INCREMENT,
        \`tipo_contribuicao\` varchar(60) NOT NULL,
        \`valor_contribuicao\` decimal(10,2) NOT NULL,
        \`forma_de_pagamento\` varchar(45) NOT NULL,
        \`data_de_pagamento\` date NOT NULL,
        \`observacao\` varchar(255) NULL,
        \`fk_id_usuario\` int NULL,
        INDEX \`IDX_contribuicao_usuario\` (\`fk_id_usuario\`),
        PRIMARY KEY (\`id_contribuicao\`)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`despesa\` (
        \`id_despesa\` int NOT NULL AUTO_INCREMENT,
        \`valor_despesa\` decimal(10,2) NOT NULL,
        \`data_despesa\` date NOT NULL,
        \`descricao_despesa\` varchar(255) NULL,
        \`fk_id_categoria_despesa\` int NOT NULL,
        INDEX \`IDX_despesa_categoria\` (\`fk_id_categoria_despesa\`),
        PRIMARY KEY (\`id_despesa\`)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`oferta\` (
        \`id_oferta\` int NOT NULL AUTO_INCREMENT,
        \`tipo_celebracao\` varchar(80) NOT NULL,
        \`valor_total\` decimal(10,2) NOT NULL,
        \`data_oferta\` date NOT NULL,
        \`observacao\` varchar(255) NULL,
        \`fk_id_usuario\` int NULL,
        INDEX \`IDX_oferta_usuario\` (\`fk_id_usuario\`),
        PRIMARY KEY (\`id_oferta\`)
      ) ENGINE=InnoDB
    `);

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
      CREATE TABLE \`usuario_despesa\` (
        \`fk_id_despesa\` int NOT NULL,
        \`fk_id_usuario\` int NOT NULL,
        INDEX \`IDX_usuario_despesa_despesa\` (\`fk_id_despesa\`),
        INDEX \`IDX_usuario_despesa_usuario\` (\`fk_id_usuario\`),
        PRIMARY KEY (\`fk_id_despesa\`, \`fk_id_usuario\`)
      ) ENGINE=InnoDB
    `);

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

    await queryRunner.query(`
      ALTER TABLE \`contribuicao\`
      ADD CONSTRAINT \`FK_contribuicao_usuario\`
      FOREIGN KEY (\`fk_id_usuario\`)
      REFERENCES \`usuario\`(\`id_usuario\`)
      ON DELETE SET NULL ON UPDATE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE \`despesa\`
      ADD CONSTRAINT \`FK_despesa_categoria\`
      FOREIGN KEY (\`fk_id_categoria_despesa\`)
      REFERENCES \`categoria_despesa\`(\`id_categoria_despesa\`)
      ON DELETE RESTRICT ON UPDATE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE \`oferta\`
      ADD CONSTRAINT \`FK_oferta_usuario\`
      FOREIGN KEY (\`fk_id_usuario\`)
      REFERENCES \`usuario\`(\`id_usuario\`)
      ON DELETE SET NULL ON UPDATE CASCADE
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `usuario_despesa` DROP FOREIGN KEY `FK_usuario_despesa_usuario`');
    await queryRunner.query('ALTER TABLE `usuario_despesa` DROP FOREIGN KEY `FK_usuario_despesa_despesa`');
    await queryRunner.query(
      'ALTER TABLE `contribuinte_contribuicao` DROP FOREIGN KEY `FK_contribuinte_contribuicao_contribuinte`',
    );
    await queryRunner.query(
      'ALTER TABLE `contribuinte_contribuicao` DROP FOREIGN KEY `FK_contribuinte_contribuicao_contribuicao`',
    );
    await queryRunner.query('ALTER TABLE `oferta` DROP FOREIGN KEY `FK_oferta_usuario`');
    await queryRunner.query('ALTER TABLE `despesa` DROP FOREIGN KEY `FK_despesa_categoria`');
    await queryRunner.query('ALTER TABLE `contribuicao` DROP FOREIGN KEY `FK_contribuicao_usuario`');
    await queryRunner.query('ALTER TABLE `contribuinte` DROP FOREIGN KEY `FK_contribuinte_usuario`');
    await queryRunner.query('ALTER TABLE `contribuinte` DROP FOREIGN KEY `FK_contribuinte_profissao`');
    await queryRunner.query('DROP TABLE `usuario_despesa`');
    await queryRunner.query('DROP TABLE `contribuinte_contribuicao`');
    await queryRunner.query('DROP TABLE `oferta`');
    await queryRunner.query('DROP TABLE `despesa`');
    await queryRunner.query('DROP TABLE `contribuicao`');
    await queryRunner.query('DROP TABLE `contribuinte`');
    await queryRunner.query('DROP TABLE `categoria_despesa`');
    await queryRunner.query('DROP TABLE `profissao_contribuinte`');
    await queryRunner.query('DROP TABLE `usuario`');
  }
}
