import { render, screen } from '@testing-library/react';
import TestPrAgentPage from '../page';

test('renders title', () => {
  render(<TestPrAgentPage />);
  expect(screen.getByText(/Test PR Agent Page/i)).toBeInTheDocument();
});
