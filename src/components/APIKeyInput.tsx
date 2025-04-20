
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { usePerplexityStore } from "@/services/perplexityService";

export default function APIKeyInput() {
  const { apiKey, setApiKey } = usePerplexityStore();
  const [inputKey, setInputKey] = useState(apiKey);
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    setApiKey(inputKey);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {apiKey ? "Update API Key" : "Set API Key"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Perplexity API Key</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Input
              type="password"
              placeholder="Enter your Perplexity API key"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">
              Your API key is stored locally in your browser and never sent to our servers.
            </p>
          </div>
          <Button onClick={handleSave}>Save API Key</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
