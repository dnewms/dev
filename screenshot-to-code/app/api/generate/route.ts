import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateCodeFromImage } from "@/lib/openai"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      )
    }

    // Check user credits
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { credits: true },
    })

    if (!user || user.credits < 1) {
      return NextResponse.json(
        { error: "Insufficient credits. Please purchase more credits." },
        { status: 403 }
      )
    }

    const { image, codeType } = await req.json()

    if (!image || !codeType) {
      return NextResponse.json(
        { error: "Missing required fields: image and codeType" },
        { status: 400 }
      )
    }

    if (codeType !== "html" && codeType !== "react") {
      return NextResponse.json(
        { error: "Invalid codeType. Must be 'html' or 'react'" },
        { status: 400 }
      )
    }

    // Generate code using OpenAI Vision API
    const generatedCode = await generateCodeFromImage(image, codeType)

    // Deduct credit and save generation
    await prisma.$transaction([
      prisma.user.update({
        where: { id: session.user.id },
        data: { credits: { decrement: 1 } },
      }),
      prisma.generation.create({
        data: {
          userId: session.user.id,
          imageUrl: image.substring(0, 100), // Store truncated base64 for reference
          generatedCode,
          codeType,
        },
      }),
    ])

    return NextResponse.json({
      code: generatedCode,
      creditsRemaining: user.credits - 1,
    })
  } catch (error) {
    console.error("Generate API Error:", error)
    return NextResponse.json(
      { error: "Failed to generate code. Please try again." },
      { status: 500 }
    )
  }
}
