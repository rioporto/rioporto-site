'use client'

import { CourseForm } from '@/components/admin/courses/course-form'

export default function NewCoursePage() {
  return (
    <div className="container py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Criar Novo Curso</h1>
        <p className="text-muted-foreground">
          Preencha as informações para criar um novo curso
        </p>
      </div>
      
      <CourseForm />
    </div>
  )
}