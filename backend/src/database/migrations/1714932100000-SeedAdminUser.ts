import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedAdminUser1714932100000 implements MigrationInterface {
  name = 'SeedAdminUser1714932100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO \`usuario\`
        (\`nome_completo\`, \`nome_de_usuario\`, \`senha\`, \`email\`, \`nivel_acesso\`, \`telefone\`)
      SELECT
        'Administrador',
        'admin',
        '$2b$10$C/CAjG81jw.qWi8zBv5QbewEworGnv1hz/4gIHpvcpToUXKNs2u.e',
        'admin@tcc.local',
        'Administrador',
        NULL
      WHERE NOT EXISTS (
        SELECT 1 FROM \`usuario\` WHERE \`nome_de_usuario\` = 'admin'
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DELETE FROM `usuario` WHERE `nome_de_usuario` = 'admin'");
  }
}
