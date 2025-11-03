"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useMemo, useRef } from "react"
 
import { switchTeam } from "@/app/actions/teams"
import { Icons } from "./icons"
import TeamAvatar from "./team-avatar"

interface TeamDropdownProps {
  teams: { id: string; name: string }[]
  currentTeamId: string | null
}

export function TeamDropdown({ teams, currentTeamId }: TeamDropdownProps) {
  const current = useMemo(() => teams.find(t => t.id === currentTeamId) ?? teams[0] ?? null, [teams, currentTeamId])
  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function submit(teamId: string) {
    if (!formRef.current || !inputRef.current) return
    inputRef.current.value = teamId
    formRef.current.requestSubmit()
  }

  if (!teams || teams.length === 0) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="group w-[90%] flex space-x-2 px-3 py-2 border mx-auto truncate items-center rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground hover:cursor-pointer">
          <TeamAvatar currentTeam={current} />
          <span className="truncate text-xs">{current?.name ?? "Select team"}</span>
          <div className="w-[10%] flex items-center justify-center">
            <Icons.down className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start" forceMount>
        <DropdownMenuLabel className="font-normal">Teams</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {teams.map((team) => (
          <DropdownMenuItem key={team.id} onClick={() => submit(team.id)}>
            <span className="flex items-center gap-2">
              {/* {team.id === current?.id && <Check className="h-4 w-4" />} */}
              {/* <span className="truncate">{team.name}</span> */}
              <span className="truncate">Trevor Von Bruenchenhein</span>
            </span>
          </DropdownMenuItem>
        ))}
        <form ref={formRef} action={switchTeam} className="hidden">
          <input ref={inputRef} type="hidden" name="teamId" />
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


