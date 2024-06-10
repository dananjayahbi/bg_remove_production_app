import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spin } from "antd";
import axios from "axios";
import HeaderComp from "../components/HeaderComp";
import Footer from "../components/Footer";

const Gallery = () => {
  const isLogged = window.localStorage.getItem("LoggedIn");
  if (!isLogged) {
    // Redirect to login page if not logged in
    window.location.href = "/login";
  }

  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.get(
          `http://localhost:5000/api/users/getUserById/${userId}`
        );
        console.log(response.data);
        setGalleryItems(response.data.gallery);
      } catch (error) {
        console.error("Failed to fetch gallery items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryItems();
  }, []);

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div>
      <HeaderComp />
      <Row gutter={[16, 16]}>
        {galleryItems.map((item, index) => (
          <Col key={index} xs={24} sm={12} md={8}>
            <Card
              hoverable
              cover={<img alt={`Gallery item ${index}`} src={item.url} />}
            />
          </Col>
        ))}
      </Row>
      <Footer />
    </div>
  );
};

export default Gallery;
