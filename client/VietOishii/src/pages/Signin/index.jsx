import { Button, Input, Typography, Form, message } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import UserService from '../../services/UserService';
import { useNavigate } from 'react-router-dom';

const SigninPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await UserService.signin(values.username, values.password);
      console.log('Logged in successfully:', response);
      message.success('Đăng nhập thành công!');
      navigate('/'); 
    } catch (error) {
      console.error('Error logging in:', error);
      message.error('Đăng nhập thất bại. Vui lòng kiểm tra lại tên đăng nhập và mật khẩu.');
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <div
        style={{
          width: "400px",
          padding: "30px",
          borderRadius: "10px",
          backgroundColor: "#ffffff",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography.Title level={3} style={{ textAlign: "center", color: "#ff4d4f" }}>
          Đăng nhập
        </Typography.Title>
        <Form
          form={form}
          name="signin"
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            label="Tên Đăng nhập"
            name="username"
            rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
          >
            <Input placeholder="Tên Đăng nhập" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password
              placeholder="Mật khẩu"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              style={{ backgroundColor: "#ff4d4f", borderColor: "#ff4d4f" }}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
        <Typography.Text style={{ display: "block", textAlign: "center" }}>
          Chưa có tài khoản?{" "}
          <a href="/signup" style={{ color: "#ff4d4f" }}>Đăng ký ngay</a>
        </Typography.Text>
      </div>
    </div>
  );
};

export default SigninPage;