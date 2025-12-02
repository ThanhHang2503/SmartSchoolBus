"use client";

import { Box, Typography } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function HomePage() {
  const { t } = useTranslation('common');
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    fade: true,
    pauseOnHover: false,
    adaptiveHeight: false, 
  };

  const images = ["/image/pic1.jpg", "/image/pic2.jpg"];

  return (
    <Box
      sx={{
        flex: 1,
        width: "100%",
        height: "100%", // Không dùng 100vh → khớp với vùng nội dung
        overflow: "hidden",
        position: "relative",
        // Đảm bảo không bị thanh cuộn
        "& .slick-slider, & .slick-list, & .slick-track, & .slick-slide > div": {
          height: "100%",
        },
        "& .slick-slide img": {
          width: "100%",
          height: "100%",
          objectFit: "cover",
        },
      }}
    >
      {/* Slider */}
      <Slider {...settings}>
        {images.map((src, index) => (
          <Box
            key={index}
            sx={{
              height: "100%",
              width: "100%",
            }}
          >
            <Box
              component="img"
              src={src}
              alt={`Banner ${index + 1}`}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "brightness(70%)",
                display: "block",
              }}
            />
          </Box>
        ))}
      </Slider>

      {/* Overlay Text – Responsive + Luôn giữa */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: "white",
          textAlign: "center",
          zIndex: 10,
          px: { xs: 2, sm: 3 },
          maxWidth: "90%",
          width: "100%",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 600,
              letterSpacing: "1.5px",
              textShadow: "0 4px 15px rgba(0,0,0,0.6)",
              fontFamily: "'Playfair Display', serif",
              fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3rem", lg: "3.5rem" },
              lineHeight: 1.2,
            }}
          >
            {t('welcomeTitle')}
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1.2 }}
        >
          <Typography
            variant="h5"
            sx={{
              mt: { xs: 1, sm: 2 },
              fontWeight: 300,
              letterSpacing: "1px",
              textShadow: "0 3px 10px rgba(0,0,0,0.5)",
              fontFamily: "'Poppins', sans-serif",
              fontSize: { xs: "0.9rem", sm: "1.1rem", md: "1.3rem" },
              lineHeight: 1.4,
            }}
          >
            {t('welcomeSubtitle')}
          </Typography>
        </motion.div>
      </Box>

      {/* Dots của slider – căn dưới, responsive */}
      <Box
        sx={{
          position: "absolute",
          bottom: { xs: 10, sm: 16 },
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          "& .slick-dots": {
            bottom: "auto",
            "& li button:before": {
              color: "white",
              opacity: 0.6,
              fontSize: { xs: "8px", sm: "10px" },
            },
            "& li.slick-active button:before": {
              opacity: 1,
              color: "white",
            },
          },
        }}
      />
    </Box>
  );
}