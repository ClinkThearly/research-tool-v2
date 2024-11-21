'use server'

import { revalidatePath } from 'next/cache'
import { deleteArticle } from '@/lib/db'

export async function deleteArticleAction(id: number) {
  await deleteArticle(id)
  revalidatePath('/aggregate')
}