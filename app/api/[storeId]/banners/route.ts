import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request, 
  {params} : {params : {storeId: string}}
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { label, imageUrl } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!label) {
      return new NextResponse("Nama banner perlu diisi", { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse("Image banner perlu diisi", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id URL tidak boleh kosong")
    } 

    // pengecekan apakah user toko sesuai dengan storeId
    const storeByUserId = await db.store.findFirst({
      where: {
        id: params.storeId, // nama kolom dan valuenya
        userId: userId, // nama kolom dan valuenya || {userId} saja
      },
    });

    if (!storeByUserId) { // jika user toko tidak sesuai dengan storeId, tampilkan error
      return new NextResponse("Unautorized", { status:  403})
    }

    const banner = await db.banner.create({
      data: {
        label,
        imageUrl,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(banner);
  } catch (error) {
    console.log("[BANNERS_POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {

    if (!params.storeId) {
      return new NextResponse("Store id URl tidak boleh kosong");
    }

    // mencari banner berdasarkan storeId dari parameter
    const banner = await db.banner.findMany({
      where: {
        storeId: params.storeId
      }
    });

    return NextResponse.json(banner);
  } catch (error) {
    console.log("[BANNERS_POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
