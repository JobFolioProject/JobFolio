import React, { useState } from 'react';
import '../../css/mainPage/MainEmail.css';

const MainEmail =() => {

    const [formData, setFormData] = useState({
        name: '',
        role: '',
        email: '',
        industry: '',
        message: ''
      });

      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
          ...prevData,
          [name]: value
        }));
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
    
        // EmailJS에 보내는 데이터 객체
        const data = {
          service_id: process.env.REACT_APP_MAIL_SERVICE_ID,
          template_id: process.env.REACT_APP_MAIL_TEMPLATE_ID,
          user_id: process.env.REACT_APP_MAIL_USER_ID,
          template_params: {
            name: formData.name,
            role: formData.role,
            email: formData.email,
            industry: formData.industry,
            message: formData.message
          }
        };
    
        try {
            const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
            });
        
            const responseText = await response.text();  // 응답을 텍스트로 받아보기
            
            // 응답이 JSON 형식이 아니면 텍스트 응답을 그대로 처리
            if (response.ok) {
              window.location.reload();
              alert('Your mail is sent!');
            } else {
              console.error('Error:', responseText);  // 에러 응답 내용 출력
              alert('Oops... ' + responseText);
            }
          } catch (error) {
            alert('Error sending email: ' + error);
          }

        };

    return (
        <div className="main-email"> 
            <form className="box" onSubmit={handleSubmit}>
                <div className="text">
                    <p className="title">CONTECT</p>
                    양식을 작성해 이메일을 보내주세요.<br/>
                    성공적인 이력서를 위해 어떻게 도와드릴 수 있을지 함께 이야기해요!
                </div>
                <input type="text" name="name" placeholder="이름" value={formData.name} onChange={handleChange} required/>
                <input type="text" name="industry" placeholder="소속기관" value={formData.industry} onChange={handleChange} required/>
                <input type="text" name="role" placeholder="직책 및 역할" value={formData.role} onChange={handleChange} required/>
                <input type="email" name="email" placeholder="이메일" value={formData.email} onChange={handleChange} required/>
                <textarea name="message" placeholder="내용을 입력하세요" value={formData.message} onChange={handleChange} required></textarea>
                <button type="submit">문의하기 ▶▶</button>
            </form>
        </div>
    )
}
export default MainEmail;