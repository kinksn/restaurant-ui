import { prisma } from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, { params }: { params: { id: string }}) => {
  const { id } = params;

  try {
    const body = await req.json();
    await prisma.order.update({
      where: {
        id
      },
      data: { status: body }
    });
    return new NextResponse(
      JSON.stringify({ message: "Order has been updated!"}),
      { status: 200 },
    );
  } catch(err) {
    console.error(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!"}),
      { status: 500 },
    )
  }
}