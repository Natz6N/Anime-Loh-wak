import React, { useState, useRef } from 'react';
import { User, Calendar, Star, Reply, ThumbsUp, ThumbsDown, Bold, Italic, Underline, List, AlignLeft, AlignCenter, AlignRight, Link, Image } from 'lucide-react';

interface Comment {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  rating: number;
  createdAt: Date;
  likes: number;
  dislikes: number;
  replies?: Comment[];
}

interface AnimeInfo {
  title: string;
  episode?: string;
  season?: string;
}

const AnimeCommentsSystem: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: 'OtakuMaster99',
      content: '<p>Episode ini benar-benar luar biasa! Animasinya sangat smooth dan ceritanya semakin menarik. <strong>Studio MAPPA</strong> benar-benar tidak mengecewakan. Adegan fight scene di menit ke-15 memberikan goosebumps!</p>',
      rating: 10,
      createdAt: new Date('2024-12-01'),
      likes: 24,
      dislikes: 2,
      replies: [
        {
          id: '1-1',
          author: 'AnimeLover2024',
          content: '<p>Setuju banget! Bagian dimana protagonis menggunakan jutsu barunya itu epic sekali 🔥</p>',
          rating: 9,
          createdAt: new Date('2024-12-01'),
          likes: 8,
          dislikes: 0
        }
      ]
    },
    {
      id: '2',
      author: 'MangaReader123',
      content: '<p>Sebagai manga reader, saya agak kecewa dengan adaptasi episode ini. Beberapa scene penting di manga tidak dimasukkan. Tapi secara keseluruhan masih <em>enjoyable</em> untuk ditonton.</p><ul><li>Pacing terlalu cepat</li><li>Skip beberapa dialog penting</li><li>Animasi tetap bagus</li></ul>',
      rating: 7,
      createdAt: new Date('2024-11-30'),
      likes: 15,
      dislikes: 8
    }
  ]);

  const [newComment, setNewComment] = useState({
    author: '',
    content: '',
    rating: 8
  });

  const [animeInfo] = useState<AnimeInfo>({
    title: 'Jujutsu Kaisen',
    episode: '23',
    season: 'Season 2'
  });

  const [replyTo, setReplyTo] = useState<string | null>(null);

  // Rich Text Editor Functions
  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setNewComment(prev => ({ ...prev, content: editorRef.current!.innerHTML }));
    }
  };

  const handleEditorInput = () => {
    if (editorRef.current) {
      setNewComment(prev => ({ ...prev, content: editorRef.current!.innerHTML }));
    }
  };

  const insertLink = () => {
    const url = prompt('Masukkan URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const insertImage = () => {
    const url = prompt('Masukkan URL gambar:');
    if (url) {
      execCommand('insertImage', url);
    }
  };

  const handleSubmitComment = () => {
    if (!newComment.author.trim() || !newComment.content.trim()) {
      alert('Mohon isi nama dan komentar!');
      return;
    }

    const comment: Comment = {
      id: Date.now().toString(),
      author: newComment.author,
      content: newComment.content,
      rating: newComment.rating,
      createdAt: new Date(),
      likes: 0,
      dislikes: 0
    };

    if (replyTo) {
      setComments(prev => prev.map(c => {
        if (c.id === replyTo) {
          return {
            ...c,
            replies: [...(c.replies || []), comment]
          };
        }
        return c;
      }));
      setReplyTo(null);
    } else {
      setComments(prev => [comment, ...prev]);
    }

    setNewComment({ author: '', content: '', rating: 8 });
    if (editorRef.current) {
      editorRef.current.innerHTML = '';
    }
  };

  const handleLike = (commentId: string, isReply: boolean = false, parentId?: string) => {
    setComments(prev => prev.map(comment => {
      if (isReply && comment.id === parentId) {
        return {
          ...comment,
          replies: comment.replies?.map(reply => 
            reply.id === commentId ? { ...reply, likes: reply.likes + 1 } : reply
          )
        };
      } else if (comment.id === commentId) {
        return { ...comment, likes: comment.likes + 1 };
      }
      return comment;
    }));
  };

  const handleDislike = (commentId: string, isReply: boolean = false, parentId?: string) => {
    setComments(prev => prev.map(comment => {
      if (isReply && comment.id === parentId) {
        return {
          ...comment,
          replies: comment.replies?.map(reply => 
            reply.id === commentId ? { ...reply, dislikes: reply.dislikes + 1 } : reply
          )
        };
      } else if (comment.id === commentId) {
        return { ...comment, dislikes: comment.dislikes + 1 };
      }
      return comment;
    }));
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 10 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={`${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const CommentItem: React.FC<{ comment: Comment; isReply?: boolean; parentId?: string }> = ({ 
    comment, 
    isReply = false, 
    parentId 
  }) => (
    <div className={`bg-white rounded-lg shadow-sm border ${isReply ? 'ml-8 mt-4' : 'mb-6'} p-6`}>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
            {comment.author[0].toUpperCase()}
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h4 className="font-semibold text-gray-900">{comment.author}</h4>
            <div className="flex items-center space-x-1">
              {renderStars(comment.rating)}
              <span className="text-sm text-gray-600 ml-2">{comment.rating}/10</span>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <Calendar size={14} className="mr-1" />
            {formatDate(comment.createdAt)}
          </div>
          
          <div 
            className="prose prose-sm max-w-none mb-4 text-gray-700"
            dangerouslySetInnerHTML={{ __html: comment.content }}
          />
          
          <div className="flex items-center space-x-6">
            <button
              onClick={() => handleLike(comment.id, isReply, parentId)}
              className="flex items-center space-x-2 text-gray-500 hover:text-green-600 transition-colors"
            >
              <ThumbsUp size={16} />
              <span className="text-sm">{comment.likes}</span>
            </button>
            
            <button
              onClick={() => handleDislike(comment.id, isReply, parentId)}
              className="flex items-center space-x-2 text-gray-500 hover:text-red-600 transition-colors"
            >
              <ThumbsDown size={16} />
              <span className="text-sm">{comment.dislikes}</span>
            </button>
            
            {!isReply && (
              <button
                onClick={() => setReplyTo(comment.id)}
                className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors"
              >
                <Reply size={16} />
                <span className="text-sm">Reply</span>
              </button>
            )}
          </div>
        </div>
      </div>
      
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4">
          {comment.replies.map(reply => (
            <CommentItem key={reply.id} comment={reply} isReply={true} parentId={comment.id} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-6 mb-8">
        <h1 className="text-3xl font-bold mb-2">{animeInfo.title}</h1>
        <p className="text-purple-100">
          {animeInfo.season} - Episode {animeInfo.episode}
        </p>
        <div className="flex items-center mt-4 space-x-4">
          <div className="flex items-center">
            <User size={20} className="mr-2" />
            <span>{comments.length} Komentar</span>
          </div>
        </div>
      </div>

      {/* Comment Form */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          {replyTo ? 'Balas Komentar' : 'Tulis Komentar'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama
            </label>
            <input
              type="text"
              value={newComment.author}
              onChange={(e) => setNewComment(prev => ({ ...prev, author: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Masukkan nama Anda"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating (1-10)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="1"
                max="10"
                value={newComment.rating}
                onChange={(e) => setNewComment(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                className="flex-1"
              />
              <span className="font-semibold text-purple-600">{newComment.rating}</span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Komentar
          </label>
          
          {/* Rich Text Editor Toolbar */}
          <div className="border border-gray-300 rounded-t-md bg-gray-50 p-2 flex flex-wrap gap-1">
            <button
              type="button"
              onClick={() => execCommand('bold')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Bold"
            >
              <Bold size={16} />
            </button>
            <button
              type="button"
              onClick={() => execCommand('italic')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Italic"
            >
              <Italic size={16} />
            </button>
            <button
              type="button"
              onClick={() => execCommand('underline')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Underline"
            >
              <Underline size={16} />
            </button>
            
            <div className="w-px h-6 bg-gray-300 mx-1"></div>
            
            <button
              type="button"
              onClick={() => execCommand('justifyLeft')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Align Left"
            >
              <AlignLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => execCommand('justifyCenter')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Align Center"
            >
              <AlignCenter size={16} />
            </button>
            <button
              type="button"
              onClick={() => execCommand('justifyRight')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Align Right"
            >
              <AlignRight size={16} />
            </button>
            
            <div className="w-px h-6 bg-gray-300 mx-1"></div>
            
            <button
              type="button"
              onClick={() => execCommand('insertUnorderedList')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Bullet List"
            >
              <List size={16} />
            </button>
            <button
              type="button"
              onClick={() => execCommand('insertOrderedList')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Numbered List"
            >
              <span className="text-sm font-bold">1.</span>
            </button>
            
            <div className="w-px h-6 bg-gray-300 mx-1"></div>
            
            <button
              type="button"
              onClick={insertLink}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Insert Link"
            >
              <Link size={16} />
            </button>
            <button
              type="button"
              onClick={insertImage}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Insert Image"
            >
              <Image size={16} />
            </button>
            
            <div className="w-px h-6 bg-gray-300 mx-1"></div>
            
            <select
              onChange={(e) => execCommand('fontSize', e.target.value)}
              className="px-2 py-1 text-sm border-0 bg-transparent hover:bg-gray-200 rounded"
              defaultValue="3"
            >
              <option value="1">Sangat Kecil</option>
              <option value="2">Kecil</option>
              <option value="3">Normal</option>
              <option value="4">Besar</option>
              <option value="5">Sangat Besar</option>
            </select>
            
            <select
              onChange={(e) => execCommand('foreColor', e.target.value)}
              className="px-2 py-1 text-sm border-0 bg-transparent hover:bg-gray-200 rounded"
              defaultValue="#000000"
            >
              <option value="#000000">Hitam</option>
              <option value="#ff0000">Merah</option>
              <option value="#00ff00">Hijau</option>
              <option value="#0000ff">Biru</option>
              <option value="#ff00ff">Ungu</option>
              <option value="#ffff00">Kuning</option>
            </select>
          </div>
          
          {/* Rich Text Editor Content */}
          <div
            ref={editorRef}
            contentEditable
            onInput={handleEditorInput}
            className="w-full min-h-[200px] max-h-[400px] overflow-y-auto px-3 py-2 border border-gray-300 border-t-0 rounded-b-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            style={{ 
              wordWrap: 'break-word',
              overflowWrap: 'break-word'
            }}
            placeholder="Tulis komentar Anda di sini... Anda bisa menggunakan formatting dari toolbar di atas."
            suppressContentEditableWarning={true}
          />
        </div>

        <div className="flex justify-between items-center">
          {replyTo && (
            <button
              onClick={() => setReplyTo(null)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Batal
            </button>
          )}
          <button
            onClick={handleSubmitComment}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-md hover:from-purple-700 hover:to-blue-700 transition-colors font-medium"
          >
            {replyTo ? 'Kirim Balasan' : 'Kirim Komentar'}
          </button>
        </div>
      </div>

      {/* Comments List */}
      <div>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Komentar ({comments.length})
        </h2>
        
        {comments.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <User size={48} className="mx-auto mb-4 opacity-50" />
            <p>Belum ada komentar. Jadilah yang pertama!</p>
          </div>
        ) : (
          comments.map(comment => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
};

export default AnimeCommentsSystem;