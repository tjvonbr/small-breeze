"use client"

import Link from "next/link"

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	return (
		<html>
			<body>
				<div className="flex min-h-screen items-center justify-center px-8">
					<div className="text-center">
						<h1 className="text-2xl font-semibold">Something went wrong</h1>
						{error?.message ? (
							<p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
						) : null}
						<div className="mt-6 flex items-center justify-center gap-3">
							<button
								onClick={() => reset()}
								className="rounded-md border px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
							>
								Try again
							</button>
							<Link href="/" className="text-sm underline hover:text-brand">
								Go home
							</Link>
						</div>
					</div>
				</div>
			</body>
		</html>
	)
}


