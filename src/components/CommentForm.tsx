import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";

export type CommentFormValues = { guest_name: string; comment: string };

interface CommentFormProps {
  roomId: string;
  onSuccess?: () => void;
}

export const CommentForm = ({ roomId, onSuccess }: CommentFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CommentFormValues>({
    defaultValues: {
      guest_name: "",
      comment: "",
    },
  });

  // Watch fields to control submit availability
  const watchedName = form.watch("guest_name");
  const watchedComment = form.watch("comment");
  const canSubmitTrim = (watchedName?.trim()?.length ?? 0) > 0 && (watchedComment?.trim()?.length ?? 0) > 0;

  const submitMutation = useMutation({
    mutationFn: async (values: CommentFormValues) => {
      const { data, error } = await supabase
        .from("room_comments")
        .insert({
          room_id: roomId,
          guest_name: values.guest_name,
          comment: values.comment,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["room_comments", roomId] });
      toast({
        title: "Success",
        description: "Your comment has been submitted!",
      });
      form.reset();
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to submit comment: " + (error?.message ?? "Unknown error"),
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: CommentFormValues) => {
    submitMutation.mutate(values);
  };

  return (
    <Form {...form} >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full" >
        <FormField
          control={form.control}
          name="guest_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('comments.name')}</FormLabel>
              <FormControl>
                <Input
                  className="bg-transparent w-full border border-gray-300 focus:border-gray-400 focus:ring-0"
                  placeholder={t('comments.name')}
                  {...field}
                  disabled={submitMutation.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('comments.your_comment')}</FormLabel>
              <FormControl>
                <Textarea
                  className="bg-transparent w-full border border-gray-300 focus:border-gray-400 focus:ring-0 resize-none"
                  placeholder={t('comments.your_comment')}
                  rows={6}
                  {...field}
                  disabled={submitMutation.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={!canSubmitTrim || submitMutation.isPending} className="w-full">
          {submitMutation.isPending ? "Submitting..." : `${t('comments.submit_comment')}`}
        </Button>
      </form>
    </Form>
  );
};

export default CommentForm;
