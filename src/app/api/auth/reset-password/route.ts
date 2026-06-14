import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { generatePasswordResetToken } from "@/lib/auth/tokens";
import { z } from "zod";

// NOTE: In production, install and import `resend` to send the actual email.
// import { Resend } from "resend";
// const resend = new Resend(process.env.RESEND_API_KEY);

const requestSchema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = requestSchema.parse(body);

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Return success anyway to prevent email enumeration attacks
      return NextResponse.json({ success: true });
    }

    // Generate secure token
    const passwordResetToken = await generatePasswordResetToken(user.email);

    // Send email using Resend (simulated here for MVP safety if key is missing)
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/reset-password?token=${passwordResetToken.token}`;
    
    console.log("====================================");
    console.log("PASSWORD RESET EMAIL INTERCEPTED");
    console.log(`To: ${user.email}`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log("====================================");

    /*
    await resend.emails.send({
      from: 'security@carbontrack.app',
      to: user.email,
      subject: 'Reset your CarbonTrack password',
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p>`
    });
    */

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[api/auth/reset-password]", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
