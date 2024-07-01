import React from 'react'
import { CategoryClient } from './components/client';
import db from '@/lib/db';
import { CategoryColumn } from "./components/columns";
 
import { format } from 'date-fns'

const CategoriesPage = async ({
  params
}: {
  params: {storeId: string}
  }) => {
  
  const categories = await db.category.findMany({ // koneksi untuk ambil table category dari database
    where: {
      storeId: params.storeId // ambil banner berdasarkan kolom storeId yang sama dengan params.storeId
    },
    include: {
      banner: true,
    },
    orderBy: { // tampilkan dari urutan yang terbaru
      createdAt: 'desc'
    }
  })

  const formattedCategories: CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    bannerLabel: item.banner.label,
    createdAt: format(item.createdAt, "do MMM yyyy"),
  }));
  
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  );
}

export default CategoriesPage;