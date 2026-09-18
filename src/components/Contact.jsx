import { useReveal } from '../hooks/useReveal';

const contacts = [
  { label: 'Email', value: '2950593736@qq.com' },
  { label: 'Phone', value: '15308334259' },
];

export default function Contact() {
  const ref = useReveal();

  return (
    <section className="section contact" id="contact" ref={ref}>
      <div className="contact-inner">
        <div className="contact-label reveal">Get in touch</div>
        <h2 className="contact-title reveal">
          Let's <em>create</em>
          <br />
          something together.
        </h2>
        <p className="contact-sub reveal">有项目合作或技术交流需求，欢迎随时联系。</p>
        <div className="contact-cards">
          {contacts.map((c) => (
            <div key={c.label} className="contact-card liquid-glass reveal">
              <div className="contact-card-label">{c.label}</div>
              <div className="contact-card-value">{c.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
