// YouTube API service - Saari videos fetch karega

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

/**
 * Playlist se saari videos fetch karo with pagination
 */
export async function fetchPlaylistVideos(playlistId, maxResults = 50) {
  try {
    console.log('🔍 Fetching playlist:', playlistId);
    
    let allVideos = [];
    let nextPageToken = '';
    let pageCount = 0;
    
    // Jab tak next page hai, fetch karte raho
    do {
      pageCount++;
      console.log(`📄 Fetching page ${pageCount}...`);
      
      // API URL with pagination
      let url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=${maxResults}&playlistId=${playlistId}&key=${YOUTUBE_API_KEY}`;
      
      // Agar next page hai to token add karo
      if (nextPageToken) {
        url += `&pageToken=${nextPageToken}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (!data.items) {
        console.log('❌ No items found');
        break;
      }
      
      // Current page ke videos add karo
      const pageVideos = data.items.map(item => {
        const videoId = item.snippet.resourceId.videoId;
        const thumbnailUrl = item.snippet.thumbnails?.medium?.url || 
                            item.snippet.thumbnails?.high?.url || 
                            item.snippet.thumbnails?.default?.url;
        
        return {
          id: videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: thumbnailUrl,
          publishedAt: item.snippet.publishedAt,
          videoUrl: `https://www.youtube.com/watch?v=${videoId}`
        };
      });
      
      allVideos = [...allVideos, ...pageVideos];
      
      // Next page token save karo
      nextPageToken = data.nextPageToken;
      
      console.log(`✅ Page ${pageCount}: ${pageVideos.length} videos (Total: ${allVideos.length})`);
      
      // Rate limiting se bachne ke liye thoda wait karo
      if (nextPageToken) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
    } while (nextPageToken); // Jab tak token hai, loop chalta rahega
    
    console.log(`🎉 Total ${allVideos.length} videos fetched from ${pageCount} pages`);
    return allVideos;
    
  } catch (error) {
    console.error('❌ YouTube API Error:', error);
    return [];
  }
}

/**
 * Pehli video ka thumbnail fetch karo (for category cards)
 */
export async function getFirstVideoThumbnail(playlistId) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=1&playlistId=${playlistId}&key=${YOUTUBE_API_KEY}`
    );
    
    const data = await response.json();
    
    if (data.items && data.items[0]) {
      const item = data.items[0];
      return item.snippet.thumbnails?.medium?.url || 
             item.snippet.thumbnails?.high?.url || 
             item.snippet.thumbnails?.default?.url;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching first video thumbnail:', error);
    return null;
  }
}

/**
 * Playlist ka total view count fetch karo (approximate)
 */
export async function getPlaylistStats(playlistId) {
  try {
    // Pehle 50 videos ki IDs fetch karo
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${YOUTUBE_API_KEY}`
    );
    
    const data = await response.json();
    
    if (!data.items) return { videoCount: 0, totalViews: 0 };
    
    const videoIds = data.items.map(item => item.snippet.resourceId.videoId).join(',');
    
    // Videos ki statistics fetch karo
    const statsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`
    );
    
    const statsData = await statsResponse.json();
    
    let totalViews = 0;
    statsData.items?.forEach(video => {
      totalViews += parseInt(video.statistics.viewCount) || 0;
    });
    
    return {
      videoCount: data.pageInfo.totalResults || data.items.length,
      totalViews: formatNumber(totalViews)
    };
    
  } catch (error) {
    console.error('Error fetching playlist stats:', error);
    return { videoCount: 0, totalViews: 0 };
  }
}

/**
 * YouTube duration (PT1H30M45S) ko readable banayein
 */
function formatDuration(duration) {
  if (!duration) return '—';
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  const hours = (match[1] || '').replace('H', '');
  const minutes = (match[2] || '').replace('M', '');
  const seconds = (match[3] || '').replace('S', '');
  
  if (hours) {
    return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
  } else if (minutes) {
    return `${minutes}:${seconds.padStart(2, '0')}`;
  }
  return `0:${seconds.padStart(2, '0')}`;
}

/**
 * Numbers ko format karo (1000 → 1K, 1000000 → 1M)
 */
function formatNumber(num) {
  if (!num) return '—';
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}