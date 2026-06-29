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
        UNIQUE INDEX \`IDX_fd8d246bb703b653b7714bbb02\` (\`nome_de_usuario\`),
        UNIQUE INDEX \`IDX_2863682842e688ca198eb25c12\` (\`email\`),
        PRIMARY KEY (\`id_usuario\`)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`profissao\` (
        \`id_profissao\` int NOT NULL AUTO_INCREMENT,
        \`nome_profissao\` varchar(255) NOT NULL,
        \`codigo_cbo\` varchar(10) NOT NULL,
        UNIQUE INDEX \`IDX_d12076e68c3bedc97b50bb05ad\` (\`codigo_cbo\`),
        INDEX \`IDX_profissao_nome\` (\`nome_profissao\`),
        PRIMARY KEY (\`id_profissao\`)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`categoria_despesa\` (
        \`id_categoria_despesa\` int NOT NULL AUTO_INCREMENT,
        \`nome_categoria\` varchar(80) NOT NULL,
        UNIQUE INDEX \`IDX_cc2c324cb73631f6d5add7feb6\` (\`nome_categoria\`),
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
        \`fk_id_conjuge\` int NULL,
        UNIQUE INDEX \`REL_5f1e099807c87db6f159fdd281\` (\`fk_id_conjuge\`),
        PRIMARY KEY (\`id_contribuinte\`)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`profissao_contribuinte\` (
        \`fk_id_profissao\` int NOT NULL,
        \`fk_id_contribuinte\` int NOT NULL,
        INDEX \`IDX_ff22b7a6db84d4b84001fff0a8\` (\`fk_id_profissao\`),
        INDEX \`IDX_f8b33f0fd48f46d0c0e2d516e2\` (\`fk_id_contribuinte\`),
        PRIMARY KEY (\`fk_id_profissao\`, \`fk_id_contribuinte\`)
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
        \`fk_id_contribuinte\` int NOT NULL,
        PRIMARY KEY (\`id_contribuicao\`)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`despesa\` (
        \`id_despesa\` int NOT NULL AUTO_INCREMENT,
        \`valor_despesa\` decimal(10,2) NOT NULL,
        \`data_despesa\` date NOT NULL,
        \`descricao_despesa\` varchar(255) NULL,
        \`fk_id_categoria_despesa\` int NULL,
        \`fk_id_usuario\` int NOT NULL,
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
        PRIMARY KEY (\`id_oferta\`)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      ALTER TABLE \`contribuinte\`
      ADD CONSTRAINT \`FK_5f1e099807c87db6f159fdd2813\`
      FOREIGN KEY (\`fk_id_conjuge\`)
      REFERENCES \`contribuinte\`(\`id_contribuinte\`)
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE \`profissao_contribuinte\`
      ADD CONSTRAINT \`FK_ff22b7a6db84d4b84001fff0a8c\`
      FOREIGN KEY (\`fk_id_profissao\`)
      REFERENCES \`profissao\`(\`id_profissao\`)
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE \`profissao_contribuinte\`
      ADD CONSTRAINT \`FK_f8b33f0fd48f46d0c0e2d516e27\`
      FOREIGN KEY (\`fk_id_contribuinte\`)
      REFERENCES \`contribuinte\`(\`id_contribuinte\`)
      ON DELETE CASCADE ON UPDATE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE \`contribuicao\`
      ADD CONSTRAINT \`FK_5533e42fbbf6b8ec9fc165b2b61\`
      FOREIGN KEY (\`fk_id_usuario\`)
      REFERENCES \`usuario\`(\`id_usuario\`)
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE \`contribuicao\`
      ADD CONSTRAINT \`FK_f05449b864ac5b5d949a3741e26\`
      FOREIGN KEY (\`fk_id_contribuinte\`)
      REFERENCES \`contribuinte\`(\`id_contribuinte\`)
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE \`despesa\`
      ADD CONSTRAINT \`FK_dde956e044c198aaed1b1835fe7\`
      FOREIGN KEY (\`fk_id_categoria_despesa\`)
      REFERENCES \`categoria_despesa\`(\`id_categoria_despesa\`)
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE \`despesa\`
      ADD CONSTRAINT \`FK_2548de4d73e1bb0236c13f9f4c6\`
      FOREIGN KEY (\`fk_id_usuario\`)
      REFERENCES \`usuario\`(\`id_usuario\`)
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE \`oferta\`
      ADD CONSTRAINT \`FK_e27835f11efb9a2ed517b46fc7f\`
      FOREIGN KEY (\`fk_id_usuario\`)
      REFERENCES \`usuario\`(\`id_usuario\`)
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      INSERT INTO \`usuario\`
        (\`nome_completo\`, \`nome_de_usuario\`, \`senha\`, \`email\`, \`nivel_acesso\`, \`telefone\`)
      VALUES
        (
          'Administrador',
          'admin',
          '$2b$10$C/CAjG81jw.qWi8zBv5QbewEworGnv1hz/4gIHpvcpToUXKNs2u.e',
          'admin@tcc.local',
          'Administrador',
          NULL
        )
    `);

    await queryRunner.query(`
      INSERT INTO \`categoria_despesa\` (\`nome_categoria\`)
      VALUES
        ('Água e Energia'),
        ('Limpeza e Higiene'),
        ('Material de Escritório'),
        ('Manutenção'),
        ('Alimentação')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `oferta` DROP FOREIGN KEY `FK_e27835f11efb9a2ed517b46fc7f`');
    await queryRunner.query('ALTER TABLE `despesa` DROP FOREIGN KEY `FK_2548de4d73e1bb0236c13f9f4c6`');
    await queryRunner.query('ALTER TABLE `despesa` DROP FOREIGN KEY `FK_dde956e044c198aaed1b1835fe7`');
    await queryRunner.query('ALTER TABLE `contribuicao` DROP FOREIGN KEY `FK_f05449b864ac5b5d949a3741e26`');
    await queryRunner.query('ALTER TABLE `contribuicao` DROP FOREIGN KEY `FK_5533e42fbbf6b8ec9fc165b2b61`');
    await queryRunner.query(
      'ALTER TABLE `profissao_contribuinte` DROP FOREIGN KEY `FK_f8b33f0fd48f46d0c0e2d516e27`',
    );
    await queryRunner.query(
      'ALTER TABLE `profissao_contribuinte` DROP FOREIGN KEY `FK_ff22b7a6db84d4b84001fff0a8c`',
    );
    await queryRunner.query('ALTER TABLE `contribuinte` DROP FOREIGN KEY `FK_5f1e099807c87db6f159fdd2813`');
    await queryRunner.query('DROP TABLE `oferta`');
    await queryRunner.query('DROP TABLE `despesa`');
    await queryRunner.query('DROP TABLE `contribuicao`');
    await queryRunner.query('DROP TABLE `profissao_contribuinte`');
    await queryRunner.query('DROP TABLE `contribuinte`');
    await queryRunner.query('DROP TABLE `categoria_despesa`');
    await queryRunner.query('DROP TABLE `profissao`');
    await queryRunner.query('DROP TABLE `usuario`');
  }
}
