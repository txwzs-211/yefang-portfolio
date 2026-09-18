import { useReveal } from '../hooks/useReveal';

const steps = [
  { num: '01', title: '剧本创作', desc: '故事结构、分镜设计、台词打磨' },
  { num: '02', title: '提示词工程', desc: '场景描述、风格控制、角色一致性' },
  { num: '03', title: '场景生成', desc: 'ComfyUI工作流、批量出图、质量筛选' },
  { num: '04', title: '视频生成', desc: '图生视频、运动控制、镜头语言' },
  { num: '05', title: '后期合成', desc: '剪辑、调色、音效、字幕' },
];

export default function Workflow() {
  const ref = useReveal();

  return (
    <section className="section workflow" id="workflow" ref={ref}>
      <div className="workflow-inner">
        <div className="workflow-head">
          <div>
            <div className="workflow-label reveal">Pipeline</div>
            <h2 className="workflow-title reveal">ComfyUI 工作流</h2>
          </div>
          <p className="workflow-desc reveal">
            从剧本到成片的五步AI影视生产管线，每一步都经过反复打磨。
          </p>
        </div>
        <div className="workflow-steps">
          {steps.map((step, i) => (
            <div key={step.num}>
              <div className="workflow-step liquid-glass reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="workflow-step-num">{step.num}</div>
                <div className="workflow-step-title">{step.title}</div>
                <div className="workflow-step-desc">{step.desc}</div>
              </div>
              {i < steps.length - 1 && <div className="workflow-arrow">→</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
