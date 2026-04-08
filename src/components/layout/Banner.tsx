"use client"

import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import styles from "./banner.module.css"

const bannerImages = [
  "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1600&q=80",
  "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=1600&q=80",
  "https://images.unsplash.com/photo-1525811902-f2342640856e?w=1600&q=80",
  "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=1600&q=80",
]

export default function Banner() {
  const [imgIndex, setImgIndex] = useState(0)
  const router = useRouter()
  const { data: session } = useSession()

  const handleBannerClick = () => {
    setImgIndex((prev) => (prev + 1) % bannerImages.length)
  }

  return (
    <div
      className={styles.banner}
      style={{ marginTop: "-1px", cursor: "pointer" }}
      onClick={handleBannerClick}
    >
      <Image
        src={bannerImages[imgIndex]}
        alt="Campground banner"
        fill
        priority
        loading="eager"
        unoptimized
        sizes="100vw"
        className={styles.bannerImage}
      />
      <div className={styles.overlay} />

      <div className={styles.content}>
        <div className={styles.tagline}>✦ PREMIUM CAMPGROUNDS ✦</div>
        <h1 className={styles.title}>where nature meets comfort</h1>
        <p className={styles.subtitle}>
          Finding the perfect campground has never been easier. Whether it&apos;s a
          mountain retreat, lakeside escape, or forest hideaway — we connect you
          to the perfect place.
        </p>
        <div className={styles.divider} />
      </div>

      {session && (
        <div
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            color: "#c9a84c",
            fontFamily: "'Georgia', serif",
            fontSize: "1rem",
            fontWeight: "bold",
            zIndex: 10,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          Welcome {session.user?.name}
        </div>
      )}
    </div>
  )
}