import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./lib/prisma"
import Resend from "next-auth/providers/resend"
import { Resend as ResendClient } from "resend"
     
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/sign-in",
    newUser: "/sign-up",
    verifyRequest: "/verify-email",
  },
  providers: [
    Resend({
      from: "Smallbreeze <no-reply@smallbreeze.com>",
      sendVerificationRequest: async ({ url, identifier: email }) => {
        const resend = new ResendClient(process.env.RESEND_API_TOKEN)

        await resend.emails.send({
          from: "no-reply@smallbreeze.com",
          to: email,
          subject: "Verify your email",
          html: `<p>Click <a href="${url}">here</a> to verify your email</p>`,
        })

        return
      },
    }),
  ],
})