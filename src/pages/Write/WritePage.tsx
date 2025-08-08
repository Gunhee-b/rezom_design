import { useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function WritePage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const question = useMemo(() => {
    const q = params.get('q')?.trim();
    return q && q.length > 0
      ? q
      : 'Write your own perspective to the prompt.';
  }, [params]);

  const [title, setTitle] = useState('');
  const [body, setBody]   = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API 연동 전까지 데모 저장/전송
    console.log('SUBMIT', { title, body, question });
    alert('Saved (demo).');
    navigate(-1); // 이전 화면으로
  };

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-4xl px-4 pt-10 pb-16">
        {/* Q 라벨 */}
        <div className="text-center mb-4">
          <div className="text-[64px] leading-none font-extrabold select-none">Q</div>
        </div>

        {/* 질문 전문 */}
        <blockquote className="text-center text-2xl md:text-[28px] font-semibold leading-snug mb-10">
          “{question}”
        </blockquote>

        {/* 작성 폼 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title 바 (둥근 캡 + 그림자 느낌) */}
          <label className="block">
            <span className="sr-only">Title</span>
            <div className="rounded-full bg-neutral-200/80 shadow-sm px-6 py-3 inline-block">
              <span className="font-bold mr-3">Title :</span>
              <input
                className="bg-transparent outline-none w-[60vw] max-w-[640px]"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </label>

          {/* 본문 큰 카드 */}
          <div className="rounded-[32px] bg-white shadow-xl px-6 py-4 md:px-8 md:py-6">
            <textarea
              className="w-full min-h-[38vh] md:min-h-[46vh] outline-none resize-vertical text-base leading-relaxed"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Start writing here..."
            />
          </div>

          {/* 하단 버튼 (센터) */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              className="rounded-full border border-black px-6 py-2 text-sm font-semibold hover:bg-black hover:text-white transition"
              title="Finish and save"
            >
              Finished writing
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}