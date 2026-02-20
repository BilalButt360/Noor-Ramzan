import { NextResponse } from 'next/server'
import { fetchPlaylistVideos } from '@/app/lib/youtubeService';
import { scholars } from '@/app/data/scholars';

// API Cache - memory mein cache karo (FREE)
const cache = new Map();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const scholarId = searchParams.get('scholarId')
  const categoryId = searchParams.get('categoryId')

  if (!scholarId || !categoryId) {
    return NextResponse.json(
      { error: 'Missing parameters' },
      { status: 400 }
    )
  }

  // Cache key banao
  const cacheKey = `${scholarId}-${categoryId}`;
  const cached = cache.get(cacheKey);
  
  // Agar cache mein hai aur fresh hai to return karo
  if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
    console.log('✅ Serving from cache:', cacheKey);
    return NextResponse.json(cached.data);
  }

  try {
    // Scholar aur category find karo
    const scholar = scholars.find(s => s.id === scholarId);
    if (!scholar) throw new Error('Scholar not found');
    
    const category = scholar.categories.find(c => c.id === categoryId);
    if (!category) throw new Error('Category not found');

    // YouTube se videos fetch karo
    console.log('🔄 Fetching from YouTube API:', category.playlistId);
    const videos = await fetchPlaylistVideos(category.playlistId);

    // Response prepare karo
    const response = {
      success: true,
      scholar: {
        id: scholar.id,
        name: scholar.name
      },
      category: {
        id: category.id,
        name: category.name,
        description: category.description
      },
      videos,
      total: videos.length,
      timestamp: new Date().toISOString()
    };

    // Cache mein store karo
    cache.set(cacheKey, {
      data: response,
      timestamp: Date.now()
    });

    return NextResponse.json(response);

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}