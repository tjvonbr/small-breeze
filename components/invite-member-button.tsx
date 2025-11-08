import { Button, buttonVariants } from "./ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Icons } from "./icons";
import { cn } from "@/lib/utils";

export default function InviteMemberButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={cn(buttonVariants(), "w-38 hover:cursor-pointer")}>
          <Icons.plus color="white" className="h-4 w-4" />
          <p className="text-white">Invite member</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite team member</DialogTitle>
          <DialogDescription>
            Enter the email of the team member you want to invite!
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="email" className="sr-only">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              placeholder="Email"
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <Button type="submit">Invite</Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}