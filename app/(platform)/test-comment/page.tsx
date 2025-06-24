"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/auth-context"

export default function TestCommentPage() {
  const { user, profile } = useAuth()
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testDirectInsert = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const supabase = createClient()
      
      // Pegar o primeiro post
      const { data: posts } = await supabase
        .from('blog_posts')
        .select('id')
        .limit(1)
      
      if (!posts || posts.length === 0) {
        throw new Error('Nenhum post encontrado')
      }

      const postId = posts[0].id

      // Tentar inserir comentário diretamente
      const { data, error: insertError } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          user_id: user?.id,
          content: 'Teste direto via Supabase - ' + new Date().toISOString(),
          approved: false
        })
        .select('*')
        .single()

      if (insertError) {
        throw insertError
      }

      setResult(data)
    } catch (err: any) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const checkPermissions = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const supabase = createClient()
      
      // Verificar se pode ler comentários
      const { data: readTest, error: readError } = await supabase
        .from('comments')
        .select('*')
        .limit(1)
      
      // Verificar perfil
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single()

      setResult({
        canRead: !readError,
        readError: readError?.message,
        profile: profileData,
        userId: user?.id,
        hasName: !!profileData?.name
      })
    } catch (err: any) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-2xl font-bold mb-6">Teste de Comentários</h1>

      {/* Status do Usuário */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Status do Usuário</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-sm bg-muted p-4 rounded">
            {JSON.stringify({
              user: user ? { id: user.id, email: user.email } : null,
              profile: profile ? { id: profile.id, name: profile.name } : null
            }, null, 2)}
          </pre>
        </CardContent>
      </Card>

      {/* Ações */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Testes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={checkPermissions}
            disabled={loading}
          >
            Verificar Permissões
          </Button>
          
          <Button 
            onClick={testDirectInsert}
            disabled={loading || !user}
            variant="secondary"
          >
            Testar Inserção Direta
          </Button>
        </CardContent>
      </Card>

      {/* Resultado */}
      {result && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Resultado</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm bg-muted p-4 rounded overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Erro */}
      {error && (
        <Card className="border-red-500">
          <CardHeader>
            <CardTitle className="text-red-500">Erro</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm bg-muted p-4 rounded overflow-auto text-red-500">
              {JSON.stringify({
                message: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint
              }, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
