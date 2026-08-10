import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { aiRecommendationEngine } from '@/lib/ai/recommendation-engine'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const recommendations = await aiRecommendationEngine.generateRecommendations(user.id)
    
    return NextResponse.json(recommendations)
    
  } catch (error) {
    console.error('AI Recommendations API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
