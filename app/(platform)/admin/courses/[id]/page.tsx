'use client'

import { CourseForm } from '@/components/admin/courses/course-form'

export default function EditCoursePage({ params }: { params: { id: string } }) {
  return (
    <div className="container py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Editar Curso</h1>
        <p className="text-muted-foreground">
          Atualize as informações do curso
        </p>
      </div>
      
      <CourseForm courseId={params.id} />
    </div>
  )
}