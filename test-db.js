import pkg from 'pg';
const { Pool } = pkg;

async function testConnection() {
  try {
    console.log('Testando conexão com AWS RDS...');
    
    const pool = new Pool({
      connectionString: `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@controlehoras-db.c8pqeqc0u2u5.us-east-1.rds.amazonaws.com:5432/controlehoras-db?sslmode=require`
    });

    const client = await pool.connect();
    console.log('✅ Conexão estabelecida com sucesso!');
    
    // Teste a tabela consultants
    const result = await client.query('SELECT name, password FROM consultants LIMIT 10');
    console.log('\n📋 Dados da tabela consultants:');
    console.log('Total de registros:', result.rowCount);
    
    if (result.rows.length > 0) {
      console.log('\n👥 Usuários encontrados:');
      result.rows.forEach((row, index) => {
        console.log(`${index + 1}. Nome: ${row.name}, Senha: ${row.password.substring(0, 10)}...`);
      });
    } else {
      console.log('⚠️  Nenhum usuário encontrado na tabela.');
    }
    
    client.release();
    await pool.end();
    
  } catch (error) {
    console.error('❌ Erro na conexão:', error.message);
    if (error.code) {
      console.error('Código do erro:', error.code);
    }
  }
}

testConnection();