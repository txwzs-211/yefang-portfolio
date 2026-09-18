export default function Nav({ onNavigate, activeSection }) {
  const links = [
    { id: 'about', label: '个人简介' },
    { id: 'works', label: '视频作品' },
    { id: 'tech', label: '技术美术' },
    { id: 'contact', label: '联系' },
  ];

  return (
    <nav className="nav">
      <div className="nav-inner liquid-glass">
        <div className="nav-left">
          <div className="nav-brand" onClick={() => onNavigate('hero')}>YE FANG</div>
          <div className="nav-links">
            {links.map((link) => (
              <a
                key={link.id}
                className={activeSection === link.id ? 'active' : ''}
                onClick={() => onNavigate(link.id)}
              >{link.label}</a>
            ))}
          </div>
        </div>
        <div className="nav-right">
          <a className="nav-cta-text" onClick={() => onNavigate('contact')}>联系我</a>
          <a className="nav-cta liquid-glass" onClick={() => onNavigate('works')}>查看作品</a>
        </div>
      </div>
    </nav>
  );
}
