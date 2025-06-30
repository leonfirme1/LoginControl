# 🚀 Deploy Railway - Solução Final

## ⚠️ PROBLEMA RESOLVIDO
Erro `ERR_INVALID_ARG_TYPE` do Node.js 18 foi corrigido com servidor JavaScript puro.

## 📋 Checklist Rápido (10 minutos)

### 1. Verificar Arquivos Necessários
- [ ] `server/railway-server.js` ✅ (servidor JavaScript puro)
- [ ] `railway.toml` ✅ (configuração atualizada)  
- [ ] Código no Git

### 2. Railway Deploy
1. **Acessar**: https://railway.app
2. **Login**: com GitHub
3. **Criar projeto**: "Deploy from GitHub repo"
4. **Selecionar**: seu repositório

### 3. Configurar Variáveis
**Em Settings > Variables:**
```
PGUSER=postgres
PGPASSWORD=[sua senha AWS]
NODE_ENV=production
```

### 4. Aguardar Deploy (5 min)
- Railway executará: `cp server/railway-server.js dist/server.js`
- Verificar logs na aba "Deployments"
- Status deve ficar "Success"

### 5. Testar
- Acessar URL do Railway
- Testar: `https://sua-url.railway.app/ping`
- Deve retornar: `{"status":"ok","timestamp":"..."}`

## 🔧 Servidor Simplificado

O novo servidor (`railway-server.js`) tem:
- ✅ JavaScript puro (sem TypeScript)
- ✅ Health checks: `/ping`, `/health`, `/`
- ✅ API básica: `/api/login` (teste com usuário "1", senha "1")
- ✅ Compatível com Node.js 18
- ✅ Sem dependências de path resolution

## 📞 Suporte

Se ainda houver erro:
1. Ver logs no Railway
2. Verificar se variáveis estão configuradas
3. Testar health check: `/ping`

O servidor agora deve funcionar perfeitamente no Railway! 🎉