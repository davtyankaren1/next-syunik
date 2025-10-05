import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare, User, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface CommentListProps {
  roomId: string;
}

export const CommentsList = ({ roomId }: CommentListProps) => {
  const { data: comments, isLoading, error } = useQuery({
    queryKey: ["room_comments", roomId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("room_comments")
        .select("*")
        .eq("room_id", roomId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Array<{
        id: string;
        room_id: string;
        guest_name: string;
        comment: string;
        created_at: string;
        updated_at: string;
      }>;
    },
  });
  // Important: hooks must be called unconditionally on every render
  const [expanded, setExpanded] = useState(false);

  const formatDate = (date: string) => {
    const d = new Date(date);
    const offset = 4 * 60 * 60 * 1000; // +4 hours timezone
    const localDate = new Date(d.getTime() + offset);
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${pad(localDate.getDate())}/${pad(localDate.getMonth() + 1)}/${localDate.getFullYear()} ${pad(localDate.getHours())}:${pad(localDate.getMinutes())}`;
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading comments...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Failed to load comments.</div>;
  }

  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p>No comments yet. Be the first to share your thoughts!</p>
      </div>
    );
  }

  const visibleCount = expanded ? comments.length : Math.min(2, comments.length);

  return (
    <div className="space-y-4 w-full">
      {comments.slice(0, visibleCount).map((comment) => (
        <Card key={comment.id} className="border-border/60 mb-2">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3 mb-2">
              <div className="flex-shrink-0">
                <User className="h-10 w-10 p-2 bg-primary/10 rounded-full text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{comment.guest_name}</h4>
                  <time className="text-sm text-muted-foreground">
                    {formatDate(comment.created_at)}
                  </time>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{comment.comment}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      {comments.length > 2 && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            aria-label={expanded ? "Show fewer comments" : "Show more comments"}
            onClick={() => setExpanded((s) => !s)}
            className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-[#ED5027] text-white shadow-md active:scale-95 transition"
          >
            <ChevronDown className={`h-8 w-8 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentsList;
