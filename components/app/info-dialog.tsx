import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ReactMarkdown from "react-markdown";
import explanations from "@/data/thai-phrase-explanations.json";
import { AiOutlineInfoCircle } from "react-icons/ai";

export function InfoDialog({
  phrase,
}: {
  phrase: { id: string; translation: string; transliteration: string };
}) {
  const explanation = explanations.find((item) => item.id === phrase.id);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex gap-2" variant="outline">
          <AiOutlineInfoCircle className="text-xl" /> Info
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-screen overflow-scroll sm:py-4 py-24">
        <DialogHeader>
          <DialogTitle>
            <span className="text-2xl">Phrase Breakdown</span>
          </DialogTitle>
          <DialogDescription>
            <div className="text-base">{phrase.translation}</div>
            <div className="text-base">{phrase.transliteration}</div>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-xl">
          <ReactMarkdown>{explanation?.explanation}</ReactMarkdown>
        </div>
        <DialogFooter>
          <DialogClose>
            <Button>Exit</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
