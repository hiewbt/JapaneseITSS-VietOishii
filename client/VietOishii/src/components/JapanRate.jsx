import { Typography } from 'antd';
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import happyImage from '../assets/like.png';
import sadImage from '../assets/hate.png';
import PropTypes from 'prop-types';
import { useState } from 'react';
import axios from 'axios';

const { Title } = Typography;



const JapanRate = ({ id, j_like = 0, j_dislike = 0 }) => {
    const { t } = useTranslation();
    const [likes] = useState(j_like);
    const [dislikes] = useState(j_dislike);

    const handleVote = async (type) => {
        try {
            const endpoint = type === 'like' ? `${import.meta.env.VITE_API_URL}/j_like` : `${import.meta.env.VITE_API_URL}/j_dislike`;
            await axios.post(endpoint, { dish_id: id });

        } catch (error) {
            console.error('Error voting:', error);
        }
    };

    return (
        <div>
            <Title level={4} style={{ paddingBottom: "5px" }}>
                {t('Người Nhật có hài lòng với món ăn này không ?')}
            </Title>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '200px', marginTop: 40 }}>
                <ImageContainer>
                    <Image 
                        src={happyImage} 
                        alt="Happy" 
                        onClick={() => handleVote('like')}
                    />
                    <Typography.Text style={{ fontSize: '18px', marginTop: 15 }}>{t('Hài lòng')}</Typography.Text>
                    <Circle>{likes}</Circle>
                </ImageContainer>
                <ImageContainer>
                    <Image 
                        src={sadImage} 
                        alt="Sad" 
                        onClick={() => handleVote('dislike')}
                    />
                    <Typography.Text style={{ fontSize: '18px', marginTop: 15 }}>{t('Không hài lòng')}</Typography.Text>
                    <Circle>{dislikes}</Circle>
                </ImageContainer>
            </div>
        </div>
    );
};

JapanRate.propTypes = {
    id: PropTypes.number.isRequired,
    j_like: PropTypes.number,
    j_dislike: PropTypes.number
};
const Image = styled.img`
    width: 100px;
    height: 100px;
    transition: transform 0.3s;
    &:hover {
        transform: scale(1.15);
    }
`;

const ImageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
`;

const Circle = styled.div`
    width: 30px;
    height: 30px;
    background-color: #f0f0f0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: -40px;
    top: 35px;
    font-weight: 500;
`;
export default JapanRate;