import { useEffect, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import type { WorkerRequest, WorkerResponse } from '../worker';

export const Route = createFileRoute('/comlink')({
  component: WorkerPage,
});

// Type-safe Worker wrapper
class TypedWorker {
  private worker: Worker;
  private getDataCallback: ((data: string) => void) | null = null;
  private heavyComputationCallback: ((data: number) => void) | null = null;

  constructor(worker: Worker) {
    this.worker = worker;
    this.worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const response = event.data;
      if (response.type === 'getData' && this.getDataCallback) {
        this.getDataCallback(response.data);
        this.getDataCallback = null;
        return;
      }

      if (response.type === 'heavyComputation' && this.heavyComputationCallback) {
        this.heavyComputationCallback(response.data);
        this.heavyComputationCallback = null;
      }
    };
  }

  async getData(): Promise<string> {
    return new Promise((resolve) => {
      this.getDataCallback = resolve;
      const request: WorkerRequest = { type: 'getData' };
      this.worker.postMessage(request);
    });
  }

  async heavyComputation(num: number): Promise<number> {
    return new Promise((resolve) => {
      this.heavyComputationCallback = resolve;
      const request: WorkerRequest = { type: 'heavyComputation', payload: num };
      this.worker.postMessage(request);
    });
  }

  terminate() {
    this.worker.terminate();
  }
}

function WorkerPage() {
  const [data, setData] = useState<string>('');
  const [computationResult, setComputationResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [workerApi, setWorkerApi] = useState<TypedWorker | null>(null);

  useEffect(() => {
    console.log('[Main] Creating Vite Native Worker...');

    // Vite's official way to load workers
    const worker = new Worker(new URL('../worker.ts', import.meta.url), {
      type: 'module',
    });

    const typedWorker = new TypedWorker(worker);
    console.log('[Main] Worker ready');
    setWorkerApi(typedWorker);

    return () => {
      console.log('[Main] Cleanup...');
      typedWorker.terminate();
    };
  }, []);

  const handleGetData = async () => {
    if (!workerApi) return;
    try {
      console.log('[Main] Calling getData()...');
      const result = await workerApi.getData();
      console.log('[Main] Received:', result);
      setData(result);
    } catch (error) {
      console.error('[Main] Error:', error);
    }
  };

  const handleHeavyComputation = async () => {
    if (!workerApi) return;
    setLoading(true);
    try {
      console.log('[Main] Calling heavyComputation()...');
      const result = await workerApi.heavyComputation(10_000_000);
      console.log('[Main] Computation result:', result);
      setComputationResult(result);
    } catch (error) {
      console.error('[Main] Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 font-sans max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Vite Native Worker Demo ⚡</h1>
      <p className="text-gray-600 mb-8">
        TanStack Start + Vite = 라이브러리 없이 완벽한 Web Worker!
      </p>

      <div className="mb-8 p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">1. Simple Data Fetch</h2>
        <button
          onClick={handleGetData}
          disabled={!workerApi}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Get Data from Worker
        </button>
        {data && (
          <p className="mt-4">
            Result: <strong className="text-blue-600">{data}</strong>
          </p>
        )}
      </div>

      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">2. Heavy Computation (Off-Main-Thread)</h2>
        <p className="text-gray-600 mb-4">
          This calculation runs in the background, so the UI remains responsive.
        </p>
        <button
          onClick={handleHeavyComputation}
          disabled={!workerApi || loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? 'Calculating...' : 'Run Heavy Computation'}
        </button>
        {computationResult !== null && (
          <p className="mt-4">
            Result: <strong className="text-green-600">{computationResult.toFixed(2)}</strong>
          </p>
        )}
      </div>
    </div>
  );
}

export default WorkerPage;
