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

### Opção 1: Desabilitar healthcheck temporariamente
No Railway, vá em Settings e adicione:
```
RAILWAY_HEALTHCHECK_TIMEOUT_SEC=0
```

### Opção 2: Alterar configuração Railway
Edite o `railway.toml` e mude:
```toml
healthcheckPath = "/"
```

### Opção 3: Verificar logs
1. Veja logs no Railway em "Deployments"
2. Procure por mensagens como "Server running on port..."
3. Teste manualmente: `https://sua-url.railway.app/ping`

### Opção 4: Usar ROOT path
No railway.toml, mude para:
```toml
healthcheckPath = "/"
healthcheckTimeout = 600
```

## 📋 Informações do Banco:
- **Host**: `controlehoras-db.c8pqeqc0u2u5.us-east-1.rds.amazonaws.com`
- **Banco**: `controlehoras`
- **Usuário teste**: `1` / `1`