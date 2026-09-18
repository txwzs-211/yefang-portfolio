import { useEffect, useRef, useState } from 'react';
import { works } from '../data/works';

const PLACEHOLDER = new Set(['——', '待补充', '待补充。', '项目介绍待补充。', '创作笔记待补充。']);
const isPlaceholder = (v) => !v || PLACEHOLDER.has(String(v).trim());
const isEmptySection = (s) => {
  if (s.h === '项目概述' && isPlaceholder(s.p)) return true;
  if (isPlaceholder(s.p) && !s.blocks?.length && !s.hl?.length) return true;
  return false;
};

export default function Modal({ workId, onClose }) {
  const work = works.find((w) => w.id === workId);
  const videoRef = useRef(null);
  const [aspectRatio, setAspectRatio] = useState('16 / 9');
  const base = import.meta.env.BASE_URL;

  useEffect(() => {
    if (workId) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('modal-open');
      const onEsc = (e) => e.key === 'Escape' && onClose();
      document.addEventListener('keydown', onEsc);
      return () => {
        document.body.style.overflow = '';
        document.body.classList.remove('modal-open');
        document.removeEventListener('keydown', onEsc);
      };
    }
  }, [workId, onClose]);

  const handleMetadata = () => {
    const v = videoRef.current;
    if (!v) return;
    if (work.portrait) {
      setAspectRatio('9 / 16');
    } else if (v.videoWidth && v.videoHeight) {
      setAspectRatio(`${v.videoWidth} / ${v.videoHeight}`);
    }
  };

  useEffect(() => { setAspectRatio('16 / 9'); }, [workId]);

  if (!work) return null;
  const d = work.detail;

  const realSections = (d.sections || []).filter((s) => !isEmptySection(s));

  return (
    <div className={`modal ${workId ? 'active' : ''}`}>
      <div className="modal-back liquid-glass" onClick={onClose}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        <span>返回</span>
      </div>
      <div className="modal-content">
        {/* 视频：原比例 */}
        <div className="modal-hero">
          {work.video ? (
            <video
              ref={videoRef}
              src={`${base}${work.video}`}
              controls
              preload="metadata"
              onLoadedMetadata={handleMetadata}
            />
          ) : (
            <div className="modal-hero-ph">{work.title}</div>
          )}
        </div>

        {/* 标签 + 标题 */}
        {!isPlaceholder(work.tag) && <div className="modal-tag">{work.tag}</div>}
        <h1 className="modal-title">{work.title}</h1>

        {/* 只有有内容时才渲染正文 */}
        {realSections.length > 0 && (
          <div className="modal-body">
            {realSections.map((section, i) => (
              <div key={i}>
                <h2>{section.h}</h2>
                {section.p && !isPlaceholder(section.p) && <p>{section.p}</p>}
                {section.blocks && section.blocks.map((b, j) => (
                  <div key={j} className="script-block">
                    <div className="st">{b.st}</div>
                    {b.dlg && <div className="dlg">{b.dlg}</div>}
                    <div>{b.text}</div>
                  </div>
                ))}
                {section.hl && section.hl.map((h, j) => (
                  <div key={j} className="hl-box">
                    <div className="hl-t">{h.t}</div>
                    <p>{h.p}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
