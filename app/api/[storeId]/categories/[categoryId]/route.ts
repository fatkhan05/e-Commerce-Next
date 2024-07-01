import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { bannerId: string } }
) {
  try {

    if (!params.bannerId) {
      return new NextResponse("Banner id kosong", { status: 400 });
    }

    const banner = await db.banner.findUnique({
      where: {
        id: params.bannerId,
      },
    });

    return NextResponse.json(banner);
  } catch (error) {
    console.log("[BANNER_GET", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string, bannerId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { label, imageUrl } = body;
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!label) {
      return new NextResponse("Harus menginputkan label", { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse("Harus menginputkan imageUrl", { status: 400 });
    }

    if (!params.bannerId) {
      return new NextResponse("Banner id dibutuhkan", { status: 400 });
    }

    const storeByUserId = await db.store.findFirst({
      where: {
        id: params.storeId, // nama kolom dan valuenya
        userId: userId, // nama kolom dan valuenya
      },
    });

    if (!storeByUserId) { // jika user toko tidak sesuai dengan storeId, tampilkan error
      return new NextResponse("Unautorized", { status:  403})
    }

    const banner = await db.banner.updateMany({ // pengecekan apakah id sama dengan bannerId dari parameter
      where: {
        id: params.bannerId,
      },
      data: {
        label,
        imageUrl,

      },
    });

    return NextResponse.json(banner);
  } catch (error) {
    console.log("[BANNER_PATCH", error);
    return new NextResponse("internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string, bannerId: string} }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.bannerId) {
      return new NextResponse("Banner id tidak boleh kosong", { status: 400 });
    }

    const storeByUserId = await db.store.findFirst({
      where: {
        id: params.storeId, // nama kolom dan valuenya
        userId: userId, // nama kolom dan valuenya
      },
    });

    if (!storeByUserId) {
      // jika user toko tidak sesuai dengan storeId, tampilkan error
      return new NextResponse("Unautorized", { status: 403 });
    }

    const banner = await db.banner.deleteMany({
      where: {
        id: params.bannerId,
      },
    });

    return NextResponse.json(banner);
  } catch (error) {
    console.log("[BANNER_DELETE", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
