'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { MessageSquarePlus } from 'lucide-react';
import { CommentForm } from './comment-form';
import { CommentList } from './comment-list';
import { useAuth } from '@/contexts/auth-context';

interface CommentSectionProps {
  postSlug: string;
}

export function CommentSection({ postSlug }: CommentSectionProps) {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCommentSuccess = () => {
    setShowForm(false);
    // Forçar atualização da lista
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Card className="mt-12">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Comentários</CardTitle>
          {!showForm && (
            <Button
              onClick={() => setShowForm(true)}
              size="sm"
            >
              <MessageSquarePlus className="mr-2 h-4 w-4" />
              Novo comentário
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Formulário de novo comentário */}
        {showForm && (
          <>
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-4">
                {user ? `Comentando como ${user.email}` : 'Adicionar comentário'}
              </h4>
              <CommentForm
                postSlug={postSlug}
                onSuccess={handleCommentSuccess}
                onCancel={() => setShowForm(false)}
              />
            </div>
            <Separator />
          </>
        )}

        {/* Lista de comentários */}
        <CommentList 
          key={refreshKey}
          postSlug={postSlug} 
          onCommentUpdate={handleCommentSuccess}
        />
      </CardContent>
    </Card>
  );
}