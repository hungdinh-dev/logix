import { useState } from 'react';
import { ThumbsUp, MessageSquare, Send } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import type { DiscussionComment, ChatMessage } from '../../types/lesson-player.types';

/* ── Discussion ── */
function CommentItem({ comment }: { comment: DiscussionComment }) {
  return (
    <div className="flex gap-2.5 py-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-primary">
        {comment.authorInitials}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-1.5">
          <span className="text-xs font-semibold text-foreground">{comment.authorName}</span>
          <span className="text-[10px] text-muted-foreground">{comment.timeAgo}</span>
        </div>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{comment.text}</p>
        <div className="mt-1.5 flex items-center gap-3">
          <button type="button" className="flex cursor-pointer items-center gap-1 text-[10px] text-muted-foreground hover:text-muted-foreground/80 transition-colors">
            <ThumbsUp className="h-3 w-3" />
            {comment.likes}
          </button>
          <button type="button" className="flex cursor-pointer items-center gap-1 text-[10px] text-muted-foreground hover:text-muted-foreground/80 transition-colors">
            <MessageSquare className="h-3 w-3" />
            Reply
          </button>
        </div>
      </div>
    </div>
  );
}

function DiscussionPanel({ comments }: { comments: readonly DiscussionComment[] }) {
  const [newComment, setNewComment] = useState('');

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 divide-y divide-border overflow-y-auto">
        {comments.map((c) => (
          <CommentItem key={c.id} comment={c} />
        ))}
      </div>
      <div className="shrink-0 border-t border-border pt-3">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          rows={2}
          className="w-full resize-none rounded-lg border border-border bg-card p-2.5 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20"
        />
        <button
          type="button"
          onClick={() => setNewComment('')}
          disabled={!newComment.trim()}
          className="mt-2 w-full rounded-lg bg-primary py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary/80 disabled:opacity-40"
        >
          Post
        </button>
      </div>
    </div>
  );
}

/* ── AI Assistant ── */
function AiAssistantPanel({ initialMessages }: { initialMessages: readonly ChatMessage[] }) {
  const [messages, setMessages] = useState<ChatMessage[]>([...initialMessages]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input.trim() };
    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      text: 'Great question! Based on this lesson, phishing emails typically use lookalike domains and urgency language. Review the transcript at 1:40 for the full breakdown.',
    };
    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInput('');
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-2 overflow-y-auto py-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
          >
            <div
              className={cn(
                'max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed',
                msg.role === 'user'
                  ? 'rounded-br-sm bg-primary text-white'
                  : 'rounded-bl-sm bg-muted text-foreground',
              )}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="shrink-0 flex items-center gap-2 border-t border-border pt-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask anything about this lesson..."
          className="flex-1 rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20"
        />
        <button
          type="button"
          onClick={sendMessage}
          aria-label="Send"
          disabled={!input.trim()}
          className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-primary text-white transition-colors hover:bg-primary/80 disabled:opacity-40"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ── Main ── */
import { ChevronRight } from 'lucide-react';

interface LessonRightPanelProps {
  readonly comments: readonly DiscussionComment[];
  readonly initialAiMessages: readonly ChatMessage[];
  readonly onClose?: () => void;
}

export function LessonRightPanel({ comments, initialAiMessages, onClose }: LessonRightPanelProps) {
  return (
    <div className="flex h-full w-[320px] shrink-0 flex-col border-l border-border bg-card">
      <Tabs defaultValue="discussion" className="flex h-full flex-col overflow-hidden">
        <TabsList
          variant="line"
          className="h-auto w-full shrink-0 gap-0 rounded-none border-b border-border bg-transparent p-0 flex items-center justify-between"
        >
          <div className="flex flex-1">
            {(['discussion', 'ai'] as const).map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="flex-1 h-11 rounded-none border-b-2 border-transparent text-xs font-medium text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-primary"
              >
                {tab === 'ai' ? 'AI Assistant' : 'Discussion'}
              </TabsTrigger>
            ))}
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="h-11 w-11 flex shrink-0 items-center justify-center border-l border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Collapse panel"
              title="Thu nhỏ khung"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </TabsList>

        <TabsContent value="discussion" className="flex flex-1 flex-col overflow-hidden px-4 pb-4 pt-2">
          <DiscussionPanel comments={comments} />
        </TabsContent>
        <TabsContent value="ai" className="flex flex-1 flex-col overflow-hidden px-4 pb-4 pt-2">
          <AiAssistantPanel initialMessages={initialAiMessages} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
