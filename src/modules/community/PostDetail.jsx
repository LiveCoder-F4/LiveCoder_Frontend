import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "../../app/AppLayout.jsx";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import { communityApi } from "../../api/communityApi";
import { friendApi } from "../../api/friendApi";

// --- 개별 입력창 컴포넌트 (독립적 상태 관리로 타이핑 오류 해결) ---
const CommentInput = ({ 
  initialValue = "", 
  placeholder = "내용을 입력하세요...", 
  onSubmit, 
  onCancel, 
  submitLabel = "등록",
  autoFocus = true 
}) => {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = () => {
    if (!value.trim()) return;
    onSubmit(value);
    setValue("");
  };

  return (
    <div className="mt-3 p-3 bg-neutral-50 rounded-lg space-y-2">
      <textarea 
        className="w-full p-2 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        placeholder={placeholder}
        rows={2}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoFocus={autoFocus}
      />
      <div className="flex justify-end gap-2">
        {onCancel && (
          <button onClick={onCancel} className="text-xs text-neutral-500">취소</button>
        )}
        <button 
          onClick={handleSubmit} 
          className="text-xs text-indigo-600 font-bold disabled:opacity-50"
          disabled={!value.trim()}
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
};

// --- 댓글 렌더링 컴포넌트 ---
const CommentItem = ({ 
  comment, 
  isReply = false, 
  currentUserId, 
  editingCommentId, 
  replyingCommentId, 
  startReplyComment, 
  startEditComment, 
  handleCommentDelete, 
  handleCommentUpdate, 
  handleCommentSubmit,
  handleFriendRequest,
  setEditingCommentId,
  setReplyingCommentId
}) => (
  <div className={`space-y-3 ${isReply ? 'ml-8 mt-4 border-l-2 border-neutral-100 pl-4' : 'p-4 bg-white rounded-xl border border-neutral-100 shadow-sm'}`}>
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span className="font-bold text-sm text-neutral-700">{comment.nickname}</span>
        {currentUserId !== String(comment.userId) && (
          <button 
            onClick={() => handleFriendRequest(comment.userId)}
            className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded-md font-bold hover:bg-indigo-100"
            title="친구 요청"
          >
            + 친구
          </button>
        )}
        <span className="text-[10px] text-neutral-400">{new Date(comment.createdAt).toLocaleString()}</span>
      </div>
      <div className="flex gap-3">
        <button onClick={() => startReplyComment(comment.commentId)} className="text-[10px] text-indigo-500 font-bold hover:underline">답글</button>
        {currentUserId === String(comment.userId) && (
          <>
            <button onClick={() => startEditComment(comment)} className="text-[10px] text-neutral-400 hover:text-indigo-500">수정</button>
            <button onClick={() => handleCommentDelete(comment.commentId)} className="text-[10px] text-neutral-400 hover:text-red-500">삭제</button>
          </>
        )}
      </div>
    </div>

    {editingCommentId === comment.commentId ? (
      <CommentInput 
        initialValue={comment.content}
        submitLabel="저장"
        onSubmit={(val) => handleCommentUpdate(comment.commentId, val)}
        onCancel={() => setEditingCommentId(null)}
      />
    ) : (
      <p className="text-sm text-neutral-600 whitespace-pre-wrap">{comment.content}</p>
    )}

    {/* 답글 입력창 */}
    {replyingCommentId === comment.commentId && (
      <CommentInput 
        placeholder="답글을 남겨보세요..."
        onSubmit={(val) => handleCommentSubmit(comment.commentId, val)}
        onCancel={() => setReplyingCommentId(null)}
      />
    )}

    {/* 재귀적으로 대댓글 렌더링 */}
    {comment.replies && comment.replies.length > 0 && (
      <div className="space-y-2">
        {comment.replies.map(reply => (
          <CommentItem 
            key={reply.commentId} 
            comment={reply} 
            isReply={true}
            currentUserId={currentUserId}
            editingCommentId={editingCommentId}
            replyingCommentId={replyingCommentId}
            startReplyComment={startReplyComment}
            startEditComment={startEditComment}
            handleCommentDelete={handleCommentDelete}
            handleCommentUpdate={handleCommentUpdate}
            handleCommentSubmit={handleCommentSubmit}
            handleFriendRequest={handleFriendRequest}
            setEditingCommentId={setEditingCommentId}
            setReplyingCommentId={setReplyingCommentId}
          />
        ))}
      </div>
    )}
  </div>
);

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [replyingCommentId, setReplyingCommentId] = useState(null);
  const currentUserId = localStorage.getItem("userId");
  const hasIncreasedViewCount = useRef(false);

  const fetchPostDetail = async () => {
    try {
      const response = await communityApi.getPostDetail(id);
      if (response.data && response.data.success) {
        setPost(response.data.data);
      }
    } catch (err) {
      console.error("게시글 상세 정보를 불러오는데 실패했습니다.", err);
    }
  };

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        if (!hasIncreasedViewCount.current) {
          await communityApi.increaseViewCount(id);
          hasIncreasedViewCount.current = true;
        }
        await fetchPostDetail();
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [id]);

  const handleFriendRequest = async (userId) => {
    try {
      await friendApi.sendFriendRequest(userId);
      alert("친구 요청을 보냈습니다.");
    } catch (err) {
      alert(err.response?.data || "친구 요청에 실패했습니다.");
    }
  };

  const handleLikeToggle = async () => {
    try {
      if (post.isLiked) {
        await communityApi.unlikePost(id);
      } else {
        await communityApi.likePost(id);
      }
      fetchPostDetail();
    } catch (err) {
      console.error("좋아요 처리 실패", err);
    }
  };

  const handlePostDelete = async () => {
    if (!window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) return;
    try {
      await communityApi.deletePost(id);
      alert("게시글이 삭제되었습니다.");
      navigate("/community/auth");
    } catch (err) {
      alert("본인의 글만 삭제할 수 있습니다.");
    }
  };

  const handleCommentSubmit = async (parentId = null, content = null) => {
    const finalContent = content || commentContent;
    if (!finalContent.trim()) return;

    try {
      await communityApi.createComment(id, { 
        content: finalContent, 
        userId: currentUserId,
        parentId: parentId 
      });
      
      if (parentId) {
        setReplyingCommentId(null);
      } else {
        setCommentContent("");
      }
      fetchPostDetail();
    } catch (err) {
      console.error("댓글 작성 실패", err);
    }
  };

  const handleCommentDelete = async (commentId) => {
    if (!window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) return;
    try {
      await communityApi.deleteComment(id, commentId);
      fetchPostDetail();
    } catch (err) {
      alert("본인의 댓글만 삭제할 수 있습니다.");
    }
  };

  const startEditComment = (comment) => {
    setEditingCommentId(comment.commentId);
    setReplyingCommentId(null);
  };

  const startReplyComment = (commentId) => {
    setReplyingCommentId(commentId);
    setEditingCommentId(null);
  };

  const handleCommentUpdate = async (commentId, content) => {
    try {
      await communityApi.updateComment(id, commentId, content);
      setEditingCommentId(null);
      fetchPostDetail();
    } catch (err) {
      alert("댓글 수정에 실패했습니다.");
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64 text-neutral-400">데이터를 불러오는 중...</div>
      </AppLayout>
    );
  }

  if (!post) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-neutral-500">게시글을 찾을 수 없습니다.</p>
          <Button onClick={() => navigate(-1)}>뒤로 가기</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 상단 헤더 영역 */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded uppercase">
                {post.category || "INFO"}
              </span>
              <h1 className="text-2xl font-bold text-neutral-800">{post.title}</h1>
            </div>
            <div className="flex items-center gap-4 text-sm text-neutral-500">
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-neutral-700">👤 {post.nickname}</span>
                {currentUserId !== String(post.userId) && (
                  <button 
                    onClick={() => handleFriendRequest(post.userId)}
                    className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-md font-bold hover:bg-indigo-700 transition-colors"
                  >
                    + 친구 요청
                  </button>
                )}
              </div>
              <span>📅 {new Date(post.createdAt).toLocaleDateString()}</span>
              <span>👁️ {post.viewCount}</span>
            </div>
          </div>
          <div className="flex gap-2">
            {currentUserId === String(post.userId) && (
              <>
                <Button variant="outline" size="sm" onClick={() => navigate(`/posts/${id}/edit`)}>수정</Button>
                <Button variant="outline" size="sm" className="text-red-500 border-red-100 hover:bg-red-50" onClick={handlePostDelete}>삭제</Button>
              </>
            )}
            <Button variant="outline" size="sm" onClick={() => navigate(-1)}>목록</Button>
          </div>
        </div>

        {/* 본문 영역 */}
        <Card className="min-h-[400px] p-8">
          <div className="prose prose-neutral max-w-none">
            <div className="whitespace-pre-wrap text-neutral-700 leading-relaxed">
              {post.content}
            </div>
          </div>
          
          {/* ✅ 추가: 첨부파일 목록 영역 */}
          {post.attachments && post.attachments.length > 0 && (
            <div className="mt-10 p-5 bg-neutral-50 rounded-2xl border border-neutral-100">
              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                📎 첨부파일 ({post.attachments.length})
              </h4>
              <div className="flex flex-wrap gap-3">
                {post.attachments.map(file => (
                  <a 
                    key={file.attachmentId}
                    href={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/posts/attachments/${file.attachmentId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm font-medium text-neutral-600 hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm"
                  >
                    <span className="text-indigo-400">📄</span>
                    {file.originalFilename}
                    <span className="text-[10px] text-neutral-400 ml-1">
                      ({(file.fileSize / 1024).toFixed(1)} KB)
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-12 pt-6 border-t border-neutral-100 flex justify-center gap-4">
            <button className="flex flex-col items-center gap-1 group" onClick={handleLikeToggle}>
              <div className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${post.isLiked ? 'bg-red-50 border-red-200' : 'border-neutral-200 group-hover:bg-red-50 group-hover:border-red-200'}`}>
                <span className="text-xl">{post.isLiked ? '❤️' : '🤍'}</span>
              </div>
              <span className={`text-xs font-medium ${post.isLiked ? 'text-red-500' : 'text-neutral-500'}`}>{post.likeCount}</span>
            </button>
          </div>
        </Card>

        {/* 댓글 영역 */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-neutral-800 flex items-center gap-2">
            댓글 <span className="text-indigo-600">{post.commentCount}</span>
          </h3>
          
          <Card className="p-4">
            <div className="flex flex-col gap-3">
              <textarea 
                className="w-full p-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
                placeholder="댓글을 남겨보세요..."
                rows={3}
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
              />
              <div className="flex justify-end">
                <Button size="sm" onClick={() => handleCommentSubmit()} disabled={!commentContent.trim()}>댓글 등록</Button>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map(comment => (
                <CommentItem 
                  key={comment.commentId} 
                  comment={comment} 
                  currentUserId={currentUserId}
                  editingCommentId={editingCommentId}
                  replyingCommentId={replyingCommentId}
                  startReplyComment={startReplyComment}
                  startEditComment={startEditComment}
                  handleCommentDelete={handleCommentDelete}
                  handleCommentUpdate={handleCommentUpdate}
                  handleCommentSubmit={handleCommentSubmit}
                  handleFriendRequest={handleFriendRequest}
                  setEditingCommentId={setEditingCommentId}
                  setReplyingCommentId={setReplyingCommentId}
                />
              ))
            ) : (
              <div className="py-10 text-center text-neutral-400 text-sm italic">
                아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
