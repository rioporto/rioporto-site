"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, User, Mail, Phone, Save, AlertCircle, CheckCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

export default function PerfilFixedPage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [formData, setFormData] = useState({ name: "", phone: "" })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    setLoading(true)
    try {
      console.log("Perfil: Checking auth...")
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      if (!currentUser) {
        console.log("Perfil: No user, redirecting to login")
        router.push("/login")
        return
      }
      setUser(currentUser)
      console.log("Perfil: User found:", currentUser.email)
      // Buscar profile
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle()
      if (error) {
        console.log("Perfil: Error loading profile", error)
      }
      setProfile(profileData)
      setFormData({
        name: profileData?.name || "",
        phone: profileData?.phone || ""
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess(false)
    if (!formData.name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, preencha seu nome.",
        variant: "destructive"
      })
      return
    }
    setSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name.trim(),
          phone: formData.phone.trim()
        })
        .eq('id', user.id)
      if (error) throw error
      setSuccess(true)
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso."
      })
      // Atualizar profile local
      setProfile((prev: any) => ({ ...prev, name: formData.name.trim(), phone: formData.phone.trim() }))
    } catch (error) {
      console.error("Perfil: Erro ao atualizar perfil:", error)
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível atualizar seu perfil. Tente novamente.",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">Carregando...</div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container max-w-2xl py-8">
      {/* Header simples */}
      <div className="mb-6 flex items-center justify-between border-b pb-4">
        <h1 className="text-2xl font-bold">Perfil</h1>
        <Button asChild variant="outline">
          <Link href="/">Home</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Meu Perfil</CardTitle>
          <CardDescription>
            Gerencie suas informações pessoais
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Alerta para usuários sem nome */}
          {!profile?.name && (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Atenção:</strong> Você precisa adicionar um nome ao seu perfil para poder comentar nos artigos do blog.
              </AlertDescription>
            </Alert>
          )}
          {/* Alerta de sucesso */}
          {success && (
            <Alert className="mb-6 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                Perfil atualizado com sucesso!
              </AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email (somente leitura) */}
            <div className="space-y-2">
              <Label htmlFor="email">
                <Mail className="h-4 w-4 inline mr-2" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={user.email || ""}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                O email não pode ser alterado
              </p>
            </div>
            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="name">
                <User className="h-4 w-4 inline mr-2" />
                Nome Completo *
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Digite seu nome completo"
                required
              />
              <p className="text-xs text-muted-foreground">
                Necessário para comentar nos artigos
              </p>
            </div>
            {/* Telefone */}
            <div className="space-y-2">
              <Label htmlFor="phone">
                <Phone className="h-4 w-4 inline mr-2" />
                Telefone
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(11) 98765-4321"
              />
              <p className="text-xs text-muted-foreground">
                Opcional - usado apenas para contato sobre transações
              </p>
            </div>
            {/* Informações da conta */}
            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium mb-3">Informações da Conta</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <strong>ID:</strong> {user.id}
                </p>
                <p>
                  <strong>Nível KYC:</strong> {profile?.level || "1"}
                </p>
                <p>
                  <strong>Status KYC:</strong>{" "}
                  <span className={
                    profile?.kyc_status === "approved" 
                      ? "text-green-600 dark:text-green-400" 
                      : profile?.kyc_status === "rejected"
                      ? "text-red-600 dark:text-red-400"
                      : "text-yellow-600 dark:text-yellow-400"
                  }>
                    {profile?.kyc_status === "approved" 
                      ? "Aprovado"
                      : profile?.kyc_status === "rejected"
                      ? "Rejeitado"
                      : "Pendente"}
                  </span>
                </p>
                <p>
                  <strong>Membro desde:</strong>{" "}
                  {new Date(profile?.created_at || "").toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>
            {/* Botão de salvar */}
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      {/* Card de segurança */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Segurança</CardTitle>
          <CardDescription>
            Gerencie as configurações de segurança da sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Alterar Senha</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Para alterar sua senha, utilize a opção de recuperação de senha.
              </p>
              <Button variant="outline" size="sm" asChild>
                <a href="/recuperar-senha">Alterar Senha</a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 