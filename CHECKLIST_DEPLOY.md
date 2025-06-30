# ✅ Checklist Deploy Railway

## 1. Preparar Git (5 min)
- [ ] Código no GitHub/GitLab
- [ ] Repositório público ou privado autorizado

## 2. Railway - Criar Projeto (2 min)
- [ ] Acessar https://railway.app
- [ ] Login com GitHub
- [ ] "New Project" → "Deploy from GitHub repo"
- [ ] Selecionar repositório

## 3. Configurar Variáveis (3 min)
**Settings > Variables:**
- [ ] `PGUSER` = `postgres`
- [ ] `PGPASSWORD` = `[sua senha AWS]`
- [ ] `NODE_ENV` = `production`

## 4. Aguardar Deploy (5-10 min)
- [ ] Railway fará build automático
- [ ] Verificar logs na aba "Deployments"
- [ ] Status deve ficar "Success"

## 5. Testar (2 min)
- [ ] Acessar URL fornecida pelo Railway
- [ ] Fazer login: usuário `1`, senha `1`
- [ ] Verificar se redireciona para "Boas Vindas"

---

## ⚠️ Se der erro "Healthcheck failed":
1. Verifique se as variáveis `PGUSER` e `PGPASSWORD` estão corretas
2. Teste endpoint: `https://sua-url.railway.app/health`
3. Veja logs detalhados no Railway

## 📋 Informações do Banco:
- **Host**: `controlehoras-db.c8pqeqc0u2u5.us-east-1.rds.amazonaws.com`
- **Banco**: `controlehoras`
- **Usuário teste**: `1` / `1`