import { Link } from "@react-email/components";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { Icons } from "./icons";

export default function AddListingButton() {
  return (
    <Link href="/properties/new" className={cn(buttonVariants(), "w-38 hover:cursor-pointer")}>
      <Icons.plus color="white" className="h-4 w-4" />
      <p className="text-white">Add new listing</p>
    </Link>
  )
}