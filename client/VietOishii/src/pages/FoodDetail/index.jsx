import { Button, Card, Rate, Typography, Row, Col } from "antd";
import { HeartOutlined, ArrowLeftOutlined, UserOutlined } from "@ant-design/icons";
// import "./FoodDetails.css";

const { Paragraph, Title, Text } = Typography;

const FoodDetail = () => {
  const userReviews = [
    { name: "Nguyễn Văn A", rating: 4, comment: "Món ăn rất ngon, hương vị đậm đà." },
    { name: "Trần Thị B", rating: 5, comment: "Thích cách trình bày và nguyên liệu rất tươi!" },
  ];

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ padding: "20px", width: "70%" }}>
        {/* Header */}
        <Button icon={<ArrowLeftOutlined />} type="text" style={{ marginBottom: "20px" }}>
          Chi tiết món ăn
        </Button>

        {/* Main Content */}
        <Card style={{ width: "100%" }}>
          <Row gutter={[16, 16]}>
            {/* Image Section */}
            <Col xs={24} md={10}>
              <div>
                <div
                  style={{
                    width: "100%",
                    height: "200px",
                    background: "#f0f0f0",
                    borderRadius: "8px",
                    overflow: "hidden", // Đảm bảo không vượt khung
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {/* Thêm thẻ ảnh */}
                  <img
                    src="https://via.placeholder.com/200x200" // Link ảnh mẫu
                    alt="Food"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover", // Đảm bảo giữ tỷ lệ và che khung
                    }}
                  />
                </div>
                
                <div style={{ marginTop: "20px", textAlign: "center" }}>
                  {["Vùng 1", "Vùng 2", "Vùng 3"].map((region) => (
                    <Button key={region} style={{ margin: "5px" }}>
                      {region}
                    </Button>
                  ))}
                </div>
              </div>
            </Col>

            {/* Right-side Information */}
            <Col xs={24} md={14}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Title level={4} style={{ marginTop: 0 }}>Tên món ăn</Title>
                  <Button type="text" icon={<HeartOutlined />} />
                </div>
                <Paragraph>
                  Đây là món ăn trưa yêu thích của người Hà Nội
                </Paragraph>
                <Paragraph>
                  Hương vị: Ngọt, chua nhẹ
                </Paragraph>
                <Paragraph>
                  Món ăn Nhật Bản tương tự: Sushi
                </Paragraph>
              </div>
            </Col>
          </Row>

          {/* Ingredients Section */}
          <div style={{ marginTop: "30px", padding: "20px", background: "#fafafa", borderRadius: "8px" }}>
            <Title level={5} style={{ borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>Thành phần</Title>
            <Paragraph>
              Gạo, thịt gà, rau thơm, nước mắm
            </Paragraph>
            <Text type="danger">
              Chú ý một số thành phần gây dị ứng/ khó ăn: Lạc (đậu phộng)
            </Text>
          </div>

          {/* Ratings Section */}
          <div style={{ marginTop: "30px", padding: "20px", background: "#f9f9f9", borderRadius: "8px" }}>
            <Title level={5} style={{ borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>Đánh giá</Title>
            {userReviews.map((user, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "20px",
                  padding: "10px",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                  <UserOutlined style={{ fontSize: "20px", marginRight: "10px" }} />
                  <Text style={{ flex: 1, fontWeight: "bold" }}>{user.name}</Text>
                  <Rate disabled defaultValue={user.rating} />
                </div>
                <Paragraph style={{ marginLeft: "30px", color: "gray" }}>
                  {user.comment}
                </Paragraph>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FoodDetail;
