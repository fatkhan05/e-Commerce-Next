import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {

    if (!params.productId) {
      return new NextResponse("Product id kosong", { status: 400 });
    }

    const product = await db.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
        category: true
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_GET", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string, productId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, price, categoryId, images, isFeatured, isArchived } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Nama perlu diisi", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("Image perlu diisi", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Harga perlu diisi", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("Kategori perlu diisi", { status: 400 });
    }

    if (!params.productId) {
      return new NextResponse("Product id dibutuhkan", { status: 400 });
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

    await db.product.update({ // pengecekan apakah id sama dengan bannerId dari parameter
      where: {
        id: params.productId,
      },
      data: {
        name,
        price,
        isFeatured,
        isArchived,
        categoryId,
        images: {
          deleteMany: {}
        },
      },
    });

    const product = await db.product.update({
      where: {
        id: params.productId
      },
      data: {
        images: {
          createMany: {
            data: [
              ...images.map((image: { url: string}) => image)
            ]
          }
        }
      }
    })

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_PATCH", error);
    return new NextResponse("internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string, productId: string} }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.productId) {
      return new NextResponse("Product id tidak boleh kosong", { status: 400 });
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

    const product = await db.product.deleteMany({
      where: {
        id: params.productId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_DELETE", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
