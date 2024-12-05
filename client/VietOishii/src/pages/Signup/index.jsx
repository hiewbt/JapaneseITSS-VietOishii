import { Button, Input, Typography, Form } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';
import UserService from '../../services/UserService';

const SignupPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await UserService.signup(values);
      console.log('Signed up successfully:', response);
      navigate('/signin'); 
    } catch (error) {
      console.error('Error signing up:', error);
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
          Đăng ký
        </Typography.Title>
        <Form
          form={form}
          name="signup"
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            label="Tên đăng nhập"
            name="username"
            rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
          >
            <Input placeholder="Tên đăng nhập" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Vui lòng nhập email" }]}
          >
            <Input placeholder="Email" />
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
              Đăng ký
            </Button>
          </Form.Item>
        </Form>
        <Typography.Text style={{ display: "block", textAlign: "center" }}>
          Đã có tài khoản?{" "}
          <a href="/signin" style={{ color: "#ff4d4f" }}>
            Đăng nhập
          </a>
        </Typography.Text>
      </div>
    </div>
  );
};

export default SignupPage;