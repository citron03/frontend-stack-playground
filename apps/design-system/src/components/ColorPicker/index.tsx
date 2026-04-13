'use client';

import { useState, useEffect, type ReactElement } from 'react';
import { SketchPicker, ColorResult } from 'react-color';
import { useFloating, autoUpdate, offset, flip, shift } from '@floating-ui/react';
import * as styles from './index.css';

export interface ColorPickerProps {
  color: string;
  onChange: (color: ColorResult) => void;
}

export const ColorPicker = ({ color, onChange }: ColorPickerProps): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalColor, setInternalColor] = useState(color);
  const { refs, floatingStyles } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(10), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  useEffect(() => {
    setInternalColor(color);
  }, [color]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSketchPickerChange = (newColor: ColorResult) => {
    setInternalColor(newColor.hex);
  };

  const handleSketchPickerChangeComplete = (newColor: ColorResult) => {
    onChange(newColor);
  };

  return (
    <div>
      <div ref={refs.setReference} className={styles.swatch} onClick={() => setIsOpen(!isOpen)}>
        <div className={styles.colorSwatch} style={{ background: color }} />
      </div>
      {isOpen ? (
        <div ref={refs.setFloating} style={floatingStyles} className={styles.popover}>
          <div className={styles.cover} onClick={handleClose} />
          <SketchPicker
            color={internalColor}
            onChange={handleSketchPickerChange}
            onChangeComplete={handleSketchPickerChangeComplete}
          />
        </div>
      ) : null}
    </div>
  );
};
