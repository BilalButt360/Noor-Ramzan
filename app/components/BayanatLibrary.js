'use client'

import { useState, useEffect } from 'react'
import { scholars } from '../data/scholars'
import { motion } from 'framer-motion'
import Loader from './Loader'
import { getFirstVideoThumbnail, getPlaylistStats } from '../lib/youtubeService'

export default function BayanatLibrary() {
  const [selectedScholar, setSelectedScholar] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [playlistThumbnails, setPlaylistThumbnails] = useState({})
  const [playlistStats, setPlaylistStats] = useState({})

  // Category select karne par videos fetch karo
  useEffect(() => {
    if (selectedScholar && selectedCategory) {
      fetchVideos(selectedScholar.id, selectedCategory.id);
    }
  }, [selectedScholar, selectedCategory]);

  // Categories ke liye thumbnails aur stats fetch karo
  useEffect(() => {
    if (selectedScholar && !selectedCategory) {
      const fetchAllCategoriesData = async () => {
        for (const category of selectedScholar.categories) {
          // Pehle check karo ke already fetch hai ya nahi
          if (!playlistThumbnails[category.id]) {
            const thumbnail = await getFirstVideoThumbnail(category.playlistId);
            setPlaylistThumbnails(prev => ({
              ...prev,
              [category.id]: thumbnail
            }));
          }
          
          if (!playlistStats[category.id]) {
            const stats = await getPlaylistStats(category.playlistId);
            setPlaylistStats(prev => ({
              ...prev,
              [category.id]: stats
            }));
          }
        }
      };
      
      fetchAllCategoriesData();
    }
  }, [selectedScholar, selectedCategory]);

  const fetchVideos = async (scholarId, categoryId) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/bayanat?scholarId=${scholarId}&categoryId=${categoryId}`);
      const data = await response.json();
      if (data.success) {
        setVideos(data.videos);
      }
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter scholars
  const filteredScholars = scholars.filter(scholar =>
    scholar.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format date to relative time (e.g., "2 weeks ago")
  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString('en-PK');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl p-10 md:p-14 bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-900 text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Bayanat Library
        </h1>
        <p className="text-white/80 text-lg max-w-2xl">
          Listen to lectures by renowned Islamic Scholars
        </p>
        
        {!selectedScholar && (
          <div className="mt-6 max-w-md">
            <input
              type="text"
              placeholder="🔍 Search Scholar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3 rounded-xl bg-white/20 backdrop-blur border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
        )}
      </section>

      {/* Back Buttons */}
      {selectedCategory && (
        <button
          onClick={() => {
            setSelectedCategory(null);
            setVideos([]);
          }}
          className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
        >
          ← Back to {selectedScholar?.name}'s Categories
        </button>
      )}

      {selectedScholar && !selectedCategory && (
        <button
          onClick={() => {
            setSelectedScholar(null);
            setVideos([]);
          }}
          className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
        >
          ← Back to Scholars
        </button>
      )}

      {/* Level 1: Scholars Grid */}
      {!selectedScholar && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredScholars.map((scholar) => (
            <motion.div
              key={scholar.id}
              whileHover={{ y: -5 }}
              onClick={() => setSelectedScholar(scholar)}
              className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all cursor-pointer"
            >
              {/* Scholar Image with Fallback */}
              <div className="h-48 bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center">
                {scholar.image ? (
                  <img
                    src={scholar.image}
                    alt={scholar.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(scholar.name)}&background=10b981&color=fff&size=128`;
                    }}
                  />
                ) : (
                  <div className="text-8xl text-white/80">🎙️</div>
                )}
              </div>
              
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  {scholar.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                  {scholar.description}
                </p>
                
                {/* Stats */}
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
                  <span className="flex items-center gap-1">
                    <span>📚</span> {scholar.categories.length} Topics
                  </span>
                </div>

                {/* Categories Pills */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {scholar.categories.slice(0, 3).map(cat => (
                    <span
                      key={cat.id}
                      className="text-xs px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full"
                    >
                      {cat.name}
                    </span>
                  ))}
                  {scholar.categories.length > 3 && (
                    <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                      +{scholar.categories.length - 3}
                    </span>
                  )}
                </div>

                <div className="text-emerald-600 dark:text-emerald-400 text-sm font-medium flex items-center justify-between">
                  <span>View Categories</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Level 2: Categories Grid - YouTube Style */}
      {selectedScholar && !selectedCategory && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold dark:text-white">
              {selectedScholar.name} ke Playlists
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {selectedScholar.categories.length} playlists
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedScholar.categories.map((category) => {
              const stats = playlistStats[category.id] || {};
              const thumbnail = playlistThumbnails[category.id];
              
              return (
                <motion.div
                  key={category.id}
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedCategory(category)}
                  className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all cursor-pointer group"
                >
                  {/* Thumbnail with overlay */}
                  <div className="relative aspect-video bg-gray-200 dark:bg-gray-800">
                    {thumbnail ? (
                      <img
                        src={thumbnail}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/320x180?text=No+Thumbnail';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-600 to-emerald-800">
                        <span className="text-6xl text-white/50">📺</span>
                      </div>
                    )}
                    
                    {/* Video count badge */}
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-3 py-1.5 rounded-full font-medium">
                      {stats.videoCount || category.videoCount || '0'} videos
                    </div>

                    {/* Hover play button */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-14 h-14 rounded-full bg-emerald-600 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                        <span className="text-white text-3xl ml-1">▶</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-1 line-clamp-2">
                      {category.name}
                    </h3>
                    
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                      {category.description}
                    </p>

                    {/* Channel info */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-sm font-bold">
                        {selectedScholar.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {selectedScholar.name}
                      </span>
                    </div>

                    {/* Stats row */}
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <span>🎥</span>
                        {stats.videoCount || category.videoCount || '0'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <span>👁️</span>
                        {stats.totalViews || '—'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Level 3: Videos Grid */}
      {selectedCategory && (
        <div>
          <h2 className="text-2xl font-bold dark:text-white mb-4">
            {selectedScholar?.name} - {selectedCategory.name}
          </h2>
          
          {loading ? (
            <Loader message="Loading videos..." />
          ) : videos.length > 0 ? (
            <>
              {/* Videos count badge */}
              <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                🎥 Total {videos.length} videos in this playlist
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {videos.map((video, index) => (
                  <motion.a
                    key={video.id}
                    href={video.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -5 }}
                    className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all block"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video bg-gray-200 dark:bg-gray-800">
                      {video.thumbnail ? (
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/320x180?text=No+Thumbnail';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-4xl">🎬</span>
                        </div>
                      )}
                      
                      {/* Play button overlay */}
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center">
                          <span className="text-white text-2xl ml-1">▶</span>
                        </div>
                      </div>

                      {/* Video number badge */}
                      <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                        #{index + 1}
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-bold text-gray-800 dark:text-white mb-2 line-clamp-2">
                        {video.title}
                      </h3>
                      
                      {/* Metadata */}
                      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
                        {/* Upload date */}
                        <span className="flex items-center gap-1">
                          <span>📅</span>
                          {video.publishedAt ? getRelativeTime(video.publishedAt) : 'Recently'}
                        </span>
                        
                        {/* Video quality indicator */}
                        <span className="flex items-center gap-1">
                          <span>🎥</span>
                          HD
                        </span>
                        
                        {/* Language */}
                        <span className="flex items-center gap-1">
                          <span>🗣️</span>
                          Urdu
                        </span>
                      </div>

                      {/* Short description preview */}
                      {video.description && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 line-clamp-2">
                          {video.description.substring(0, 100)}...
                        </p>
                      )}
                    </div>
                  </motion.a>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
              <p className="text-5xl mb-3">🎬</p>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No videos available in this category yet
              </p>
              <p className="text-sm text-emerald-600 dark:text-emerald-400">
                Videos will be added soon, Insha'Allah
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  )
}