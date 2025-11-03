export default function TeamAvatar({ currentTeam }: { currentTeam: { name: string } }) {
  const firstInitial = currentTeam.name.charAt(0).toUpperCase();

  return (
    <div className="px-2 py-1 rounded-sm bg-accent text-black flex items-center justify-center">
      <span className="text-xs">{firstInitial}</span>
    </div>
  )
}