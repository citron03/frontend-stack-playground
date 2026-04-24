import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { ColorPicker } from '../components/ColorPicker';

const meta: Meta<typeof ColorPicker> = {
  title: 'Components/ColorPicker',
  component: ColorPicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const ColorPickerWithState = () => {
  const [color, setColor] = useState('#ff0000');

  return <ColorPicker color={color} onChange={(c) => setColor(c.hex)} />;
};

export const Default: Story = {
  render: () => <ColorPickerWithState />,
};
