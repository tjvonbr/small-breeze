import Link from "next/link"
import { Icons } from "./icons"

export default function Logo() {
  return (
    <Link className="inline-flex w-fit self-center hover:cursor-pointer" href="/">
      <Icons.logo className="h-6 w-6" />
    </Link>
  )
}