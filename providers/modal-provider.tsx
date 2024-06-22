'use client'

import { StoreModal } from "@/components/modals/store-modal"
import { useEffect, useState } from "react"

export const ModalProvider = () => {
  const [isMoundted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMoundted) {
    return null
  }
  return (
    <>
      <StoreModal />
    </>
  )
}