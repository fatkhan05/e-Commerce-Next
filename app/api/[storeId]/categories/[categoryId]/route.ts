import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {

    if (!params.categoryId) {
      return new NextResponse("Banner id kosong", { status: 400 });
    }

    const category = await db.category.findUnique({
      where: {
        id: params.categoryId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORIES_GET", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string, categoryId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, bannerId } = body;
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Harus menginputkan namaa", { status: 400 });
    }

    if (!bannerId) {
      return new NextResponse("Harus menginputkan Banner", { status: 400 });
    }

    if (!params.categoryId) {
      return new NextResponse("Category id dibutuhkan", { status: 400 });
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

    const category = await db.category.updateMany({ // pengecekan apakah id sama dengan bannerId dari parameter
      where: {
        id: params.categoryId,
      },
      data: {
        name,
        bannerId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORY_PATCH", error);
    return new NextResponse("internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string, categoryId: string} }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.categoryId) {
      return new NextResponse("Category id tidak boleh kosong", { status: 400 });
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

    const category = await db.category.deleteMany({
      where: {
        id: params.categoryId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORY_DELETE", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
