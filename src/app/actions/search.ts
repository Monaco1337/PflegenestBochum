'use server'
import { globalSearch, type SearchHit } from '@/core/search'

export async function searchAction(term: string): Promise<SearchHit[]> {
  return globalSearch(term, 20)
}
