import { useRef } from 'react';
import { ConnectorLayer, type EdgeSpec, type Locale, type Tone } from './ResearchExplainerPrimitives';

export function ServerExplainer({ locale, step, onStep }: { locale: Locale; step: number; onStep: (step: number) => void }) {
  const zh = locale === 'zh';
  const sceneRef = useRef<HTMLDivElement>(null);
  const details = [
    { title: 'Host Docker daemon', body: zh ? '宿主服务负责真正创建、停止和管理容器。它与 dev-wangr 不是父子容器关系。' : 'The host service actually creates, stops, and manages containers. It is not a parent container of dev-wangr.' },
    { title: 'dev-wangr / wangr-dev', body: zh ? '这里的 shell 是 root UID 0；root 身份描述控制容器内部，不等于已验证的 physical-host root。' : 'The shell here is root UID 0; that identity is inside the control container and is not verified physical-host root.' },
    { title: '/var/run/docker.sock', body: zh ? 'Docker socket 把 Docker CLI 请求送到 host daemon，因此提供很强的技术控制能力；能力不等于获准操作所有 sibling resources。' : 'The Docker socket sends Docker CLI requests to the host daemon and therefore provides strong technical control capability; capability is not authorization over all sibling resources.' },
    { title: 'isolated experiment container', body: zh ? '科研任务以 non-root UID/GID 1001:1001、explicit GPU、no Docker socket 运行，把控制面与科学执行面分开。' : 'Scientific work runs non-root as UID/GID 1001:1001 with explicit GPU assignment and no Docker socket, separating control from execution.' },
    { title: '/data/home/wangr/workspace', body: zh ? '容器是可替换执行壳；代码身份、数据、adapter、日志、Run Manifest 等长期状态写到持久 workspace。' : 'Containers are replaceable execution shells; durable state such as code identity, data, adapters, logs, and Run Manifests lives in the persistent workspace.' },
    { title: zh ? '其他用户 sibling containers' : 'other users’ sibling containers', body: zh ? '同一个 daemon 技术上可见 dev-guozy / dev-huzh 等容器，不代表项目授权进入、停止或清理它们。' : 'The same daemon can technically see containers such as dev-guozy / dev-huzh; that does not authorize entering, stopping, or cleaning them.' },
  ];
  const edges: EdgeSpec[] = [
    { id: 'dev-socket', from: 'srv-dev', to: 'srv-socket', tone: 'state', fromAnchor: 'bottom', toAnchor: 'top', dashed: true, active: step >= 1 },
    { id: 'socket-daemon', from: 'srv-socket', to: 'srv-daemon', tone: 'state', fromAnchor: 'left', toAnchor: 'left', dashed: true, shape: 'perimeter-left', active: step >= 2 },
    { id: 'daemon-exp', from: 'srv-daemon', to: 'srv-exp', tone: 'env', fromAnchor: 'bottom', toAnchor: 'top', active: step >= 3 },
    { id: 'daemon-siblings', from: 'srv-daemon', to: 'srv-siblings', tone: 'neutral', fromAnchor: 'right', toAnchor: 'top', dashed: true, active: step >= 5 },
    { id: 'dev-workspace', from: 'srv-dev', to: 'srv-workspace', tone: 'persist', fromAnchor: 'left', toAnchor: 'left', shape: 'perimeter-left', active: step >= 4 },
    { id: 'exp-workspace', from: 'srv-exp', to: 'srv-workspace', tone: 'persist', fromAnchor: 'bottom', toAnchor: 'right', active: step >= 4 },
  ];
  const nodeButton = (index: number, id: string, role: string, title: string, detail: string, className: string, tone: Tone) => (
    <button type="button" className={`irx-server-node ${className} irx-tone-${tone}`} data-flow-id={id} data-ui-audit-item data-active={step === index} aria-pressed={step === index} onClick={() => onStep(index)}><span>{role}</span><strong>{title}</strong><small>{detail}</small></button>
  );
  return (
    <div className="irx-server-layout" data-ui-audit="contrast layout">
      <figure className="irx-host-boundary" ref={sceneRef}>
        <figcaption><span>{zh ? '物理 / 云宿主边界' : 'Physical / cloud host boundary'}</span><strong>OpenEvo Server Host</strong></figcaption>
        {nodeButton(0, 'srv-daemon', 'HOST SERVICE', 'Docker daemon', 'Engine 29.1.3', 'srv-daemon', 'neutral')}
        {nodeButton(1, 'srv-dev', 'MY CONTROL PLANE', 'dev-wangr / wangr-dev', 'root UID 0 · Docker CLI', 'srv-dev', 'state')}
        {nodeButton(2, 'srv-socket', 'CONTROL CHANNEL', '/var/run/docker.sock', 'Docker API → host daemon', 'srv-socket', 'state')}
        {nodeButton(3, 'srv-exp', 'SCIENCE RUNTIME', 'isolated experiment container', 'UID/GID 1001:1001 · explicit GPU · no Docker socket', 'srv-exp', 'env')}
        {nodeButton(4, 'srv-workspace', 'PERSISTENT STATE', '/data/home/wangr/workspace', 'repos · data · models · runs · manifests', 'srv-workspace', 'persist')}
        {nodeButton(5, 'srv-siblings', 'SIBLING USERS', 'dev-guozy · dev-huzh · …', zh ? '可见 ≠ 获授权操作' : 'visible ≠ authorized to operate', 'srv-siblings', 'neutral')}
        <ul className="irx-mobile-relations" aria-label={zh ? '移动端权限关系摘要' : 'Mobile authority relationship summary'}>
          <li><span>CONTROL</span><b>dev-wangr + Docker socket</b><small>{zh ? '向 host Docker daemon 发请求' : 'requests operations from the host Docker daemon'}</small></li>
          <li><span>SIBLINGS</span><b>daemon manages experiment + user containers</b><small>{zh ? '不是 dev-wangr 的子容器' : 'they are not child containers of dev-wangr'}</small></li>
          <li><span>PERSISTENCE</span><b>workspace</b><small>{zh ? '控制容器与实验容器都可写入获准的长期状态' : 'authorized durable state can be mounted by control and experiment containers'}</small></li>
        </ul>
        <ConnectorLayer containerRef={sceneRef} edges={edges} ariaLabel={zh ? '控制容器通过 Docker socket 调用 host daemon；daemon 管理 sibling experiment/user containers；持久状态在 workspace' : 'The control container calls the host daemon through the Docker socket; the daemon manages sibling experiment/user containers; durable state lives in the workspace'} />
      </figure>
      <aside className="irx-authority-inspector"><span>AUTHORITY INSPECTOR</span><strong>{details[step].title}</strong><p>{details[step].body}</p><div><b>{zh ? '必须同时记住' : 'Keep both distinctions'}</b><code>container root ≠ physical-host ownership</code><code>technical capability ≠ authorization scope</code></div></aside>
    </div>
  );
}
