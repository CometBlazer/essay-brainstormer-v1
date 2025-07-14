'use client';

import type { Message } from 'ai';
import { Button } from './ui/button';
import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Textarea } from './ui/textarea';
import { deleteTrailingMessages } from '@/app/(chat)/actions';
import type { UseChatHelpers } from '@ai-sdk/react';
import { toast } from 'sonner';
import cx from 'classnames';

const MAX_MESSAGE_LENGTH = 20000;

export type MessageEditorProps = {
  message: Message;
  setMode: Dispatch<SetStateAction<'view' | 'edit'>>;
  setMessages: UseChatHelpers['setMessages'];
  reload: UseChatHelpers['reload'];
};

export function MessageEditor({
  message,
  setMode,
  setMessages,
  reload,
}: MessageEditorProps) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [draftContent, setDraftContent] = useState<string>(message.content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight();
    }
  }, []);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`;
    }
  };

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;

    // Allow typing but warn when approaching limit
    if (value.length > MAX_MESSAGE_LENGTH) {
      toast.error(`Message cannot exceed ${MAX_MESSAGE_LENGTH} characters`);
      return;
    }

    setDraftContent(value);
    adjustHeight();
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="relative">
        <Textarea
          data-testid="message-editor"
          ref={textareaRef}
          className={cx(
            'bg-transparent outline-none overflow-hidden resize-none !text-base rounded-xl w-full pr-16',
            {
              'border-red-500 dark:border-red-400':
                draftContent.length > MAX_MESSAGE_LENGTH * 0.9,
              'border-yellow-500 dark:border-yellow-400':
                draftContent.length > MAX_MESSAGE_LENGTH * 0.8 &&
                draftContent.length <= MAX_MESSAGE_LENGTH * 0.9,
            },
          )}
          value={draftContent}
          onChange={handleInput}
        />

        {/* Character counter */}
        <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
          <span
            className={cx({
              'text-red-500': draftContent.length > MAX_MESSAGE_LENGTH,
              'text-yellow-500':
                draftContent.length > MAX_MESSAGE_LENGTH * 0.8 &&
                draftContent.length <= MAX_MESSAGE_LENGTH,
              'text-green-500':
                draftContent.length > 0 &&
                draftContent.length <= MAX_MESSAGE_LENGTH * 0.8,
            })}
          >
            {draftContent.length}/{MAX_MESSAGE_LENGTH}
          </span>
        </div>
      </div>

      <div className="flex flex-row gap-2 justify-end">
        <Button
          variant="outline"
          className="h-fit py-2 px-3"
          onClick={() => {
            setMode('view');
          }}
        >
          Cancel
        </Button>
        <Button
          data-testid="message-editor-send-button"
          variant="default"
          className="h-fit py-2 px-3"
          disabled={
            isSubmitting ||
            draftContent.length === 0 ||
            draftContent.length > MAX_MESSAGE_LENGTH
          }
          title={
            draftContent.length > MAX_MESSAGE_LENGTH
              ? `Message exceeds ${MAX_MESSAGE_LENGTH} character limit`
              : draftContent.length === 0
                ? 'Enter a message to send'
                : 'Send updated message'
          }
          onClick={async () => {
            if (draftContent.length > MAX_MESSAGE_LENGTH) {
              toast.error(
                `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters`,
              );
              return;
            }

            if (draftContent.length === 0) {
              toast.error('Please enter a message');
              return;
            }

            setIsSubmitting(true);

            await deleteTrailingMessages({
              id: message.id,
            });

            // @ts-expect-error todo: support UIMessage in setMessages
            setMessages((messages) => {
              const index = messages.findIndex((m) => m.id === message.id);

              if (index !== -1) {
                const updatedMessage = {
                  ...message,
                  content: draftContent,
                  parts: [{ type: 'text', text: draftContent }],
                };

                return [...messages.slice(0, index), updatedMessage];
              }

              return messages;
            });

            setMode('view');
            reload();
          }}
        >
          {isSubmitting ? 'Sending...' : 'Send'}
        </Button>
      </div>
    </div>
  );
}
