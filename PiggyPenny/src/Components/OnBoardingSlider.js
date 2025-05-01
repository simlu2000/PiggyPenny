import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const OnBoardingSlider = ({ handleGoogleSignIn }) => {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const steps = [
    {
      icon: "🐷",
      title: "Benvenuto su PiggyPenny!",
      description: "Tieni traccia delle tue spese in modo semplice e intuitivo.",
    },
    {
      icon: "➕",
      title: "Aggiungi le tue spese",
      description: "Inserisci importi, categorie e date con pochi click.",
    },
    {
      icon: "📊",
      title: "Analizza i tuoi risparmi",
      description: "Grafici e statistiche per migliorare la tua gestione finanziaria.",
    },
  ];

  return (
    <div style={styles.sliderContainer}>
      <Slider {...settings}>
        {steps.map((step, index) => (
          <div key={index}>
            <div style={styles.card}>
              <div style={styles.icon}>{step.icon}</div>
              <h2 style={styles.title}>{step.title}</h2>
              <p style={styles.description}>{step.description}</p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

const styles = {
  sliderContainer: {
    width: "80%",
    maxWidth: "400px",
    margin: "0 auto",
    paddingTop: "50px",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    WebkitBackdropFilter: "blur(10px)", 
    backdropFilter: "blur(10px)",   
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)", 
    borderRadius: "20px",
    padding: "30px 20px",
    textAlign: "center",
    minHeight: "280px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    transition: "transform 0.3s ease, box-shadow 0.3s ease", 
  },
  cardHover: {
    transform: "scale(1.05)", 
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)", 
  },
  icon: {
    fontSize: "40px",
    marginBottom: "15px",
  },
  title: {
    fontSize: "22px",
    marginBottom: "10px",
  },
  description: {
    fontSize: "16px",
    color: "#555",
    marginBottom: "20px",
  },
  button: {
    backgroundColor: "#4285F4",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s ease", 
  },
  buttonHover: {
    backgroundColor: "#357AE8", 
  }
};

export default OnBoardingSlider;
