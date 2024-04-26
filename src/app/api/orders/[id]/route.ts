import { prisma } from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";
import { AddressType, OrderType } from '@/types/types';

type UpdateOrderRequest = {
  status?: OrderType["status"];
  address?: AddressType;
}

export const POST = async (req: NextRequest, { params }: { params: { id: string }}) => {
  const { id } = params;

  const buildUpdateData = (body: UpdateOrderRequest) => ({
    ...(body.status && { status: body.status}),
    ...(body.address && { address: body.address}),
  });

  try {
    const body = await req.json();
    const data = buildUpdateData(body);

    if (Object.keys(data).length > 0) {
      await prisma.order.update({
        where: {
          id
        },
        data: data,
      });
      return new NextResponse(
        JSON.stringify({ message: "Order has been updated!"}),
        { status: 200 },
      );
    }
  } catch(err) {
    console.error(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!"}),
      { status: 500 },
    )
  }
}