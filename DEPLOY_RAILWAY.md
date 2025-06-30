# 🚀 Guia de Deploy no Railway

## Pré-requisitos
- Conta no Railway (https://railway.app)
- Código no GitHub/GitLab
- Credenciais do banco PostgreSQL AWS

## Passo 1: Preparar o Repositório Git

### 1.1 Enviar código para Git
```bash
# Se ainda não tem repositório
git init
git add .
git commit -m "Sistema de login PostgreSQL pronto para Railway"

# Conectar ao GitHub/GitLab
git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git
git push -u origin main
```

## Passo 2: Criar Projeto no Railway

### 2.1 Acessar Railway
1. Vá para https://railway.app
2. Faça login com GitHub/Discord
3. Clique em "New Project"

### 2.2 Conectar Repositório
1. Selecione "Deploy from GitHub repo"
2. Autorize acesso ao seu repositório
3. Selecione o repositório com o código

## Passo 3: Configurar Variáveis de Ambiente

### 3.1 Variáveis Obrigatórias
No Railway, vá em Settings > Variables e adicione:

```
PGUSER=postgres
PGPASSWORD=sua_senha_do_banco
NODE_ENV=production
```

### 3.2 Variáveis Opcionais
```
SESSION_SECRET=uma_chave_secreta_qualquer
```

## Passo 4: Verificar Configuração

### 4.1 Arquivos de Deploy (já configurados)
- ✅ `railway.toml` - Configuração Railway
- ✅ `package.json` - Scripts de build/start
- ✅ `/health` - Endpoint de healthcheck

### 4.2 Configuração Atual
```toml
[build]
builder = "NIXPACKS"
buildCommand = "npm run build"

[deploy]
startCommand = "npm start"
healthcheckPath = "/health"
healthcheckTimeout = 120
healthcheckInterval = 10
```

## Passo 5: Deploy Automático

### 5.1 Primeiro Deploy
1. Railway detectará o `railway.toml`
2. Executará `npm run build`
3. Iniciará com `npm start`
4. Testará `/health` endpoint

### 5.2 Acompanhar Deploy
1. Na aba "Deployments" do Railway
2. Veja logs em tempo real
3. Aguarde status "Success"

## Passo 6: Verificar Funcionamento

### 6.1 Acessar Aplicação
1. Railway fornecerá URL público
2. Formato: `https://seu-projeto.railway.app`

### 6.2 Testar Login
1. Acesse a URL
2. Tente fazer login com:
   - Usuário: `1`
   - Senha: `1`

## Passo 7: Troubleshooting

### 7.1 Se Healthcheck Falhar
```bash
# Testar endpoint localmente
curl https://seu-projeto.railway.app/health
```

### 7.2 Logs de Debug
- Verifique logs no Railway
- Endpoint `/health/detailed` para diagnóstico completo

## Resumo da Configuração

### ✅ O que está PRONTO:
- Servidor Express rodando corretamente
- Healthcheck endpoints (`/health` e `/health/detailed`)
- Configuração SSL para produção
- Porta dinâmica para Railway
- Scripts de build/start
- Conexão com PostgreSQL AWS

### 🔧 O que VOCÊ precisa fazer:
1. Enviar código para Git
2. Criar projeto no Railway
3. Configurar variáveis `PGUSER` e `PGPASSWORD`
4. Aguardar deploy automático

---

**Importante:** Use as credenciais corretas do banco PostgreSQL AWS:
- Host: `controlehoras-db.c8pqeqc0u2u5.us-east-1.rds.amazonaws.com`
- Banco: `controlehoras`
- Tabela: `consultants`