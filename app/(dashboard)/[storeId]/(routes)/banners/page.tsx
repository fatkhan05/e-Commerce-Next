import React from 'react'
import { BannerClient } from './components/client';

const bannerPage = () => {
  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <BannerClient />
      </div>
    </div>
  )
}

export default bannerPage;