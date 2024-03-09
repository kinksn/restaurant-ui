import { prisma } from "@/utils/connect";
import { NextResponse } from "next/server";
import { MenyType } from "@/types/types";

// FETCH ALL CATEGORIES
export const GET = async (): Promise<NextResponse<MenyType>> => {
  try {
    const categories = await prisma.category.findMany();
    return new NextResponse(
      JSON.stringify(categories),
      { status: 200 }
    );
  } catch(err) {
    return new NextResponse(
      JSON.stringify({ message: 'Something went wrong!' }),
      { status: 500 }
    );
  }
}