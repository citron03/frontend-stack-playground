import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Header from '../components/Header';

// Mock TanStack Router components
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}));

describe('Header', () => {
  it('renders header with menu button and logo', () => {
    render(<Header />);

    expect(screen.getByRole('button', { name: /open menu/i })).toBeInTheDocument();
    expect(screen.getByAltText('TanStack Logo')).toBeInTheDocument();
  });

  it('opens sidebar when menu button is clicked', () => {
    render(<Header />);

    const menuButton = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(menuButton);

    expect(screen.getByText('Navigation')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /close menu/i })).toBeInTheDocument();
  });

  it('closes sidebar when close button is clicked', () => {
    render(<Header />);

    const menuButton = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(menuButton);

    const closeButton = screen.getByRole('button', { name: /close menu/i });
    fireEvent.click(closeButton);

    // Check that sidebar is hidden (has translate-x-full class)
    const sidebar = screen.getByRole('complementary');
    expect(sidebar).toHaveClass('-translate-x-full');
  });

  it('expands and collapses grouped links', () => {
    render(<Header />);

    // Open menu
    const menuButton = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(menuButton);

    // Find the expand button
    const expandButton = screen.getByRole('button', { name: /toggle start ssr demos/i });
    fireEvent.click(expandButton);

    // Check if sub-links are visible
    expect(screen.getByText('SPA Mode')).toBeInTheDocument();
    expect(screen.getByText('Full SSR')).toBeInTheDocument();
    expect(screen.getByText('Data Only')).toBeInTheDocument();

    // Click again to collapse
    fireEvent.click(expandButton);

    // Sub-links should be hidden
    expect(screen.queryByText('SPA Mode')).not.toBeInTheDocument();
  });

  it('closes sidebar when link is clicked', () => {
    render(<Header />);

    const menuButton = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(menuButton);

    const homeLink = screen.getByText('Home');
    fireEvent.click(homeLink);

    // Check that sidebar is hidden
    const sidebar = screen.getByRole('complementary');
    expect(sidebar).toHaveClass('-translate-x-full');
  });

  it('closes sidebar when start links are clicked', () => {
    render(<Header />);

    const menuButton = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(menuButton);

    const serverFuncsLink = screen.getByText('Start - Server Functions');
    fireEvent.click(serverFuncsLink);

    const sidebarAfterServerFuncs = screen.getByRole('complementary');
    expect(sidebarAfterServerFuncs).toHaveClass('-translate-x-full');

    fireEvent.click(menuButton);

    const apiRequestLink = screen.getByText('Start - API Request');
    fireEvent.click(apiRequestLink);

    const sidebarAfterApiRequest = screen.getByRole('complementary');
    expect(sidebarAfterApiRequest).toHaveClass('-translate-x-full');
  });
});
