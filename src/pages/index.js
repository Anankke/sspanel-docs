import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.heroTag}>机场首选</div>
          <Heading as="h1" className={styles.heroTitle}>
            SSPanel-UIM
          </Heading>
          <p className={styles.heroSubtitle}>
            最强大的代理服务管理面板
          </p>
          <p className={styles.heroDescription}>
            轻松扩展 • 久经考验 • 生态完善 • 值得信赖
          </p>
          <div className={styles.buttons}>
            <Link
              className={clsx('button button--primary button--lg', styles.primaryButton)}
              to="/docs/intro">
              开始使用 →
            </Link>
            <Link
              className={clsx('button button--outline button--lg', styles.secondaryButton)}
              to="https://github.com/Anankke/SSPanel-Uim">
              <span className={styles.githubIcon}>⭐</span> GitHub
            </Link>
          </div>
        </div>
        <div className={styles.heroImage}>
          <div className={styles.terminalWindow}>
            <div className={styles.terminalHeader}>
              <span className={styles.dot}></span>
              <span className={styles.dot}></span>
              <span className={styles.dot}></span>
              <span className={styles.terminalTitle}>terminal</span>
            </div>
            <div className={styles.terminalContent}>
              <div className={styles.terminalLine}>
                <span className={styles.prompt}>$</span>
                <span className={styles.command}> git clone https://github.com/Anankke/SSPanel-UIM.git</span>
              </div>
              <div className={styles.terminalLine}>
                <span className={styles.output}>Cloning into 'SSPanel-UIM'...</span>
              </div>
              <div className={styles.terminalLine}>
                <span className={styles.prompt}>$</span>
                <span className={styles.command}> cd SSPanel-UIM && php composer.phar install</span>
              </div>
              <div className={styles.terminalLine}>
                <span className={styles.output}>Installing dependencies...</span>
              </div>
              <div className={styles.terminalLine}>
                <span className={styles.success}>✓ SSPanel-UIM is ready to deploy!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.heroWave}>
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,48C960,53,1056,75,1152,80C1248,85,1344,75,1392,69.3L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
        </svg>
      </div>
    </header>
  );
}


function TrustSection() {
  return (
    <section className={styles.trustSection}>
      <div className="container">
        <div className={styles.trustGrid}>
          <div className={styles.trustItem}>
            <div className={styles.trustIcon}>🏛️</div>
            <div className={styles.trustTitle}>经典之选</div>
            <div className={styles.trustDesc}>最早的开源代理面板</div>
          </div>
          <div className={styles.trustItem}>
            <div className={styles.trustIcon}>🛡️</div>
            <div className={styles.trustTitle}>久经考验</div>
            <div className={styles.trustDesc}>数千站点的生产环境验证</div>
          </div>
          <div className={styles.trustItem}>
            <div className={styles.trustIcon}>🌍</div>
            <div className={styles.trustTitle}>生态成熟</div>
            <div className={styles.trustDesc}>完善的插件和主题系统</div>
          </div>
          <div className={styles.trustItem}>
            <div className={styles.trustIcon}>👥</div>
            <div className={styles.trustTitle}>社区活跃</div>
            <div className={styles.trustDesc}>持续的更新和技术支持</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function QuickStart() {
  return (
    <section className={styles.quickStart}>
      <div className="container">
        <div className={styles.quickStartContent}>
          <div className={styles.quickStartText}>
            <Heading as="h2">准备好开始了吗？</Heading>
            <p>跟随我们的文档，快速部署属于你的 SSPanel 服务</p>
          </div>
          <div className={styles.quickStartButtons}>
            <Link to="/docs/installation/quick-install" className="button button--primary button--lg">
              快速安装指南
            </Link>
            <Link to="/docs/intro" className="button button--outline button--lg">
              查看文档
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`SSPanel-UIM - 最经典的代理服务管理面板`}
      description="SSPanel-UIM 是历史最悠久、最受信赖的开源代理服务管理面板。始于2015年，经过九年发展，已成为行业标准。">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <TrustSection />
        <QuickStart />
      </main>
    </Layout>
  );
}