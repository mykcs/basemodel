import { useRef } from 'react';
import '../../../styles/interactive-research-explainer-server.css';
import { ConnectorLayer, type EdgeSpec, type Locale, type Tone } from './ResearchExplainerPrimitives';

export function ServerExplainer({ locale, step, onStep }: { locale: Locale; step: number; onStep: (step: number) => void }) {
  const zh = locale === 'zh';
  const sceneRef = useRef<HTMLDivElement>(null);
  const details = [
    { title: 'Host Docker daemon', body: zh ? '宿主侧 Docker daemon 负责真正创建、停止和管理容器。当前 SSH shell 位于开发容器，因此这里能验证的是容器与 daemon 的关系，不是完整 physical-host 管理权。' : 'The host-side Docker daemon actually creates, stops, and manages containers. The current SSH shell is inside a development container, so this verifies the container-to-daemon relationship rather than full physical-host authority.' },
    { title: zh ? '当前开发容器' : 'current development container', body: zh ? '这里可以出现 root UID 0，但这个 root 身份属于开发容器。container root、Docker admin 与 physical-host root 是三种不同的权限结论。' : 'root UID 0 can exist here, but that identity belongs to the development container. Container root, Docker admin, and physical-host root are three different authority claims.' },
    { title: '/var/run/docker.sock', body: zh ? 'Docker socket 把 CLI 请求送到共享 host daemon，因此提供很强的技术控制能力；技术能力不等于获授权操作所有 sibling resources。' : 'The Docker socket sends CLI requests to the shared host daemon and therefore provides strong technical control capability; technical capability is not authorization over every sibling resource.' },
    { title: zh ? '隔离实验容器' : 'isolated experiment container', body: zh ? '科研任务应以普通用户身份、显式 GPU 分配、无 Docker socket 的实验容器运行，把控制面与科学执行面分开。' : 'Scientific work should run as an ordinary user in an experiment container with explicit GPU assignment and no Docker socket, separating control from execution.' },
    { title: zh ? '持久实验状态' : 'persistent experiment state', body: zh ? '容器是可替换执行壳；代码、数据、adapter、日志和 Run Manifest 等长期状态应该写入获准的持久 workspace，而不是只放在 container overlay。' : 'Containers are replaceable execution shells; durable state such as code, data, adapters, logs, and Run Manifests should live in an approved persistent workspace rather than only in container overlay.' },
    { title: zh ? '其他用户 sibling containers' : 'other users’ sibling containers', body: zh ? '同一个 daemon 可以技术上看到 User A / User B / … 的 sibling containers。可见只说明共享拓扑存在，不代表有权进入、停止、清理或读取其他人的资源。' : 'The same daemon can technically see sibling containers for User A / User B / …. Visibility only demonstrates a shared topology; it does not authorize entering, stopping, cleaning, or reading other users’ resources.' },
  ];
  const edges: EdgeSpec[] = [
    { id: 'dev-socket', from: 'srv-dev', to: 'srv-socket', tone: 'state', fromAnchor: 'bottom', toAnchor: 'top', dashed: true, active: step >= 1 },
    { id: 'socket-daemon', from: 'srv-socket', to: 'srv-daemon', tone: 'state', fromAnchor: 'left', toAnchor: 'left', dashed: true, shape: 'perimeter-left', active: step >= 2 },
    { id: 'daemon-exp', from: 'srv-daemon', to: 'srv-exp', tone: 'env', fromAnchor: 'bottom', toAnchor: 'top', active: step >= 3 },
    { id: 'daemon-siblings', from: 'srv-daemon', to: 'srv-siblings', tone: 'neutral', fromAnchor: 'right', toAnchor: 'top', dashed: true, shape: 'outside-right-down', active: step >= 5 },
    { id: 'dev-workspace', from: 'srv-dev', to: 'srv-workspace', tone: 'persist', fromAnchor: 'left', toAnchor: 'left', shape: 'perimeter-left', active: step >= 4 },
    { id: 'exp-workspace', from: 'srv-exp', to: 'srv-workspace', tone: 'persist', fromAnchor: 'bottom', toAnchor: 'right', active: step >= 4 },
  ];
  const nodeButton = (index: number, id: string, role: string, title: string, detail: string, className: string, tone: Tone) => (
    <button type="button" className={`irx-server-node ${className} irx-tone-${tone}`} data-flow-id={id} data-ui-audit-item data-active={step === index} aria-pressed={step === index} onClick={() => onStep(index)}><span>{role}</span><strong>{title}</strong><small>{detail}</small></button>
  );
  return (
    <div className="irx-server-layout" data-ui-audit="contrast layout">
      <figure className="irx-host-boundary" ref={sceneRef}>
        <figcaption><span>{zh ? '物理 / 云宿主边界' : 'Physical / cloud host boundary'}</span><strong>{zh ? '共享 GPU 服务器' : 'Shared GPU server'}</strong></figcaption>
        <div className="irx-gpu-row" role="group" aria-label={zh ? '8 块 GPU；高亮两块为实验容器的显式分配示例' : '8 GPUs; two highlighted as an example explicit assignment'}>
          {Array.from({ length: 8 }, (_, index) => (
            <span key={index} className="irx-gpu-chip" data-assigned={step >= 3 && index < 2}>GPU{index}</span>
          ))}
          <small>{zh ? '高亮 = 显式分配示例（示意）' : 'highlighted = example explicit assignment (schematic)'}</small>
        </div>
        {nodeButton(0, 'srv-daemon', 'HOST SERVICE', 'Docker daemon', 'Engine 29.1.3', 'srv-daemon', 'neutral')}
        {nodeButton(1, 'srv-dev', 'MY CONTROL PLANE', zh ? '当前开发容器' : 'current development container', 'root UID 0 · Docker CLI', 'srv-dev', 'state')}
        {nodeButton(2, 'srv-socket', 'CONTROL CHANNEL', '/var/run/docker.sock', 'Docker API → host daemon', 'srv-socket', 'state')}
        {nodeButton(3, 'srv-exp', 'SCIENCE RUNTIME', zh ? '隔离实验容器' : 'isolated experiment container', zh ? 'ordinary UID · explicit GPU · no Docker socket' : 'ordinary UID · explicit GPU · no Docker socket', 'srv-exp', 'env')}
        {nodeButton(4, 'srv-workspace', 'PERSISTENT STATE', zh ? '获准的持久 workspace' : 'approved persistent workspace', 'repos · data · models · runs · manifests', 'srv-workspace', 'persist')}
        {nodeButton(5, 'srv-siblings', 'SIBLING USERS', 'User A · User B · …', zh ? '可见 ≠ 获授权操作' : 'visible ≠ authorized to operate', 'srv-siblings', 'neutral')}
        <ul className="irx-mobile-relations" aria-label={zh ? '移动端权限关系摘要' : 'Mobile authority relationship summary'}>
          <li><span>CONTROL</span><b>{zh ? '开发容器 + Docker socket' : 'development container + Docker socket'}</b><small>{zh ? '向 host Docker daemon 发请求' : 'requests operations from the host Docker daemon'}</small></li>
          <li><span>SIBLINGS</span><b>daemon manages experiment + user containers</b><small>{zh ? '它们是 sibling resources，不是当前开发容器的子容器' : 'they are sibling resources, not child containers of the current development container'}</small></li>
          <li><span>PERSISTENCE</span><b>{zh ? '持久 workspace' : 'persistent workspace'}</b><small>{zh ? '长期状态应写入获准的持久层' : 'durable state belongs in an approved persistent layer'}</small></li>
        </ul>
        <ConnectorLayer containerRef={sceneRef} edges={edges} ariaLabel={zh ? '开发容器通过 Docker socket 调用 host daemon；daemon 管理 sibling experiment/user containers；长期状态写入持久 workspace' : 'The development container calls the host daemon through the Docker socket; the daemon manages sibling experiment/user containers; durable state is written to persistent workspace'} />
      </figure>
      <aside className="irx-authority-inspector"><span>AUTHORITY INSPECTOR</span><strong>{details[step]!.title}</strong><p>{details[step]!.body}</p><div><b>{zh ? '必须同时记住' : 'Keep both distinctions'}</b><code>container root ≠ physical-host root</code><code>technical capability ≠ authorization scope</code></div></aside>
    </div>
  );
}
