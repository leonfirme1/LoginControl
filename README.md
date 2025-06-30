# Controle de Horas - Sistema de Login

Sistema simples de controle de horas com autenticação PostgreSQL, pronto para deploy no Railway.

## 🚀 Deploy no Railway

### Pré-requisitos
1. Conta no [Railway](https://railway.app)
2. Banco PostgreSQL AWS RDS configurado
3. Credenciais do banco de dados

### Passos para Deploy

1. **Conecte o repositório ao Railway**
   - Acesse [Railway](https://railway.app)
   - Clique em "New Project"
   - Conecte seu repositório GitHub

2. **Configure as variáveis de ambiente**
   No painel do Railway, adicione as seguintes variáveis:
   ```
   PGUSER=seu_usuario_do_banco
   PGPASSWORD=sua_senha_do_banco
   NODE_ENV=production
   ```

3. **Deploy automático**
   - O Railway detectará automaticamente o arquivo `railway.toml`
   - O deploy será iniciado automaticamente
   - Aguarde a conclusão do build

### Configuração do Banco de Dados

O sistema está configurado para conectar com:
- **Host**: `controlehoras-db.c8pqeqc0u2u5.us-east-1.rds.amazonaws.com`
- **Porta**: `5432`
- **Banco**: `controlehoras-db`
- **Tabela**: `consultants`

#### Estrutura da Tabela
```sql
CREATE TABLE consultants (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);
```

## 🔧 Desenvolvimento Local

1. **Instale as dependências**
   ```bash
   npm install
   ```

2. **Configure as variáveis de ambiente**
   - Copie `.env.example` para `.env`
   - Preencha com suas credenciais

3. **Execute o projeto**
   ```bash
   npm run dev
   ```

## 📋 Funcionalidades

- ✅ Login com usuário e senha
- ✅ Cadastro de novos usuários
- ✅ Autenticação segura com sessões
- ✅ Interface responsiva em português
- ✅ Dashboard básico pós-login
- ✅ Suporte a senhas existentes em texto plano

## 🔒 Segurança

- Senhas são criptografadas com `scrypt`
- Sessões seguras com PostgreSQL
- Compatibilidade com senhas existentes em texto plano
- Configuração SSL para produção

## 📞 Suporte

Para dúvidas ou problemas, verifique:
1. Se as credenciais do banco estão corretas
2. Se o banco está acessível
3. Se todas as variáveis de ambiente estão configuradas
4. Logs do Railway para detalhes de erro