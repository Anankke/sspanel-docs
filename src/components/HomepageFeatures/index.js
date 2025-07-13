import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: '经过时间考验',
    icon: '⏰',
    description: (
      <>
        九年持续开发，历经无数版本迭代。从最初的简单面板
        发展成为功能完善的企业级解决方案。
      </>
    ),
  },
  {
    title: '成熟的架构设计',
    icon: '🏗️',
    description: (
      <>
        基于 MVC 架构，代码结构清晰，易于理解和维护。
        数千个生产环境部署，稳定性经过充分验证。
      </>
    ),
  },
  {
    title: '完整的功能体系',
    icon: '🎯',
    description: (
      <>
        用户管理、节点管理、财务系统、工单系统一应俱全。
        多年积累的功能细节，满足各种运营需求。
      </>
    ),
  },
  {
    title: '丰富的生态系统',
    icon: '🌳',
    description: (
      <>
        成熟的插件体系，多样的主题选择。社区贡献的
        各种扩展，让定制化变得简单。
      </>
    ),
  },
  {
    title: '广泛的用户基础',
    icon: '🌍',
    description: (
      <>
        全球数千个站点在使用，积累了丰富的最佳实践。
        活跃的用户社区，问题总能找到解决方案。
      </>
    ),
  },
  {
    title: '持续的技术演进',
    icon: '🔄',
    description: (
      <>
        紧跟技术发展，支持最新的 PHP 8.4。
        定期更新，确保安全性和兼容性。
      </>
    ),
  },
];

function Feature({icon, title, description}) {
  return (
    <div className={clsx('col col--4', styles.feature)}>
      <div className={styles.featureIcon}>{icon}</div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.featuresHeader}>
          <Heading as="h2" className={styles.featuresTitle}>
            经典选择，历久弥新
          </Heading>
          <p className={styles.featuresSubtitle}>
            作为最早的开源代理面板，SSPanel-UIM 凭借深厚积淀赢得了广泛信任
          </p>
        </div>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}