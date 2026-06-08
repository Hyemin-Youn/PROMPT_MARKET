import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPrompt, updatePrompt } from "../api/prompts.js";

export const PromptEditPage = () => {
    const { id } = useParams();
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

    useEffect(() => {
        const fetchPrompt = async () => {
            try {
                const res = await getPrompt(id);
                const data = res.data;
                setForm({
                    title:        data.title        || "",
                    content:      data.content      || "",
                    preview:      data.preview      || "",
                    thumbnailUrl: data.thumbnailUrl || "",
                    price:        data.price        || 0,
                    category:     data.category     || "BACKEND",
                    aiType:       data.aiType       || "GPT4",
                });
            } catch (error) {
                console.error("상세 조회 에러:", error);
                alert("프롬프트 정보를 불러오지 못했습니다.");
            }
        };

        fetchPrompt();
    }, [id]);

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
            await updatePrompt(id, form);
            alert("프롬프트가 수정되었습니다.");
            navigate(`/detail/${id}`);
        } catch (error) {
            console.error("수정 에러:", error);
            alert("프롬프트 수정에 실패했습니다.");
        }
    };

    return (
        <div style={{ padding: "40px", color: "white" }}>
            <h1 style={{ marginBottom: "24px" }}>프롬프트 수정</h1>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "600px" }}>
                <input name="title" placeholder="제목" value={form.title} onChange={handleChange} style={{ padding: "12px" }} />

                <textarea name="preview" placeholder="미리보기" value={form.preview} onChange={handleChange} rows={4} style={{ padding: "12px" }} />

                <textarea name="content" placeholder="실제 프롬프트 내용" value={form.content} onChange={handleChange} rows={8} style={{ padding: "12px" }} />

                <input name="thumbnailUrl" placeholder="썸네일 URL" value={form.thumbnailUrl} onChange={handleChange} style={{ padding: "12px" }} />

                <input name="price" type="number" min="0" placeholder="가격" value={form.price} onChange={handleChange} style={{ padding: "12px" }} />

                <select name="category" value={form.category} onChange={handleChange} style={{ padding: "12px" }}>
                    <option value="BACKEND">백엔드</option>
                    <option value="FRONTEND">프론트엔드</option>
                    <option value="AI">AI</option>
                    <option value="DB">DB</option>
                    <option value="ETC">기타</option>
                </select>

                <select name="aiType" value={form.aiType} onChange={handleChange} style={{ padding: "12px" }}>
                    <option value="GPT4">GPT-4</option>
                    <option value="CLAUDE">Claude</option>
                    <option value="GEMINI">Gemini</option>
                    <option value="ETC">기타</option>
                </select>

                <button type="submit" style={{ padding: "12px", background: "#7c3aed", color: "white", border: "none", cursor: "pointer" }}>
                    수정
                </button>
            </form>
        </div>
    );
};