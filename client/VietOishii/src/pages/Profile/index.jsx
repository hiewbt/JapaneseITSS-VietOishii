import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Layout, Row, Col, Card, Avatar, Menu, Input, Button, Divider, Form, notification } from "antd";

const { Sider, Content } = Layout;

const ProfilePage = () => {
    const { t } = useTranslation();
    const [selectedKey, setSelectedKey] = useState("profile");
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "Bùi Thế Hiếu",
        email: "Hieu.bt215047@sis.hust.edu.vn",
        phoneNumber: "0123456789",
        sex: "Nam",
        dateOfbirth: "01/01/2000",
    });
    const userName = "Bùi Thế Hiếu";
    const fields = [
        { label: "Tên", name: "name" },
        { label: "Email", name: "email" },
        { label: "Số điện thoại", name: "phoneNumber" },
        { label: "Giới tính", name: "sex" },
        { label: "Ngày sinh", name: "dateOfbirth" },
    ];
    const [avatarUrl, setAvatarUrl] = useState("https://picsum.photos/200");

    const handleMenuClick = (e) => {
        setSelectedKey(e.key);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const toggleEdit = () => {
        if (isEditing) {
            // Gửi yêu cầu cập nhật về server (giả lập console log)
            console.log("Cập nhật thông tin:", formData);
        }
        setIsEditing(!isEditing);
    };

    const handleAvatarChange = () => {
        // Logic để thay đổi ảnh đại diện
        alert("Chức năng cập nhật ảnh đại diện!");
    };



    const [passwordFormData, setPasswordFormData] = useState({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
  });

  const handlePasswordInputChange = (e) => {
      const { name, value } = e.target;
      setPasswordFormData({
          ...passwordFormData,
          [name]: value,
      });
  };

  const handleSubmit = () => {
      const { oldPassword, newPassword, confirmPassword } = passwordFormData;
      if (newPassword !== confirmPassword) {
          notification.error({
              message: "Mật khẩu xác nhận không khớp",
          });
          return;
      }

      if (oldPassword === "" || newPassword === "" || confirmPassword === "") {
          notification.error({
              message: "Vui lòng điền đầy đủ thông tin",
          });
          return;
      }

      // Xử lý đổi mật khẩu ở đây (gửi request API hoặc cập nhật dữ liệu)
      notification.success({
          message: "Đổi mật khẩu thành công",
      });
  };

    const renderContent = () => {
        switch (selectedKey) {
            case "profile":
                return (
                    <div>
                        <h2 style={{ marginTop: "20px"}}>Hồ sơ của tôi</h2>
                        <p>Quản lý thông tin hồ sơ</p>
                        <Divider />
                        <Row gutter={16}>
                            <Col
                                span={18}
                                style={{
                                    borderRight: "1px solid #d9d9d9",
                                    paddingRight: "40px",
                                }}
                            >
                                {/* Phần bên trái */}
                                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                    {fields.map((field) => (
                                        <div key={field.name} style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                                            <span
                                                style={{
                                                    fontWeight: "bold",
                                                    width: "200px",
                                                    display: "inline-block",
                                                    border: "1px solid #d9d9d9",
                                                    borderRadius: "5px",
                                                    backgroundColor: "#f0f2f5",
                                                    textAlign: "center",
                                                    lineHeight: "30px",
                                                    height: "30px",
                                                    marginLeft: "100px",
                                                    marginRight: "100px",
                                                }}
                                            >
                                                {field.label}
                                            </span>
                                            <div style={{ width: "50%", display: "flex", alignItems: "center" }}>{isEditing ? <Input name={field.name} value={formData[field.name]} onChange={(e) => handleInputChange(e, field.name)} style={{ width: "70%" }} /> : <span>{formData[field.name]}</span>}</div>
                                        </div>
                                    ))}

                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                        <Button type="primary" style={{ backgroundColor: "#ffcccc", color: "#a10000", width: "20%" }} onClick={toggleEdit}>
                                            {isEditing ? "Xác nhận" : "Cập nhật"}
                                        </Button>
                                    </div>
                                </div>
                            </Col>
                            <Col span={6}>
                                {/* Phần bên phải */}
                                <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                                    <Avatar size={128} src={avatarUrl} />
                                    <Button style={{ marginTop: "16px" }} onClick={handleAvatarChange}>
                                        Chọn ảnh
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </div>
                );
            case "changePassword":
                return (
                <div style={{ padding: "20px" }}>
                <h2>Đổi Mật Khẩu</h2>
                <Form
                    layout="vertical"
                    onFinish={handleSubmit}
                    style={{ maxWidth: "400px", margin: "0 auto" }}
                >
                    <Form.Item label="Mật khẩu cũ" required>
                        <Input.Password
                            name="oldPassword"
                            value={passwordFormData.oldPassword}
                            onChange={handlePasswordInputChange}
                            placeholder="Nhập mật khẩu cũ"
                        />
                    </Form.Item>
    
                    <Form.Item label="Mật khẩu mới" required>
                        <Input.Password
                            name="newPassword"
                            value={passwordFormData.newPassword}
                            onChange={handlePasswordInputChange}
                            placeholder="Nhập mật khẩu mới"
                        />
                    </Form.Item>
    
                    <Form.Item label="Xác nhận mật khẩu mới" required>
                        <Input.Password
                            name="confirmPassword"
                            value={passwordFormData.confirmPassword}
                            onChange={handlePasswordInputChange}
                            placeholder="Nhập lại mật khẩu mới"
                        />
                    </Form.Item>
    
                    <Form.Item>
                        <Button type="primary" style={{ backgroundColor: "#ffcccc", color: "#a10000", width: "100%" }} htmlType="submit" block>
                            Xác nhận
                        </Button>
                    </Form.Item>
                </Form>
            </div>);
            default:
                return <p>Chọn một phần để xem nội dung</p>;
        }
    };

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider width="20%" style={{ background: "#f0f2f5", padding: "10px" }}>
                <Row gutter={[16, 16]} style={{ height: "100%" }}>
                    <Col span={24}>
                        <Card style={{ height: "100%" }}>
                            <Row gutter={16} style={{ marginBottom: "20px" }}>
                                <Col span={8} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <Avatar size={48} src={avatarUrl} />
                                </Col>
                                <Col span={16} style={{ display: "flex", alignItems: "center" }}>
                                    <span>{userName}</span>
                                </Col>
                            </Row>
                            <Menu mode="inline" selectedKeys={[selectedKey]} onClick={handleMenuClick} style={{ height: "100%", borderRight: 0 }}>
                                <Menu.Item
                                    key="profile"
                                    style={{
                                        backgroundColor: selectedKey === "profile" ? "#ffcccc" : "transparent",
                                        color: selectedKey === "profile" ? "#a10000" : "black",
                                    }}
                                >
                                    Hồ sơ
                                </Menu.Item>
                                <Menu.Item
                                    key="changePassword"
                                    style={{
                                        backgroundColor: selectedKey === "changePassword" ? "#ffcccc" : "transparent",
                                        color: selectedKey === "changePassword" ? "#a10000" : "black",
                                    }}
                                >
                                    Đổi mật khẩu
                                </Menu.Item>
                            </Menu>
                        </Card>
                    </Col>
                </Row>
            </Sider>
            <Layout style={{ padding: "0 24px 10px 24px" }}>
                <Content style={{ padding: "24px", background: "white", marginTop: "10px", paddingTop: "10px", borderRadius: "10px" }}>{renderContent()}</Content>
            </Layout>
        </Layout>
    );
};

export default ProfilePage;
