import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: '快速部署',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        支持一键脚本安装和 Docker 部署，让你在几分钟内搭建好 SSPanel 服务。
        完整的安装指南和故障排除文档。
      </>
    ),
  },
  {
    title: '功能强大',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        支持多种代理协议，完善的用户管理系统，灵活的订阅和套餐配置，
        以及强大的流量统计功能。
      </>
    ),
  },
  {
    title: '活跃社区',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        拥有活跃的开发者社区，持续更新维护。丰富的插件生态系统，
        可以根据需求扩展功能。
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
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
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
