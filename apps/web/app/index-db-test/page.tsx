'use client';
import React, { useState } from 'react';

interface IndexedDbPost {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
}

export default function IndexDbTestPage() {
  const [dbStatus, setDbStatus] = useState('');
  const [added, setAdded] = useState(false);
  const [fetched, setFetched] = useState<IndexedDbPost | null>(null);

  // IndexedDB 열기 및 ObjectStore 생성
  const openDb = () => {
    const request = indexedDB.open('MyTestDatabase', 1);
    request.onupgradeneeded = function (event) {
      const db = (event.target as IDBOpenDBRequest).result;
      db.createObjectStore('myObjectStore', { keyPath: 'id' });
      setDbStatus('onupgradeneeded: ObjectStore 생성됨');
    };
    request.onsuccess = function (event) {
      setDbStatus('데이터베이스가 성공적으로 열렸습니다.');
    };
    request.onerror = function (event) {
      setDbStatus('데이터베이스 열기 오류: ' + (event.target as IDBOpenDBRequest).error?.message);
    };
  };

  // 데이터 추가
  const addData = () => {
    const request = indexedDB.open('MyTestDatabase', 1);
    request.onsuccess = function (event) {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction(['myObjectStore'], 'readwrite');
      const objectStore = transaction.objectStore('myObjectStore');
      const data: IndexedDbPost = {
        id: 1,
        title: 'IndexedDB 블로그 글',
        content: 'IndexedDB는 정말 유용해!',
        author: 'citron',
        date: new Date().toISOString(),
      };
      const addRequest = objectStore.add(data);
      addRequest.onsuccess = function () {
        setAdded(true);
        setDbStatus('데이터가 성공적으로 추가되었습니다.');
      };
      addRequest.onerror = function () {
        setDbStatus('데이터 추가 오류: ' + addRequest.error?.message);
      };
    };
    request.onerror = function (event) {
      setDbStatus('데이터베이스 열기 오류: ' + (event.target as IDBOpenDBRequest).error?.message);
    };
  };

  // 데이터 읽기
  const getData = () => {
    const request = indexedDB.open('MyTestDatabase', 1);
    request.onsuccess = function (event) {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction(['myObjectStore'], 'readonly');
      const objectStore = transaction.objectStore('myObjectStore');
      const getRequest = objectStore.get(1);
      getRequest.onsuccess = function (event) {
        const result = (event.target as IDBRequest).result;
        if (result) {
          setFetched(result);
          setDbStatus('데이터를 성공적으로 읽었습니다.');
        } else {
          setDbStatus('데이터를 찾을 수 없습니다.');
        }
      };
      getRequest.onerror = function () {
        setDbStatus('데이터 읽기 오류: ' + getRequest.error?.message);
      };
    };
    request.onerror = function (event) {
      setDbStatus('데이터베이스 열기 오류: ' + (event.target as IDBOpenDBRequest).error?.message);
    };
  };

  return (
    <main style={{ padding: 32 }}>
      <h1>IndexedDB 기본 예제</h1>
      <p>아래 버튼을 눌러 IndexedDB를 직접 사용해보세요.</p>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button onClick={openDb}>DB 열기/생성</button>
        <button onClick={addData}>데이터 추가</button>
        <button onClick={getData}>데이터 읽기</button>
      </div>
      <div>
        <strong>상태:</strong> {dbStatus}
      </div>
      {added && <div style={{ color: 'green' }}>✔️ 데이터가 추가됨</div>}
      {fetched && (
        <div style={{ marginTop: 16 }}>
          <strong>가져온 데이터:</strong>
          <pre>{JSON.stringify(fetched, null, 2)}</pre>
        </div>
      )}
      <hr style={{ margin: '32px 0' }} />
      <section>
        <h2>IndexedDB 특징</h2>
        <ul>
          <li>트랜잭션 기반으로 데이터 무결성 보장</li>
          <li>비동기 방식으로 UI 차단 없음</li>
          <li>객체 스토어로 구조화된 데이터 저장</li>
        </ul>
        <h2>장점</h2>
        <ul>
          <li>오프라인 접근성</li>
          <li>대용량 데이터 저장 가능</li>
          <li>구조화된 데이터(JavaScript 객체) 저장</li>
        </ul>
      </section>
    </main>
  );
}
