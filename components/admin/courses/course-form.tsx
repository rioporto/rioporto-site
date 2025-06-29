'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { 
  Save, 
  X, 
  Plus,
  Loader2,
  Image as ImageIcon,
  Link2,
  BookOpen
} from 'lucide-react'

interface CourseFormProps {
  courseId?: string
}

interface WhatYouLearnItem {
  id: string
  text: string
}

export function CourseForm({ courseId }: CourseFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    short_description: '',
    thumbnail_url: '',
    price: 0,
    is_free: true,
    is_featured: false,
    is_published: false,
    duration_minutes: 60,
    level: 'beginner',
    meta_title: '',
    meta_description: '',
    meta_keywords: ''
  })

  const [whatYouLearn, setWhatYouLearn] = useState<WhatYouLearnItem[]>([
    { id: '1', text: '' }
  ])

  const [requirements, setRequirements] = useState<WhatYouLearnItem[]>([
    { id: '1', text: '' }
  ])

  const [targetAudience, setTargetAudience] = useState<WhatYouLearnItem[]>([
    { id: '1', text: '' }
  ])

  useEffect(() => {
    if (courseId) {
      loadCourse()
    }
  }, [courseId])

  const loadCourse = async () => {
    if (!courseId) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single()

      if (error) throw error

      if (data) {
        setFormData({
          title: data.title || '',
          slug: data.slug || '',
          description: data.description || '',
          short_description: data.short_description || '',
          thumbnail_url: data.thumbnail_url || '',
          price: data.price || 0,
          is_free: data.is_free || false,
          is_featured: data.is_featured || false,
          is_published: data.is_published || false,
          duration_minutes: data.duration_minutes || 60,
          level: data.level || 'beginner',
          meta_title: data.meta_title || '',
          meta_description: data.meta_description || '',
          meta_keywords: data.meta_keywords || ''
        })

        // Carregar arrays
        if (data.what_you_learn && Array.isArray(data.what_you_learn)) {
          setWhatYouLearn(data.what_you_learn.map((text: string, index: number) => ({
            id: String(index + 1),
            text
          })))
        }

        if (data.requirements && Array.isArray(data.requirements)) {
          setRequirements(data.requirements.map((text: string, index: number) => ({
            id: String(index + 1),
            text
          })))
        }

        if (data.target_audience && Array.isArray(data.target_audience)) {
          setTargetAudience(data.target_audience.map((text: string, index: number) => ({
            id: String(index + 1),
            text
          })))
        }
      }
    } catch (error) {
      console.error('Erro ao carregar curso:', error)
      toast.error('Erro ao carregar dados do curso')
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Auto-generate slug from title
    if (name === 'title' && !courseId) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(value)
      }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }))

    // Se marcar como grátis, zerar o preço
    if (name === 'is_free' && checked) {
      setFormData(prev => ({
        ...prev,
        price: 0
      }))
    }
  }

  const addListItem = (listSetter: React.Dispatch<React.SetStateAction<WhatYouLearnItem[]>>) => {
    listSetter(prev => [...prev, { id: String(Date.now()), text: '' }])
  }

  const updateListItem = (
    listSetter: React.Dispatch<React.SetStateAction<WhatYouLearnItem[]>>,
    id: string,
    text: string
  ) => {
    listSetter(prev => prev.map(item => 
      item.id === id ? { ...item, text } : item
    ))
  }

  const removeListItem = (
    listSetter: React.Dispatch<React.SetStateAction<WhatYouLearnItem[]>>,
    id: string
  ) => {
    listSetter(prev => prev.filter(item => item.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.slug) {
      toast.error('Título e slug são obrigatórios')
      return
    }

    setSubmitting(true)

    try {
      // Preparar dados para salvar
      const courseData = {
        ...formData,
        what_you_learn: whatYouLearn.filter(item => item.text).map(item => item.text),
        requirements: requirements.filter(item => item.text).map(item => item.text),
        target_audience: targetAudience.filter(item => item.text).map(item => item.text),
        price: formData.is_free ? 0 : Number(formData.price),
        duration_minutes: Number(formData.duration_minutes)
      }

      if (courseId) {
        // Atualizar curso existente
        const { error } = await supabase
          .from('courses')
          .update(courseData)
          .eq('id', courseId)

        if (error) throw error

        toast.success('Curso atualizado com sucesso!')
      } else {
        // Criar novo curso
        const { data: { user } } = await supabase.auth.getUser()
        
        const { error } = await supabase
          .from('courses')
          .insert({
            ...courseData,
            created_by: user?.id
          })

        if (error) throw error

        toast.success('Curso criado com sucesso!')
      }

      router.push('/admin/courses')
    } catch (error: any) {
      console.error('Erro ao salvar curso:', error)
      if (error.code === '23505') {
        toast.error('Já existe um curso com este slug')
      } else {
        toast.error('Erro ao salvar curso')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
          <CardDescription>
            Defina o título, descrição e configurações principais do curso
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Título do Curso *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Ex: Bitcoin para Iniciantes"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL do Curso (slug) *</Label>
              <Input
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                placeholder="bitcoin-para-iniciantes"
                required
              />
              <p className="text-xs text-muted-foreground">
                URL: /courses/{formData.slug || 'seu-curso'}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="short_description">Descrição Curta</Label>
            <Input
              id="short_description"
              name="short_description"
              value={formData.short_description}
              onChange={handleInputChange}
              placeholder="Uma breve descrição do curso (aparece nos cards)"
              maxLength={160}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição Completa</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Descrição detalhada do curso..."
              rows={6}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="level">Nível</Label>
              <Select
                value={formData.level}
                onValueChange={(value) => handleSelectChange('level', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Iniciante</SelectItem>
                  <SelectItem value="intermediate">Intermediário</SelectItem>
                  <SelectItem value="advanced">Avançado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration_minutes">Duração (minutos)</Label>
              <Input
                id="duration_minutes"
                name="duration_minutes"
                type="number"
                value={formData.duration_minutes}
                onChange={handleInputChange}
                placeholder="60"
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnail_url">URL da Thumbnail</Label>
              <div className="relative">
                <Input
                  id="thumbnail_url"
                  name="thumbnail_url"
                  value={formData.thumbnail_url}
                  onChange={handleInputChange}
                  placeholder="https://..."
                  className="pl-10"
                />
                <ImageIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preço e Configurações */}
      <Card>
        <CardHeader>
          <CardTitle>Preço e Configurações</CardTitle>
          <CardDescription>
            Configure o preço e as opções de visibilidade do curso
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-2">
            <Switch
              id="is_free"
              checked={formData.is_free}
              onCheckedChange={(checked) => handleSwitchChange('is_free', checked)}
            />
            <Label htmlFor="is_free">Curso Gratuito</Label>
          </div>

          {!formData.is_free && (
            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="97.00"
                min="0"
                step="0.01"
              />
            </div>
          )}

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => handleSwitchChange('is_featured', checked)}
              />
              <Label htmlFor="is_featured">Curso em Destaque</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_published"
                checked={formData.is_published}
                onCheckedChange={(checked) => handleSwitchChange('is_published', checked)}
              />
              <Label htmlFor="is_published">Publicar Curso</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* O que você vai aprender */}
      <Card>
        <CardHeader>
          <CardTitle>O que você vai aprender</CardTitle>
          <CardDescription>
            Liste os principais aprendizados do curso
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {whatYouLearn.map((item, index) => (
            <div key={item.id} className="flex gap-2">
              <Input
                value={item.text}
                onChange={(e) => updateListItem(setWhatYouLearn, item.id, e.target.value)}
                placeholder={`Item ${index + 1}`}
              />
              {whatYouLearn.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeListItem(setWhatYouLearn, item.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addListItem(setWhatYouLearn)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Item
          </Button>
        </CardContent>
      </Card>

      {/* Pré-requisitos */}
      <Card>
        <CardHeader>
          <CardTitle>Pré-requisitos</CardTitle>
          <CardDescription>
            O que o aluno precisa saber antes de começar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {requirements.map((item, index) => (
            <div key={item.id} className="flex gap-2">
              <Input
                value={item.text}
                onChange={(e) => updateListItem(setRequirements, item.id, e.target.value)}
                placeholder={`Pré-requisito ${index + 1}`}
              />
              {requirements.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeListItem(setRequirements, item.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addListItem(setRequirements)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Pré-requisito
          </Button>
        </CardContent>
      </Card>

      {/* SEO */}
      <Card>
        <CardHeader>
          <CardTitle>SEO</CardTitle>
          <CardDescription>
            Otimize o curso para mecanismos de busca
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="meta_title">Meta Título</Label>
            <Input
              id="meta_title"
              name="meta_title"
              value={formData.meta_title}
              onChange={handleInputChange}
              placeholder={formData.title || 'Título para SEO'}
              maxLength={60}
            />
            <p className="text-xs text-muted-foreground">
              {formData.meta_title.length}/60 caracteres
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="meta_description">Meta Descrição</Label>
            <Textarea
              id="meta_description"
              name="meta_description"
              value={formData.meta_description}
              onChange={handleInputChange}
              placeholder={formData.description || 'Descrição para SEO'}
              rows={3}
              maxLength={160}
            />
            <p className="text-xs text-muted-foreground">
              {formData.meta_description.length}/160 caracteres
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="meta_keywords">Palavras-chave</Label>
            <Input
              id="meta_keywords"
              name="meta_keywords"
              value={formData.meta_keywords}
              onChange={handleInputChange}
              placeholder="bitcoin, criptomoedas, blockchain, curso"
            />
            <p className="text-xs text-muted-foreground">
              Separe as palavras-chave por vírgula
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {courseId ? 'Salvar Alterações' : 'Criar Curso'}
            </>
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/courses')}
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}