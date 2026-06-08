import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const PromptCreatePage = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        content: "",
        preview: "",
        thumbnailUrl: "",
        price: 0,
        category: "BACKEND",
        aiType: "GPT4",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: name === "price" ? Number(value) : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // userId는 백엔드에서 아직 JWT 연동 전이라 임시로 1 사용
            const response = await fetch("http://localhost:8080/api/prompts?userId=1", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(form),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("등록 실패:", errorText);
                alert("프롬프트 등록에 실패했습니다.");
                return;
            }

            alert("프롬프트가 등록되었습니다.");
            navigate("/");
        } catch (error) {
            console.error("프롬프트 등록 에러:", error);
            alert("서버와 통신할 수 없습니다.");
        }
    };

    return (
        <div style={{ padding: "40px", color: "white" }}>
            <h1 style={{ marginBottom: "24px" }}>프롬프트 등록</h1>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "600px" }}>
                <input
                    name="title"
                    placeholder="제목"
                    value={form.title}
                    onChange={handleChange}
                    style={{ padding: "12px" }}
                />

                <textarea
                    name="preview"
                    placeholder="미리보기"
                    value={form.preview}
                    onChange={handleChange}
                    rows={4}
                    style={{ padding: "12px" }}
                />

                <textarea
                    name="content"
                    placeholder="실제 프롬프트 내용"
                    value={form.content}
                    onChange={handleChange}
                    rows={8}
                    style={{ padding: "12px" }}
                />

                <input
                    name="thumbnailUrl"
                    placeholder="썸네일 URL"
                    value={form.thumbnailUrl}
                    onChange={handleChange}
                    style={{ padding: "12px" }}
                />

                <input
                    name="price"
                    type="number"
                    min="0"
                    placeholder="가격"
                    value={form.price}
                    onChange={handleChange}
                    style={{ padding: "12px" }}
                />

                <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    style={{ padding: "12px" }}
                >
                    <option value="BACKEND">백엔드</option>
                    <option value="FRONTEND">프론트엔드</option>
                    <option value="AI">AI</option>
                    <option value="DB">DB</option>
                    <option value="ETC">기타</option>
                </select>

                <select
                    name="aiType"
                    value={form.aiType}
                    onChange={handleChange}
                    style={{ padding: "12px" }}
                >
                    <option value="GPT4">GPT-4</option>
                    <option value="CLAUDE">Claude</option>
                    <option value="GEMINI">Gemini</option>
                    <option value="ETC">기타</option>
                </select>

                <button
                    type="submit"
                    style={{
                        padding: "12px",
                        background: "#7c3aed",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                    }}
                >
                    등록
                </button>
            </form>
        </div>
    );
};