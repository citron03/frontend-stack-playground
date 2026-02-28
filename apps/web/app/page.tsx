import Link from 'next/link';

import InstallButton from './components/InstallButton';

export default function Home() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        margin: '50px',
        width: '100vw',
        height: '100vh',
      }}
    >
      <Link href="/compiler-test">compiler test</Link>
      <Link href="/mouse-event-order-test">mouse event order test</Link>
      <Link href="/mouse-event-test">mouse event test</Link>
      <Link href="/modal-xstate">modal xstate</Link>
      <Link href="/next-modal/screen">next modal</Link>
      <Link href="/tui-grid">Tui Grid</Link>
      <Link href="/vanilla-extract-test">Vanilla Extract Test</Link>
      <Link href="/semantic">Semantic</Link>
      <Link href="/mdx-page">MDX Page</Link>
      <Link href="/virtual-list">Virtual List Page</Link>
      <Link href="/context-menu">Context Menu Page</Link>
      <Link href="/signal">Signal Page</Link>
      <Link href="/loadable">Loadable Component Page</Link>
      <Link href="/index-db-test">IndexDB Page</Link>
      <Link href="/events-demo">React Event Wrapper Page</Link>
      <Link href="/activity-demo">React Activity Test Page</Link>
      <Link href="/submodule-colors">Submodule Colors Demo</Link>
      <div>
        <InstallButton />
      </div>
    </div>
  );
}
