import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request, 
  {params} : {params : {storeId: string}}
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, bannerId } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Nama kategori perlu diisi", { status: 400 });
    }

    if (!bannerId) {
      return new NextResponse("Banner perlu diisi", { status: 400 });
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

    const category = await db.category.create({
      data: {
        name,
        bannerId,
        storeId: params.storeId,
        // updatedAt: new Date(),
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORIES_POST", error);
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
    const categories = await db.category.findMany({
      where: {
        storeId: params.storeId
      }
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.log("[CATEGORIES_POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
