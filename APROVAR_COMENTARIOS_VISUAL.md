# 📝 COMO APROVAR COMENTÁRIOS NO SUPABASE

## Método Visual (Table Editor) - MAIS FÁCIL!

1. **Acesse o Supabase Dashboard**
   - https://supabase.com/dashboard

2. **Vá para Table Editor**
   - Menu lateral > Table Editor

3. **Selecione a tabela `comments`**
   - Lista de tabelas > comments

4. **Encontre comentários pendentes**
   - Procure por `approved = false`
   - Ou use o filtro: approved → equals → false

5. **Aprove o comentário**
   - Clique na célula `approved`
   - Mude de `false` para `true`
   - Clique fora para salvar

6. **Pronto!** ✅
   - O comentário aparecerá no blog

## Método SQL (Alternativo)

```sql
-- 1. Ver comentários pendentes
SELECT 
    id,
    content,
    created_at,
    (SELECT name FROM profiles WHERE id = user_id) as autor
FROM comments 
WHERE approved = false
ORDER BY created_at DESC;

-- 2. Copie o ID (clique direito > Copy cell content)

-- 3. Aprove
UPDATE comments SET approved = true WHERE id = 'COLE_O_ID_AQUI';
```

## 💡 Dicas

- **Aprovar vários de uma vez**: Selecione múltiplas linhas e edite
- **Filtrar por data**: Use o filtro no Table Editor
- **Ver autor**: A coluna `user_id` mostra quem comentou

---

**Prefira o Table Editor - é visual e mais fácil!** 👍
