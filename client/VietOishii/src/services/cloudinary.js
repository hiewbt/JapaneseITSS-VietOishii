import { Cloudinary } from '@cloudinary/url-gen';

const cloudinary = new Cloudinary({
  cloud: {
    cloudName: 'vietoshi', // Updated with your Cloudinary cloud name
  },
  url: {
    secure: true,
  },
});

export default cloudinary;
