import { Check, Copy } from 'lucide-react';
import * as React from 'react';
import JSONPretty from 'react-json-pretty';
import { toast } from 'react-toastify';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import 'react-json-pretty/themes/monikai.css'; // You can choose another theme if preferred

interface JsonViewerProps<T = unknown> {
  data: T;
  title?: string;
  className?: string;
}

export const JsonViewer = <T = unknown,>({
  data,
  title = 'JSON Viewer',
  className
}: JsonViewerProps<T>): React.JSX.Element => {
  const [isCopied, setIsCopied] = React.useState(false);

  // const handleCopy = async () => {
  //   try {
  //     if (!isCopied) {
  //       const json = JSON.stringify(data, null, 2);
  //       await navigator.clipboard.writeText(json);
  //       toast.success('JSON copied to clipboard!');
  //       setIsCopied(true);
  //       setTimeout(() => setIsCopied(false), 2000);
  //     }
  //   } catch {
  //     toast.error('Failed to copy JSON.');
  //   }
  // };

  const handleCopy = async () => {
    try {
      const json =
        typeof data === 'string' ? data : JSON.stringify(data, null, 2);

      if (!json) {
        toast.error('Nothing to copy.');
        return;
      }

      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(json);
      } else {
        // fallback for insecure context
        const textArea = document.createElement('textarea');
        textArea.value = json;
        textArea.style.position = 'fixed'; // avoid scrolling
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      toast.success('JSON copied to clipboard!');
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Copy error:', err);
      toast.error('Failed to copy JSON.');
    }
  };

  return (
    <Card className={cn('relative w-full shadow-md', className)}>
      <CardHeader className="flex items-center justify-between py-3">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          disabled={isCopied}
          title="Copy JSON">
          {isCopied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      <CardContent className="max-h-[600px] overflow-auto p-4 pt-0 bg-muted/20 rounded-md">
        <div className="text-sm font-mono whitespace-pre-wrap">
          <JSONPretty data={data} />
        </div>
      </CardContent>
    </Card>
  );
};
