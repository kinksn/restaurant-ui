import { prisma } from "@/utils/connect";
import { NextResponse, NextRequest } from "next/server";

// FETCH ALL PRODUCTS
// 引数`req`に入るのはリクエスト時のURL（エンドポイントのURL）
export const GET = async ( req: NextRequest ) => {
  const { searchParams } = new URL(req.url);
  const cat = searchParams.get('cat');
  try {
    const products = await prisma.product.findMany({
      where: {  
        ...(cat ? { catSlug: cat } : { isFeatured: true })
      }
    });
    return new NextResponse(
      JSON.stringify(products),
      { status: 200 }
    );
  } catch(err) {
    return new NextResponse(
      JSON.stringify({ message: 'Something went wrong!' }),
      { status: 500 }
    );
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const products = await prisma.product.create({
      data: body,
    });
    return new NextResponse(
      JSON.stringify(products),
      { status: 201 }
    );
  } catch(err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: 'Something went wrong!' }),
      { status: 500 }
    );
  }
};