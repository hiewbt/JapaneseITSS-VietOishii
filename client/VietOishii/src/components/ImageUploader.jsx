import { Button } from 'antd';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { CameraOutlined } from '@ant-design/icons';
import { FileUploader } from 'react-drag-drop-files';
import axios from 'axios';
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";

const ImageUploader = ({ onUpload }) => {
  const [imageUrl, setImageUrl] = useState('');
  const { t } = useTranslation();

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default'); // Use your actual upload preset
    formData.append('cloud_name', 'vietoshi'); // Use your actual cloud name

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/vietoshi/image/upload`, // Updated with your Cloudinary cloud name
        formData
      );
      setImageUrl(response.data.secure_url);
      onUpload(response.data.secure_url);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div>
      <FileUploader handleChange={handleUpload} name="file" types={['JPG', 'PNG']}>
        <UploadButton type="default">
          <CameraOutlined style={{ marginRight: 8 }} />
          {t('upload_image')}
        </UploadButton>
      </FileUploader>
      {imageUrl && (
        <div style={{ marginTop: '10px' }}>
          <img
            src={imageUrl}
            alt="Uploaded"
            style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'cover' }}
          />
        </div>
      )}
    </div>
  );
};

ImageUploader.propTypes = {
  onUpload: PropTypes.func.isRequired,
};

const UploadButton = styled(Button)`
  &:hover,
  &:focus {
    border-color: #ff4d4f !important;
    color: #ff4d4f !important;
  }
`;

export default ImageUploader;
