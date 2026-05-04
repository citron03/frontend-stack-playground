'use client';

import 'tui-grid/dist/tui-grid.css';

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import Grid from 'tui-grid';
import type { OptGrid, OptRow, OptRowHeader } from 'tui-grid/types/options';

export interface TuiGridReactProps {
  data?: OptRow[]; // 데이터
  columns: { header: string; name: string; width?: number }[]; // 컬럼 정의
  rowHeaders?: OptRowHeader[];
  gridOptions?: Partial<OptGrid>; // 추가 옵션
}

export interface TuiGridReactRef {
  reloadData: (newData: OptRow[]) => void; // 데이터 갱신
  getInstance: () => Grid | null; // 인스턴스 반환
}

const TuiGridReact = forwardRef<TuiGridReactRef, TuiGridReactProps>(
  ({ data = [], columns, rowHeaders, gridOptions }, ref) => {
    const gridRef = useRef<HTMLDivElement>(null);
    const instanceRef = useRef<Grid | null>(null);

    useEffect(() => {
      if (!gridRef.current) {
        return;
      }

      // ! Grid 인스턴스 생성 (TypeError: Cannot read properties of null (reading 'clientHeight') 에러 발생으로 인한 DOM 로딩 기다리고 렌더링)
      requestAnimationFrame(() => {
        // if (instanceRef.current) {
        //   instanceRef.current.destroy();
        // }

        // strict mode 켜면 그리드 두 개 렌더링 됨
        instanceRef.current = new Grid({
          el: gridRef.current!,
          data,
          columns,
          rowHeaders,
          ...gridOptions,
        });
      });

      return () => {
        instanceRef.current?.destroy();
        instanceRef.current = null;
      };
    }, [data, columns, rowHeaders, gridOptions]);

    useImperativeHandle(ref, () => ({
      reloadData: (newData) => {
        instanceRef.current?.resetData(newData);
      },
      getInstance: () => instanceRef.current,
    }));

    return <div ref={gridRef} />;
  },
);

export default TuiGridReact;
