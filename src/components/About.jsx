import { useReveal } from '../hooks/useReveal';

const base = import.meta.env.BASE_URL;

const stats = [
  { num: '10+', label: 'AI工具上线' },
  { num: '2000+', label: '美术用户在用' },
  { num: '4600万', label: '全网作品播放' },
];

const tags = ['技术美术', 'ComfyUI', '提示词工程', 'AI影视创作'];

const contact = {
  email: '2950593736@qq.com',
  phone: '15308334259',
};

const strengths = [
  {
    num: '01',
    title: '技术+美术复合背景',
    desc: '能独立完成从方案设计到效果验证的全链路',
  },
  {
    num: '02',
    title: 'AI管线工程师思维',
    desc: '把AI产出升级为可复用、可验收、可交接的标准化生产管线',
  },
  {
    num: '03',
    title: 'AI导演与内容创作思维',
    desc: '从选题、分镜到成片落地，把AI技术转化为有传播力的内容',
  },
];

const timeline = [
  {
    period: '2026.05 — 至今',
    company: '腾讯娱乐互动',
    role: 'AI技术美术',
    desc: '参与《和平精英》AI平台建设，从需求拆解到工具上线独立闭环，10+ AI工具上线服务2000+美术与开发用户。',
  },
  {
    period: '2026.01 — 2026.04',
    company: '网易',
    role: 'AI内容创作',
    desc: '负责游戏短片与海外AI短剧全流程。《率土之滨》AI短片全平台27万播放，《七日世界》B站90万播放；参与2部海外AI短剧，TikTok/YouTube总播放564万。',
  },
  {
    period: '2025.10 — 2026.01',
    company: '四川中视米卡',
    role: 'AIGC设计',
    desc: '主导AI短剧《雾隐迷案》全流程，搭建ComfyUI工作流与统一风格提示词体系，腾讯视频播放破4000万，入围腾讯视频首届AI短片创作大赛。',
  },
];

export default function About() {
  const ref = useReveal();

  return (
    <section className="section about" id="about" ref={ref}>
      <div className="about-inner">
        <div className="about-label reveal">About</div>

        {/* 主内容：左照片+下载 + 右文字 */}
        <div className="about-grid">
          {/* 左：照片（下载按钮悬浮在右下角） */}
          <div className="reveal-left">
            <div className="about-photo-slot">
              <img src={`${base}assets/photo.webp`} alt="叶芳" className="about-photo-img" />
              <div className="about-photo-overlay">
                <a href="叶芳-27届.pdf" download="叶芳-27届.pdf" title="下载简历">
                  <button className="about-download-circle">
                    <span>简历</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  </button>
                </a>
              </div>
            </div>
          </div>

          {/* 右：文字 + 联系方式 + 优势 */}
          <div className="reveal-right">
            <div className="about-text">
              <p className="about-tagline">技术是我的画笔，AI 是我的剧场。</p>
              <p>
                我是叶芳，一个把技术和创作接在一起的人——从ComfyUI工作流到可上线的AI工具，从分镜草图到成片交付，一个人走完从想法到结果的全程。
              </p>
              <p>
                在腾讯做《和平精英》AI平台时，我把美术生产中的重复环节封装成10+个工具，服务2000+美术与开发用户；在《率土之滨》《七日世界》里，我用AI短片和海外影视剧探索新的生产方式，全网播放超4600万。
              </p>
            </div>
            <div className="about-tags">
              {tags.map((tag) => (
                <span key={tag} className="about-tag liquid-glass">{tag}</span>
              ))}
            </div>

            {/* 个人优势 */}
            <div className="about-strengths">
              <div className="strengths-head">
                <span className="strengths-label">个人优势</span>
                <span className="strengths-en">STRENGTHS</span>
              </div>
              <div className="strengths-grid">
                {strengths.map((s) => (
                  <div key={s.num} className="strength-card liquid-glass">
                    <div className="strength-title-row">
                      <span className="strength-num">{s.num}</span>
                      <div className="strength-title">{s.title}</div>
                    </div>
                    <div className="strength-desc">{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 职业经历 */}
        <div className="about-timeline reveal">
          <div className="timeline-head">
            <span className="timeline-label">职业经历</span>
            <span className="timeline-en">CAREER PATH</span>
          </div>
          <div className="timeline-list">
            {timeline.map((item) => (
              <div key={item.company} className="timeline-item">
                <div className="timeline-period">{item.period}</div>
                <div className="timeline-body">
                  <div className="timeline-company-row">
                    <span className="timeline-company">{item.company}</span>
                    <span className="timeline-role">{item.role}</span>
                  </div>
                  <p className="timeline-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 数据统计 — 横排一行 */}
        <div className="about-stats-row reveal">
          {stats.map((stat) => (
            <div key={stat.label} className="about-stat-item">
              <div className="about-stat-num">{stat.num}</div>
              <div className="about-stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
