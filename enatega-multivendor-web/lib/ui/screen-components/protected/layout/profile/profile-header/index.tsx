"use client"
import TextComponent from '@/lib/ui/useable-components/text-field'
import { useTranslations } from 'next-intl'
import React from 'react'

export default function ProfileHeader() {
  const t = useTranslations()
  return (
  <div className='w-full flex justify-between'>
     <TextComponent text={t("ProfileSection.profile_label")} className='font-semibold md:text-3xl text-xl'/>
  </div>
  )
}
